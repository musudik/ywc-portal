import axios from 'axios';
import { getToken } from '../../utils/tokenUtils';

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CLIENT_FORMS_API = `${API_URL}/api/forms/client-forms`;

// Types for the client forms API
export interface ClientFormData {
  formType: string;
  formName: string;
  formData: any;
}

export interface ClientFormResponse {
  formId: string;
  formType: string;
  formName: string;
  formData: any;
  status: string;
  submittedAt: string;
  updatedAt: string;
  userId: string;
}

export interface ClientFormStatusUpdate {
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

// Create an axios instance with base configuration
const clientFormsApi = axios.create({
  baseURL: CLIENT_FORMS_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to all requests
clientFormsApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn(`Client Forms API request to ${config.url} has no authorization token`);
  }
  return config;
}, (error) => {
  console.error('Error in client forms API request interceptor:', error);
  return Promise.reject(error);
});

// Handle unauthorized responses
clientFormsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(`Client Forms API error: ${error.response.status} on ${error.config.url}`);
      console.log('Error response data:', error.response.data);
      
      // Handle unauthorized errors
      if (error.response.status === 401 || error.response.status === 403) {
        console.warn('Unauthorized request to client forms API, triggering auth refresh');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Creates a new client form
 * @param formData The form data to submit
 * @returns API response with created form
 */
export const createClientForm = async (
  formData: ClientFormData
): Promise<ApiResponse<ClientFormResponse>> => {
  try {
    console.log('Creating client form with data:', formData);
    const response = await clientFormsApi.post('', formData);
    console.log('Client form created successfully:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Form created successfully'
    };
  } catch (error: any) {
    console.error('Error creating client form:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while creating the form',
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * Gets all client forms for the current user
 * @returns List of client forms
 */
export const getAllClientForms = async (): Promise<ApiResponse<ClientFormResponse[]>> => {
  try {
    console.log('Fetching all client forms');
    const response = await clientFormsApi.get('');
    console.log('Client forms fetched successfully:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Forms fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching client forms:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching forms',
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * Gets a specific client form by ID
 * @param formId The ID of the form
 * @returns The client form data
 */
export const getClientFormById = async (
  formId: string
): Promise<ApiResponse<ClientFormResponse>> => {
  try {
    console.log(`Fetching client form with ID: ${formId}`);
    const response = await clientFormsApi.get(`/${formId}`);
    console.log('Client form fetched successfully:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Form fetched successfully'
    };
  } catch (error: any) {
    console.error(`Error fetching client form with ID ${formId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching the form',
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * Updates a client form by ID
 * @param formId The ID of the form
 * @param formData The updated form data
 * @returns API response with updated form
 */
export const updateClientForm = async (
  formId: string,
  formData: ClientFormData
): Promise<ApiResponse<ClientFormResponse>> => {
  try {
    console.log(`Updating client form with ID: ${formId}`, formData);
    const response = await clientFormsApi.put(`/${formId}`, formData);
    console.log('Client form updated successfully:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Form updated successfully'
    };
  } catch (error: any) {
    console.error(`Error updating client form with ID ${formId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while updating the form',
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * Deletes a client form by ID
 * @param formId The ID of the form
 * @returns Success response
 */
export const deleteClientForm = async (
  formId: string
): Promise<ApiResponse<null>> => {
  try {
    console.log(`Deleting client form with ID: ${formId}`);
    const response = await clientFormsApi.delete(`/${formId}`);
    console.log('Client form deleted successfully:', response.data);
    
    return {
      success: true,
      message: response.data?.message || 'Form deleted successfully'
    };
  } catch (error: any) {
    console.error(`Error deleting client form with ID ${formId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while deleting the form',
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * Updates the status of a client form
 * @param formId The ID of the form
 * @param status The new status
 * @returns API response with updated form
 */
export const updateClientFormStatus = async (
  formId: string,
  status: ClientFormStatusUpdate
): Promise<ApiResponse<ClientFormResponse>> => {
  try {
    console.log(`Updating status for client form with ID: ${formId} to ${status.status}`);
    const response = await clientFormsApi.patch(`/${formId}/status`, status);
    console.log('Client form status updated successfully:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Form status updated successfully'
    };
  } catch (error: any) {
    console.error(`Error updating status for client form with ID ${formId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while updating the form status',
      errors: error.response?.data?.errors,
    };
  }
};

// Export the default object with all client forms functions
export default {
  createClientForm,
  getAllClientForms,
  getClientFormById,
  updateClientForm,
  deleteClientForm,
  updateClientFormStatus
}; 