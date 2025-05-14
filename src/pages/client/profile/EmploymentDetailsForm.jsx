import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";
import { EmploymentType } from "../../../api/profile/types";
import { createSafeTranslate } from "../../../utils/translationUtils";

const EmploymentDetailsForm = ({ onComplete, onBack, personalId }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalId: personalId,
    employmentType: EmploymentType.EMPLOYED,
    occupation: "",
    contractType: "",
    contractDuration: "",
    employerName: "",
    employedSince: "",
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Load initial data if available
  useEffect(() => {
    const fetchEmploymentDetails = async () => {
      if (personalId) {
        try {
          const details = await profileApi.getEmploymentDetails(personalId);
          if (details) {
            setFormData(prevData => ({
              ...prevData,
              ...details,
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
      } else {
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
      if (!initialLoading) {
        const fetchEmploymentDetails = async () => {
          try {
            const details = await profileApi.getEmploymentDetails(personalId);
            if (details) {
              setFormData(prevData => ({
                ...prevData,
                ...details,
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
  }, [personalId, initialLoading]);

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
      ...(value !== EmploymentType.EMPLOYED && {
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

      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        personalId
      };

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
            <option value={EmploymentType.EMPLOYED}>{safeTranslate('profile.employment.employmentType.employed', 'Employed')}</option>
            <option value={EmploymentType.SELF_EMPLOYED}>{safeTranslate('profile.employment.employmentType.selfEmployed', 'Self-Employed')}</option>
            <option value={EmploymentType.UNEMPLOYED}>{safeTranslate('profile.employment.employmentType.unemployed', 'Unemployed')}</option>
            <option value={EmploymentType.RETIRED}>{safeTranslate('profile.employment.employmentType.retired', 'Retired')}</option>
            <option value={EmploymentType.STUDENT}>{safeTranslate('profile.employment.employmentType.student', 'Student')}</option>
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

        {formData.employmentType === EmploymentType.EMPLOYED && (
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
                required={formData.employmentType === EmploymentType.EMPLOYED}
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
                required={formData.employmentType === EmploymentType.EMPLOYED}
              >
                <option value="">{safeTranslate('common.select', 'Select...')}</option>
                <option value="Permanent">{safeTranslate('profile.employment.contractType.permanent', 'Permanent')}</option>
                <option value="Temporary">{safeTranslate('profile.employment.contractType.temporary', 'Temporary')}</option>
                <option value="PartTime">{safeTranslate('profile.employment.contractType.partTime', 'Part-Time')}</option>
                <option value="FullTime">{safeTranslate('profile.employment.contractType.fullTime', 'Full-Time')}</option>
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
          </>
        )}

        <div className="space-y-2">
          <label htmlFor="employedSince" className="block text-sm font-medium">
            {safeTranslate('profile.employment.employedSince', 'Start Date')} *
          </label>
          <Input
            id="employedSince"
            name="employedSince"
            type="date"
            value={formData.employedSince ? new Date(formData.employedSince).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            required
          />
        </div>
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
          disabled={loading || !personalId}
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