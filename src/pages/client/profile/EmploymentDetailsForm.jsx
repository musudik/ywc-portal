import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";
import { createSafeTranslate } from "../../../utils/translationUtils";

// Define constants for dropdown options
const EMPLOYMENT_TYPE_OPTIONS = ["employed", "selfEmployed", "unemployed", "retired", "student"];
const CONTRACT_TYPE_OPTIONS = ["permanent", "temporary", "partTime", "fullTime", "freelance", "other"];

// Map backend values to form values
const mapBackendToFormValues = (backendData) => {
  if (!backendData) return null;
  
  const formData = {...backendData};
  
  // Map employment type
  if (formData.employmentType === "PrimaryEmployment") {
    formData.employmentType = "employed";
  }
  
  // Map contract type - capitalize first letter for display
  if (formData.contractType && typeof formData.contractType === 'string') {
    formData.contractType = formData.contractType.toLowerCase();
  }
  
  return formData;
};

// Map form values back to backend expected values
const mapFormToBackendValues = (formData) => {
  const backendData = {...formData};
  
  // Map employment type
  if (backendData.employmentType === "employed") {
    backendData.employmentType = "PrimaryEmployment";
  }
  
  return backendData;
};

const EmploymentDetailsForm = ({ onComplete, onBack, personalId, initialData }) => {
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

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting form data from initialData:", initialData);
      const mappedData = mapBackendToFormValues(initialData);
      console.log("Mapped initial data for form:", mappedData);
      setFormData(prevData => ({
        ...prevData,
        ...mappedData,
        personalId // Ensure personalId is included
      }));
      setInitialLoading(false);
    }
  }, [initialData, personalId]);

  // Load initial data if available and if initialData prop is not provided
  useEffect(() => {
    const fetchEmploymentDetails = async () => {
      if (personalId && !initialData) {
        try {
          const details = await profileApi.getEmploymentDetails(personalId);
          if (details) {
            const employmentData = Array.isArray(details) && details.length > 0 ? details[0] : details;
            const mappedData = mapBackendToFormValues(employmentData);
            console.log("Mapped employment data for form:", mappedData);
            setFormData(prevData => ({
              ...prevData,
              ...mappedData,
              personalId // Ensure personalId is included
            }));
          }
        } catch (err) {
          // If 404, it means no employment details exist yet
          if (err.response?.status !== 404) {
            console.error("Failed to fetch employment details:", err);
            setError("Failed to load employment details. Please try again.");
          }
        } finally {
          setInitialLoading(false);
        }
      } else if (!initialData) {
        setInitialLoading(false);
      }
    };

    fetchEmploymentDetails();
  }, []);

  // Update personalId in formData if it changes
  useEffect(() => {
    if (personalId) {
      console.log("EmploymentDetailsForm: personalId updated to", personalId);
      setFormData(prevData => ({
        ...prevData,
        personalId
      }));
      
      // If we now have a personalId and we're not in initial loading, try to fetch employment details again
      if (!initialLoading && !initialData) {
        const fetchEmploymentDetails = async () => {
          try {
            const details = await profileApi.getEmploymentDetails(personalId);
            if (details) {
              const employmentData = Array.isArray(details) && details.length > 0 ? details[0] : details;
              const mappedData = mapBackendToFormValues(employmentData);
              console.log("Mapped employment data on personalId update:", mappedData);
              setFormData(prevData => ({
                ...prevData,
                ...mappedData,
                personalId // Ensure personalId is included
              }));
            }
          } catch (err) {
            // If 404, it means no employment details exist yet
            if (err.response?.status !== 404) {
              console.error("Failed to fetch employment details on personalId update:", err);
            }
          }
        };
        
        fetchEmploymentDetails();
      }
    } else {
      console.warn("EmploymentDetailsForm: personalId is missing");
      // Even if personalId is missing, we should still initialize the form
      setInitialLoading(false);
    }
  }, [personalId, initialLoading, initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
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

    try {
      // Ensure personalId is included in the submission data
      if (!personalId) {
        throw new Error(safeTranslate('profile.employment.personalIdMissing', 'Personal ID is required but not available'));
      }

      // Prepare data for submission - map form values back to what backend expects
      const dataToSubmit = mapFormToBackendValues({
        ...formData,
        personalId
      });
      
      console.log("Original form data:", formData);
      console.log("Mapped data for backend submission:", dataToSubmit);

      console.log("Submitting employment details:", dataToSubmit);

      let response;
      if (formData.employmentId) {
        // Update existing employment details
        response = await profileApi.updateEmploymentDetails(dataToSubmit);
      } else {
        // Create new employment details
        response = await profileApi.saveEmploymentDetails(dataToSubmit);
      }

      // Call the onComplete callback with the response
      onComplete(response);
    } catch (err) {
      console.error("Failed to save employment details:", err);
      // Show more detailed error information
      if (err.response?.data) {
        console.error("API error response:", err.response.data);
        setError(typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data, null, 2));
      } else {
        setError(err.message || safeTranslate('profile.employment.saveFailed', 'Failed to save employment details. Please try again.'));
      }
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
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            {EMPLOYMENT_TYPE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {safeTranslate(`profile.employment.employmentType.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1').trim())}
              </option>
            ))}
          </select>
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
            required
          />
        </div>

        {formData.employmentType === "employed" && (
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
                required={formData.employmentType === "employed"}
              />
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
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required={formData.employmentType === "employed"}
              >
                <option value="">{safeTranslate('common.select', 'Select...')}</option>
                {CONTRACT_TYPE_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {safeTranslate(`profile.employment.contractType.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1').trim())}
                  </option>
                ))}
              </select>
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
                placeholder={safeTranslate('profile.employment.contractDurationPlaceholder', 'e.g., 1 year, indefinite')}
              />
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
                required={formData.employmentType === "employed"}
              />
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
      </div>
    </form>
  );
};

export default EmploymentDetailsForm; 