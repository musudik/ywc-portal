import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";
import { createSafeTranslate } from "../../../utils/translationUtils";

// Define constants for dropdown options
const EMPLOYMENT_TYPE_OPTIONS = ["employed", "selfEmployed", "unemployed", "retired", "student", "other"];
const CONTRACT_TYPE_OPTIONS = ["permanent", "temporary", "partTime", "fullTime", "freelance", "other"];

// Helper function to format dates to YYYY-MM-DD format
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  // Check if the date is in ISO format (contains 'T')
  if (typeof dateString === 'string' && dateString.includes('T')) {
    return dateString.split('T')[0]; // Extract YYYY-MM-DD part
  }
  
  return dateString;
};

// Map backend values to form values
const mapBackendToFormValues = (backendData) => {
  if (!backendData) return null;
  
  const formData = {...backendData};
  
  // // Map employment type
  // if (formData.employmentType === "PrimaryEmployment") {
  //   formData.employmentType = "Employed";
  // }
  
  // Map contract type - capitalize first letter for display
  if (formData.contractType && typeof formData.contractType === 'string') {
    formData.contractType = formData.contractType.toLowerCase();
  }
  
  // Format employedSince date for input field
  if (formData.employedSince) {
    formData.employedSince = formatDateForInput(formData.employedSince);
  }
  
  return formData;
};

// Map form values back to backend expected values
const mapFormToBackendValues = (formData) => {
  const backendData = {...formData};
  
  // // Map employment type
  // if (backendData.employmentType === "employed") {
  //   backendData.employmentType = "PrimaryEmployment";
  // }
  
  return backendData;
};

