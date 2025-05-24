import axios from 'axios';
import { getToken } from '../../utils/tokenUtils';
import { User, UpdateProfileRequest } from '../auth/types';
import {
  PersonalDetailsInput,
  EmploymentDetailsInput,
  IncomeDetailsInput,
  ExpensesDetailsInput,
  AssetInput,
  LiabilityInput,
  GoalsAndWishesInput,
  RiskAppetiteInput,
  ProfileCompletionResponse
} from './types';

// Add type declaration for import.meta.env
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
      [key: string]: string | undefined;
    };
  }
}

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const PROFILE_API = `${API_URL}/api/profile`;
const BUSINESS_API = `${API_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: PROFILE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create business API instance
const businessApi = axios.create({
  baseURL: BUSINESS_API,
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
    console.warn(`API request to ${config.url} has no authorization token`);
    // For critical requests, we might want to reject them if no token is available
    // but for now, let them proceed and let the server handle the 401
  }
  return config;
}, (error) => {
  console.error('Error in profile API request interceptor:', error);
  return Promise.reject(error);
});

// Add token to business API requests
businessApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn(`Business API request to ${config.url} has no authorization token`);
    // For critical requests, we might want to reject them if no token is available
    // but for now, let them proceed and let the server handle the 401
  }
  return config;
}, (error) => {
  console.error('Error in business API request interceptor:', error);
  return Promise.reject(error);
});

// Handle unauthorized responses in API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(`Profile API error: ${error.response.status} on ${error.config.url}`);
      
      // Handle unauthorized errors
      if (error.response.status === 401 || error.response.status === 403) {
        // Trigger authentication refresh
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// Handle unauthorized responses in Business API
businessApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(`Business API error: ${error.response.status} on ${error.config.url}`);
      
      // Handle unauthorized errors
      if (error.response.status === 401 || error.response.status === 403) {
        // Trigger authentication refresh
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export interface ProfileDetails extends User {
  joinedDate?: string;
  accountType?: string;
  country?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  userId?: string;
}

// Profile API functions
export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<ProfileDetails> => {
    const response = await api.get('/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileDetails> => {
    const response = await api.put('/', data);
    return response.data;
  },

  // Get verification status
  getVerificationStatus: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/verification-status');
    return response.data;
  },

  // Request verification
  requestVerification: async (): Promise<{ message: string }> => {
    const response = await api.post('/request-verification');
    return response.data;
  },

  // Get profile completion status
  getProfileCompletionStatus: async (): Promise<ProfileCompletionResponse> => {
    const response = await api.get('/completion-status');
    return response.data;
  },

  // Personal Details
  getPersonalDetails: async (personalId?: string): Promise<PersonalDetailsInput | null> => {
    try {
      let response;
      if (personalId) {
        console.log(`Fetching personal details for personalId: ${personalId}`);
        response = await businessApi.get(`/personal-details/${personalId}`);
      } else {
        console.log("Fetching all personal details");
        response = await businessApi.get('/personal-details');
      }
      
      // Log the raw response for debugging
      console.log("Personal details API raw response:", response);
      
      // Handle the response as an array and return the first item
      const data = response.data;
      if (Array.isArray(data)) {
        if (data.length > 0) {
          console.log("Personal details received as array, returning first item:", data[0]);
          return data[0];
        } else {
          console.log("Personal details array is empty - user hasn't created personal details yet");
          return null; // Return null instead of throwing error for new users
        }
      }
      
      console.log("Personal details received as object:", data);
      return response.data;
    } catch (error) {
      console.error("Error fetching personal details:", error);
      throw error;
    }
  },

  savePersonalDetails: async (data: PersonalDetailsInput): Promise<PersonalDetailsInput> => {
    console.log("Creating new personal details:", data);
    const response = await businessApi.post('/personal-details', data);
    console.log("Create personal details response:", response.data);
    return response.data;
  },

  updatePersonalDetails: async (data: any): Promise<PersonalDetailsInput> => {
    console.log(`Updating personal details with personalId: ${data.id}`, data);
    if (!data.id) {
      console.error("Missing personalId for update operation");
      throw new Error("personalId is required for updating personal details");
    }
    const response = await businessApi.put(`/personal-details/${data.id}`, data);
    console.log("Update personal details response:", response.data);
    return response.data;
  },

  // Employment Details
  getEmploymentDetails: async (personalId: string): Promise<EmploymentDetailsInput> => {
    try {
      console.log(`Fetching employment details for personalId: ${personalId}`);
      const response = await businessApi.get(`/client-data/employment/${personalId}`);
      
      // Log the raw response for debugging
      console.log("Employment details API raw response:", response);
      
      // Handle the response as an array and return the first item
      const data = response.data;
      if (Array.isArray(data)) {
        if (data.length > 0) {
          console.log("Employment details received as array, returning first item:", data[0]);
          return data[0];
        } else {
          console.log("Employment details array is empty");
          throw new Error("No employment details found");
        }
      }
      
      console.log("Employment details received as object:", data);
      return response.data;
    } catch (error) {
      console.error("Error fetching employment details:", error);
      throw error;
    }
  },

  saveEmploymentDetails: async (data: EmploymentDetailsInput): Promise<EmploymentDetailsInput> => {
    const response = await businessApi.post('/client-data/employment', data);
    return response.data;
  },

  updateEmploymentDetails: async (data: EmploymentDetailsInput): Promise<EmploymentDetailsInput> => {
    const response = await businessApi.put(`/client-data/employment/${data.employmentId}`, data);
    return response.data;
  },

  // Income Details
  getIncomeDetails: async (personalId: string): Promise<IncomeDetailsInput> => {
    const response = await businessApi.get(`/client-data/income/${personalId}`);
    return response.data;
  },

  saveIncomeDetails: async (data: IncomeDetailsInput): Promise<IncomeDetailsInput> => {
    const response = await businessApi.post('/client-data/income', data);
    return response.data;
  },

  updateIncomeDetails: async (data: IncomeDetailsInput): Promise<IncomeDetailsInput> => {
    const response = await businessApi.put(`/client-data/income/${data.incomeId}`, data);
    return response.data;
  },

  // Expenses Details
  getExpensesDetails: async (personalId: string): Promise<ExpensesDetailsInput> => {
    const response = await businessApi.get(`/client-data/expenses/${personalId}`);
    return response.data;
  },

  saveExpensesDetails: async (data: ExpensesDetailsInput): Promise<ExpensesDetailsInput> => {
    const response = await businessApi.post('/client-data/expenses', data);
    return response.data;
  },

  updateExpensesDetails: async (data: ExpensesDetailsInput): Promise<ExpensesDetailsInput> => {
    const response = await businessApi.put(`/client-data/expenses/${data.expensesId}`, data);
    return response.data;
  },

  // Assets
  getAssets: async (personalId: string): Promise<AssetInput> => {
    const response = await businessApi.get(`/client-data/assets/${personalId}`);
    return response.data;
  },

  saveAssets: async (data: AssetInput): Promise<AssetInput> => {
    const response = await businessApi.post('/client-data/assets', data);
    return response.data;
  },

  updateAssets: async (data: AssetInput): Promise<AssetInput> => {
    const response = await businessApi.put(`/client-data/assets/${data.assetId}`, data);
    return response.data;
  },

  // Liabilities
  getLiabilities: async (personalId: string): Promise<LiabilityInput[]> => {
    const response = await businessApi.get(`/client-data/liabilities/${personalId}`);
    return response.data;
  },

  saveLiability: async (data: LiabilityInput): Promise<LiabilityInput> => {
    const response = await businessApi.post('/client-data/liabilities', data);
    return response.data;
  },

  updateLiability: async (data: LiabilityInput): Promise<LiabilityInput> => {
    const response = await businessApi.put(`/client-data/liabilities/${data.liabilityId}`, data);
    return response.data;
  },

  deleteLiability: async (liabilityId: string): Promise<void> => {
    await businessApi.delete(`/client-data/liabilities/${liabilityId}`);
  },

  // Goals and Wishes
  getGoalsAndWishes: async (personalId: string): Promise<GoalsAndWishesInput> => {
    const response = await businessApi.get(`/client-data/goals-wishes/${personalId}`);
    return response.data;
  },

  saveGoalsAndWishes: async (data: GoalsAndWishesInput): Promise<GoalsAndWishesInput> => {
    const response = await businessApi.post('/client-data/goals-wishes', data);
    return response.data;
  },

  updateGoalsAndWishes: async (data: GoalsAndWishesInput): Promise<GoalsAndWishesInput> => {
    const response = await businessApi.put(`/client-data/goals-wishes/${data.goalsAndWishesId}`, data);
    return response.data;
  },

  // Risk Appetite
  getRiskAppetite: async (personalId: string): Promise<RiskAppetiteInput> => {
    const response = await businessApi.get(`/client-data/risk-appetite/${personalId}`);
    return response.data;
  },

  saveRiskAppetite: async (data: RiskAppetiteInput): Promise<RiskAppetiteInput> => {
    const response = await businessApi.post('/client-data/risk-appetite', data);
    return response.data;
  },

  updateRiskAppetite: async (data: RiskAppetiteInput): Promise<RiskAppetiteInput> => {
    const response = await businessApi.put(`/client-data/risk-appetite/${data.riskAppetiteId}`, data);
    return response.data;
  }
};

export default profileApi; 