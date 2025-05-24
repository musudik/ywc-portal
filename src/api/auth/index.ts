import axios from 'axios';
import { getToken, clearAuthData, saveAuthData } from '../../utils/tokenUtils';
import {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  VerifyEmailRequest,
  UpdateProfileRequest,
  User,
  AuthResponse,
  MessageResponse,
  FirebaseWebhookRequest
} from './types';

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AUTH_API = `${API_URL}/api/auth`;

// Create axios instance
const api = axios.create({
  baseURL: AUTH_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn(`No token available for request to ${config.url}`);
  }
  return config;
}, (error) => {
  console.error('Error in request interceptor:', error);
  return Promise.reject(error);
});

// Handle 401 responses (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(`API error: ${error.response.status} on ${error.config.url}`);
      
      // Handle unauthorized errors
      if (error.response.status === 401) {
        // Dispatch unauthorized event to notify app to attempt token refresh
        window.dispatchEvent(new Event('auth:unauthorized'));
        
        // If this was already the refresh token endpoint, clear auth data
        if (error.config.url.includes('/refresh-token')) {
          console.warn('Token refresh failed, logging out');
          clearAuthData();
          window.dispatchEvent(new Event('auth:logout'));
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    // Store token in local storage using our utility
    saveAuthData(response.data.token, response.data.user, response.data.expiresIn);
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token available for refresh');
      }
      
      const response = await api.post('/refresh-token');
      
      // Save the new token data
      if (response.data && response.data.token) {
        saveAuthData(
          response.data.token, 
          response.data.user, 
          response.data.expiresIn || '24h'
        );
      }
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      throw error;
    }
  },

  // Logout user - just a helper to clear token from storage
  logout: (): void => {
    console.log('Starting logout process...');
    
    try {
      // Try to call the logout endpoint
      // Use a timeout to prevent hanging during logout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      api.post('/logout', {}, { signal: controller.signal })
        .then(() => {
          console.log('Logout endpoint called successfully');
        })
        .catch((error) => {
          // Ignore errors - we're logging out anyway
          console.log('Logout endpoint failed (ignored):', error.message);
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });
    } catch (e) {
      console.error('Error calling logout endpoint:', e);
    }
    
    // Clear auth data immediately regardless of API call result
    clearAuthData();
    
    // Dispatch event to notify other parts of the app
    window.dispatchEvent(new Event('auth:logout'));
    
    console.log('Logout process completed');
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/me');
    return response.data;
  },

  // Verify email
  verifyEmail: async (data: VerifyEmailRequest): Promise<MessageResponse> => {
    const response = await api.post('/verify-email', data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.put('/profile', data);
    return response.data;
  },
  
  // Firebase webhook handler (for server-side use only)
  firebaseWebhook: async (data: FirebaseWebhookRequest, secret: string): Promise<MessageResponse> => {
    const response = await axios.post(`${AUTH_API}/firebase-webhook`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Firebase-Webhook-Secret': secret
      }
    });
    return response.data;
  }
};

export default authApi; 