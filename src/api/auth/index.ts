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
  }
  return config;
});

// Handle 401 responses (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Logout on 401 unauthorized responses (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear the auth data without calling our own logout function
      // to avoid circular dependencies
      clearAuthData();
      // Dispatch event to notify other parts of the app
      window.dispatchEvent(new Event('auth:logout'));
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

  // Logout user - just a helper to clear token from storage
  logout: (): void => {
    clearAuthData();
    // Dispatch event to notify other parts of the app
    window.dispatchEvent(new Event('auth:logout'));
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