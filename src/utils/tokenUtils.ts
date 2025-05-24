import { User } from '../api/auth/types';

// Key constants for localStorage
const TOKEN_KEY = 'ywc_auth_token';
const USER_KEY = 'ywc_user';
const EXPIRY_KEY = 'ywc_token_expiry';

// Add a flag to track if we're in the middle of clearing auth data
let isClearing = false;

/**
 * Save authentication data to localStorage
 */
export const saveAuthData = (token: string, user: User, expiresIn: string): void => {
  try {
    // Reset clearing flag when saving new auth data
    isClearing = false;
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Calculate expiry time
    const expiryTime = new Date();
    const expiryHours = parseInt(expiresIn.replace('h', ''), 10) || 1; // Default to 1 hour
    expiryTime.setHours(expiryTime.getHours() + expiryHours);
    localStorage.setItem(EXPIRY_KEY, expiryTime.toISOString());
    
    console.log('Auth data saved successfully for user:', user.email);
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

/**
 * Get the stored auth token
 */
export const getToken = (): string | null => {
  try {
    // If we're in the middle of clearing, don't return token
    if (isClearing) {
      console.log('Token retrieval blocked: auth data is being cleared');
      return null;
    }
    
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);
    
    // If no token exists, return null
    if (!token) {
      console.log('No authentication token found in localStorage');
      return null;
    }
    
    // Check if token is expired
    if (expiry) {
      const expiryTime = new Date(expiry);
      const now = new Date();
      
      if (expiryTime < now) {
        // Token expired, clear auth data
        console.warn(`Token expired at ${expiryTime.toISOString()}, current time is ${now.toISOString()}`);
        clearAuthData();
        return null;
      }
      
      // Log remaining time for debugging
      const remainingMs = expiryTime.getTime() - now.getTime();
      const remainingMins = Math.round(remainingMs / (1000 * 60));
      console.log(`Token valid for approximately ${remainingMins} more minutes`);
    } else {
      console.warn('Token found but no expiry time is set');
    }
    
    return token;
  } catch (error) {
    console.error('Error retrieving authentication token:', error);
    return null;
  }
};

/**
 * Get the stored user data
 */
export const getUser = (): User | null => {
  // If we're in the middle of clearing, don't return user data
  if (isClearing) {
    console.log('User data retrieval blocked: auth data is being cleared');
    return null;
  }
  
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  try {
    // Set clearing flag to prevent race conditions
    isClearing = true;
    
    console.log('Clearing authentication data...');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    
    // Small delay to ensure any pending requests see the clearing flag
    setTimeout(() => {
      isClearing = false;
      console.log('Authentication data cleared successfully');
    }, 100);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    isClearing = false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Get user role
 */
export const getUserRole = (): string | null => {
  const user = getUser();
  return user?.role?.name || null;
}; 