const EmploymentDetailsForm = ({ 
  onComplete, 
  onBack, 
  personalId, 
  initialData,
  showUpdateButton,
  onUpdate,
  profileComplete,
  showPreviousButton,
  onPrevious,
  skipApiSave = false
}) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalId: personalId,
    employmentType: "employed",
    occupation: "",
    contractType: "",
    contractDuration: "",
    employerName: "",
    employedSince: "",
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Update personalId in formData if it changes
  useEffect(() => {
    const fetchEmploymentDetails = async () => {
      if (!personalId) {
        console.warn("EmploymentDetailsForm: personalId is missing");
        setInitialLoading(false);
        return;
      }

      console.log("EmploymentDetailsForm: Fetching employment details for personalId:", personalId);
      setInitialLoading(true);
      
      try {
        // Ensure personalId is valid before making the API call
        if (!personalId || personalId === 'undefined') {
          throw new Error('Invalid personalId');
        }

        const details = await profileApi.getEmploymentDetails(personalId);
        if (details) {
          const employmentData = Array.isArray(details) && details.length > 0 ? details[0] : details;
          
          // Log the date format before mapping
          if (employmentData?.employedSince) {
            console.log("Original employedSince format:", employmentData.employedSince);
          }
          
          const mappedData = mapBackendToFormValues(employmentData);
          console.log("Mapped employment data on personalId update:", mappedData);
          
          // Log the date format after mapping
          if (mappedData?.employedSince) {
            console.log("Formatted employedSince for input:", mappedData.employedSince);
          }
          
          setFormData(prevData => ({
            ...prevData,
            ...mappedData,
            personalId // Ensure personalId is included
          }));
          
          // Check if data is complete to determine mode
          if (employmentData && employmentData.employmentId) {
            setIsUpdateMode(true);
          }
        }
      } catch (err) {
        // If 404, it means no employment details exist yet
        if (err.response?.status !== 404) {
          console.error("Failed to fetch employment details on personalId update:", err);
          setError(safeTranslate("profile.fetchError", "Failed to load employment details. Please try again."));
        }
      } finally {
        setInitialLoading(false);
      }
    };

    // Only fetch if we have a valid personalId and no initialData
    if (personalId && personalId !== 'undefined' && !initialData) {
      fetchEmploymentDetails();
    } else if (personalId && personalId !== 'undefined') {
      // If we have initialData, just update the personalId
      setFormData(prevData => ({
        ...prevData,
        personalId
      }));
      setInitialLoading(false);
    } else {
      setInitialLoading(false);
    }
  }, [personalId, initialData]);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("EmploymentDetailsForm: Received initialData:", initialData);
      
      // Log the original date format if present
      if (initialData.employedSince) {
        console.log("Original employedSince in initialData:", initialData.employedSince);
      }
      
      const mappedData = mapBackendToFormValues(initialData);
      console.log("EmploymentDetailsForm: Mapped initial data for form:", mappedData);
      
      // Log the formatted date
      if (mappedData.employedSince) {
        console.log("Formatted employedSince for form:", mappedData.employedSince);
      }
      
      // Ensure we're setting all needed fields
      setFormData(prevData => {
        const updatedData = {
          ...prevData,
          ...mappedData,
          personalId: personalId || mappedData.personalId || prevData.personalId, // Ensure personalId is included
          employedSince: mappedData.employedSince || prevData.employedSince // Ensure date is properly formatted
        };
        console.log("EmploymentDetailsForm: Updated form data:", updatedData);
        return updatedData;
      });
      
      // If we have employmentId, we're in update mode
      if (initialData.employmentId) {
        console.log("EmploymentDetailsForm: Setting to update mode with employmentId:", initialData.employmentId);
        setIsUpdateMode(true);
      }
      
      setInitialLoading(false);
    }
  }, [initialData, personalId]);

  // Check form completion status and set update mode accordingly
  useEffect(() => {
    if (profileComplete || showUpdateButton) {
      setIsUpdateMode(true);
    } else {
      setIsUpdateMode(false);
    }
  }, [profileComplete, showUpdateButton]);
  
  // Form validation with i18n messages
  const validateForm = () => {
    const errors = {};
    
    if (!formData.occupation.trim()) {
      errors.occupation = safeTranslate('validation.required', 'This field is required');
    }
    
    if (!formData.employerName.trim()) {
      errors.employerName = safeTranslate('validation.required', 'This field is required');
    }
    
    if (!formData.contractType) {
      errors.contractType = safeTranslate('validation.selectRequired', 'Please select an option');
    }
    
    if (!formData.employedSince) {
      errors.employedSince = safeTranslate('validation.dateRequired', 'Please select a date');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle date formatting specifically for employedSince field
    if (name === 'employedSince') {
      const formattedDate = formatDateForInput(value);
      console.log(`Formatting date from ${value} to ${formattedDate}`);
      
      setFormData(prevData => ({
        ...prevData,
        [name]: formattedDate
      }));
    } else {
      // For other fields, just set the value directly
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Handle employment type change
  const handleEmploymentTypeChange = (e) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      employmentType: value,
      // Reset employment-specific fields when changing type
      ...(value !== "employed" && {
        employerName: "",
        contractType: "",
        contractDuration: "",
      })
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Ensure we have a valid personalId
    if (!personalId) {
      setError(safeTranslate('profile.personalIdMissing', 'Personal ID is missing. Please try again.'));
      setLoading(false);
      return;
    }

    try {
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        personalId: personalId // Ensure we use the prop personalId, not from formData
      };

      console.log("Submitting employment details:", dataToSubmit);

      // If skipApiSave is true, skip the API calls and just return the data
      if (skipApiSave) {
        console.log("Skipping API save for employment details (used in multi-step form)");
        onComplete(dataToSubmit);
        setLoading(false);
        return;
      }

      let response;
      
      // If we already have employmentId, update the existing record
      if (formData.employmentId) {
        console.log(`Updating existing employment details with employmentId: ${formData.employmentId}`);
        response = await profileApi.updateEmploymentDetails(dataToSubmit);
      } else {
        // Create new employment details
        console.log("Creating new employment details");
        response = await profileApi.saveEmploymentDetails(dataToSubmit);
      }

      console.log("Employment details saved successfully:", response);
      
      // Call the onComplete callback with the response
      onComplete(response);
    } catch (err) {
      console.error("Failed to save employment details:", err);
      // Show more detailed error information with i18n
      if (err.response?.data) {
        console.error("API error response:", err.response.data);
        
        // Try to extract validation errors if possible
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          const validationErrors = {};
          err.response.data.errors.forEach(error => {
            const field = error.path ? error.path[0] : 'general';
            validationErrors[field] = safeTranslate(`validation.${field}.${error.code}`, error.message);
          });
          setValidationErrors(validationErrors);
        }
        
        setError(typeof err.response.data === 'string' 
          ? err.response.data 
          : safeTranslate('profile.employment.apiError', 'API validation error. Please check highlighted fields.'));
      } else {
        setError(err.message || safeTranslate('profile.employment.saveFailed', 'Failed to save employment details. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Update button click
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    
    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      // Prepare data for submission
      const dataToSubmit = mapFormToBackendValues({
        ...formData,
        personalId
      });
      
      // Update existing employment details
      await profileApi.updateEmploymentDetails(dataToSubmit);
      
      // Call the parent update handler if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error("Failed to update employment details:", err);
      setError(safeTranslate("profile.updateError", "Failed to update data. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{safeTranslate('profile.employment.title', 'Employment Details')}</h3>
        <p className="text-sm text-muted-foreground">
          {safeTranslate('profile.employment.description', 'Please provide information about your current employment.')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded whitespace-pre-wrap">
          {error}
        </div>
      )}

     
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="employmentType" className="block text-sm font-medium">
            {safeTranslate('profile.employment.employmentTypeLabel', 'Employment Type')} *
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleEmploymentTypeChange}
            className={`w-full rounded-md border px-3 py-2 ${
              validationErrors.employmentType 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'border-input bg-background'
            }`}
            required
          >
            {EMPLOYMENT_TYPE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {safeTranslate(`profile.employment.employmentType.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1').trim())}
              </option>
            ))}
          </select>
          {validationErrors.employmentType && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.employmentType}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="occupation" className="block text-sm font-medium">
            {safeTranslate('profile.employment.occupation', 'Occupation/Job Title')} *
          </label>
          <Input
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className={validationErrors.occupation ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
            required
          />
          {validationErrors.occupation && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.occupation}</p>
          )}
        </div>

        {(
          <>
            <div className="space-y-2">
              <label htmlFor="employerName" className="block text-sm font-medium">
                {safeTranslate('profile.employment.employerName', 'Employer Name')} *
              </label>
              <Input
                id="employerName"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                className={validationErrors.employerName ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                required={formData.employmentType === "employed"}
              />
              {validationErrors.employerName && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.employerName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contractType" className="block text-sm font-medium">
                {safeTranslate('profile.employment.contractTypeLabel', 'Contract Type')} *
              </label>
              <select
                id="contractType"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 ${
                  validationErrors.contractType 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-input bg-background'
                }`}
                required={formData.employmentType === "employed"}
              >
                <option value="">{safeTranslate('common.select', 'Select...')}</option>
                {CONTRACT_TYPE_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {safeTranslate(`profile.employment.contractType.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1').trim())}
                  </option>
                ))}
              </select>
              {validationErrors.contractType && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.contractType}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contractDuration" className="block text-sm font-medium">
                {safeTranslate('profile.employment.contractDuration', 'Contract Duration')}
              </label>
              <Input
                id="contractDuration"
                name="contractDuration"
                value={formData.contractDuration}
                onChange={handleChange}
                className={validationErrors.contractDuration ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                placeholder={safeTranslate('profile.employment.contractDurationPlaceholder', 'e.g., 1 year, indefinite')}
              />
              {validationErrors.contractDuration && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.contractDuration}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="employedSince" className="block text-sm font-medium">
                {safeTranslate('profile.employment.employedSince', 'Employed Since')} *
              </label>
              <Input
                id="employedSince"
                name="employedSince"
                type="date"
                value={formData.employedSince}
                onChange={handleChange}
                className={validationErrors.employedSince ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                required={formData.employmentType === "Employed"}
              />
              {validationErrors.employedSince && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.employedSince}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={loading}
        >
          {safeTranslate('common.back', 'Back')}
        </Button>
        
        {showUpdateButton ? (
          <Button 
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {safeTranslate('common.updating', 'Updating...')}
              </span>
            ) : safeTranslate('common.update', 'Update')}
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {safeTranslate('common.saving', 'Saving...')}
              </span>
            ) : safeTranslate('common.next', 'Next')}
          </Button>
        )}
      </div>
    </form>
  );
};

export default EmploymentDetailsForm; 