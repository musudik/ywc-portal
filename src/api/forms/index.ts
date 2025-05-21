import axios from 'axios';
import { getToken } from '../../utils/tokenUtils';

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const FORMS_API = `${API_URL}/api/forms`;

// Create an axios instance with base configuration
const formsApi = axios.create({
  baseURL: FORMS_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to all requests
formsApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn(`Forms API request to ${config.url} has no authorization token`);
  }
  return config;
}, (error) => {
  console.error('Error in forms API request interceptor:', error);
  return Promise.reject(error);
});

// Handle unauthorized responses
formsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(`Forms API error: ${error.response.status} on ${error.config.url}`);
      console.log('Error response data:', error.response.data);
      
      // Handle unauthorized errors
      if (error.response.status === 401 || error.response.status === 403) {
        console.warn('Unauthorized request to forms API, triggering auth refresh');
        // Trigger authentication refresh
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// Type definitions for form submission responses
export interface FormSubmissionResponse {
  success: boolean;
  formId?: string;
  message?: string;
  errors?: any;
}

/**
 * Base save function for all form types
 * @param formType The type of form (immobilien, privateHealthInsurance, etc.)
 * @param formData The form data to submit
 * @returns FormSubmissionResponse
 */
async function saveForm(formType: string, formData: any): Promise<FormSubmissionResponse> {
  try {
    console.log(`Submitting ${formType} form with data:`, formData);
    const response = await formsApi.post(`/${formType}`, formData);

    console.log(`${formType} form submitted successfully:`, response.data);
    return {
      success: true,
      formId: response.data.formId,
      message: response.data.message || 'Form submitted successfully',
    };
  } catch (error: any) {
    console.error(`Error saving ${formType} form:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while submitting the form',
      errors: error.response?.data?.errors,
    };
  }
}

/**
 * Saves Immobilien form data
 * @param formData The Immobilien form data
 */
export const saveImmobilienForm = async (formData: {
  personal?: any;
  employment?: any;
  income?: any;
  expenses?: any;
  assets?: any;
  liabilities?: any;
  consent?: any;
  userId: string;
  formType: string;
  submittedAt: string;
}): Promise<FormSubmissionResponse> => {
  return saveForm('immobilien', formData);
};

/**
 * Saves Private Health Insurance form data
 * @param formData The Private Health Insurance form data
 */
export const savePrivateHealthInsuranceForm = async (formData: any): Promise<FormSubmissionResponse> => {
  return saveForm('privateHealthInsurance', formData);
};

/**
 * Saves State Health Insurance form data
 * @param formData The State Health Insurance form data
 */
export const saveStateHealthInsuranceForm = async (formData: any): Promise<FormSubmissionResponse> => {
  return saveForm('stateHealthInsurance', formData);
};

/**
 * Saves KFZ (Auto) Insurance form data
 * @param formData The KFZ form data
 */
export const saveKfzForm = async (formData: any): Promise<FormSubmissionResponse> => {
  return saveForm('kfz', formData);
};

/**
 * Saves Loans form data
 * @param formData The Loans form data
 */
export const saveLoansForm = async (formData: any): Promise<FormSubmissionResponse> => {
  return saveForm('loans', formData);
};

/**
 * Saves Electricity form data
 * @param formData The Electricity form data
 */
export const saveElectricityForm = async (formData: any): Promise<FormSubmissionResponse> => {
  return saveForm('electricity', formData);
};

/**
 * Saves SanusPay form data
 * @param formData The SanusPay form data
 */
export const saveSanuspayForm = async (formData: any): Promise<FormSubmissionResponse> => {
  return saveForm('sanuspay', formData);
};

/**
 * Saves Gems form data
 * @param formData The Gems form data
 */
export const saveGemsForm = async (formData: any): Promise<FormSubmissionResponse> => {
  return saveForm('gems', formData);
};

/**
 * Gets all forms for the current user
 * @returns List of forms
 */
export const getForms = async (): Promise<any[]> => {
  try {
    const response = await formsApi.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching forms:', error);
    return [];
  }
};

/**
 * Gets a specific form by ID
 * @param formType The type of form
 * @param formId The ID of the form
 * @returns The form data
 */
export const getFormById = async (formType: string, formId: string): Promise<any> => {
  try {
    const response = await formsApi.get(`/${formType}/${formId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${formType} form:`, error);
    throw error;
  }
};

/**
 * Deletes a form by ID
 * @param formType The type of form
 * @param formId The ID of the form
 * @returns Success response
 */
export const deleteForm = async (formType: string, formId: string): Promise<FormSubmissionResponse> => {
  try {
    const response = await formsApi.delete(`/${formType}/${formId}`);
    
    return {
      success: true,
      message: response.data.message || 'Form deleted successfully',
    };
  } catch (error: any) {
    console.error(`Error deleting ${formType} form:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while deleting the form',
    };
  }
};

// Import client forms API
import clientFormsApi, * as clientForms from './client-forms';

// Export client forms API functions
export const {
  createClientForm,
  getAllClientForms,
  getClientFormById,
  updateClientForm,
  deleteClientForm,
  updateClientFormStatus
} = clientForms;

// Export the default object with all form functions
export default {
  saveImmobilienForm,
  savePrivateHealthInsuranceForm,
  saveStateHealthInsuranceForm,
  saveKfzForm,
  saveLoansForm,
  saveElectricityForm,
  saveSanuspayForm,
  saveGemsForm,
  getForms,
  getFormById,
  deleteForm,
  
  // Client forms API
  createClientForm,
  getAllClientForms,
  getClientFormById,
  updateClientForm,
  deleteClientForm,
  updateClientFormStatus
}; 