import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
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
}, (error) => {
  console.error('Error in request interceptor:', error);
  return Promise.reject(error);
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API error: ${error.response.status} on ${error.config.url}`);
      
      // Handle unauthorized errors
      if (error.response.status === 401) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    } else if (error.request) {
      console.error('No response received from server:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 