import axios from 'axios';

// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const FORMS_API = `${API_URL}/api/forms`;

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
    const response = await axios.post(`${FORMS_API}/${formType}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
export const saveImmobilienForm = async (formData: any): Promise<FormSubmissionResponse> => {
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
    const response = await axios.get(`${FORMS_API}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
    const response = await axios.get(`${FORMS_API}/${formType}/${formId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
    const response = await axios.delete(`${FORMS_API}/${formType}/${formId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
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
  deleteForm
}; 