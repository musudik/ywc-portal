// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.yourwealth.coach/api/v1';

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Timeout for API requests in milliseconds
export const API_TIMEOUT = 30000; // 30 seconds 