import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";

// Define constants for dropdown options based on provided values
const RISK_APPETITE_OPTIONS = ["low", "medium-low", "medium", "medium-high", "high"];
const INVESTMENT_HORIZON_OPTIONS = ["short-term", "medium-term", "long-term"];
const KNOWLEDGE_EXPERIENCE_OPTIONS = ["none", "basic", "intermediate", "advanced"];

const RiskAppetiteForm = ({ 
  onComplete, 
  onNext,
  onBack, 
  personalId, 
  initialData,
  skipApiSave = false,
  skipApiFetch = false
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalId,
    riskAppetite: "",
    investmentHorizon: "",
    knowledgeExperience: "",
    healthInsurance: "",
    healthInsuranceNumber: "",
    healthInsuranceProof: "",
    riskAppetiteId: null
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting risk appetite form data from initialData:", initialData);
      setFormData(prevData => ({
        ...prevData,
        ...initialData,
        personalId // Ensure personalId is included
      }));
      setInitialLoading(false);
    }
  }, [initialData, personalId]);

  // Load initial data if available and initialData prop is not provided
  useEffect(() => {
    const fetchRiskAppetite = async () => {
      if (personalId && !initialData && !skipApiFetch) {
        try {
          const details = await profileApi.getRiskAppetite(personalId);
          if (details) {
            setFormData(prevData => ({
              ...prevData,
              ...details,
              personalId
            }));
          }
        } catch (err) {
          // If 404, it means no risk appetite exists yet
          if (err.response?.status !== 404) {
            console.error("Failed to fetch risk appetite:", err);
            setError("Failed to load risk appetite. Please try again.");
          }
        } finally {
          setInitialLoading(false);
        }
      } else if (!initialData) {
        setInitialLoading(false);
      }
    };

    fetchRiskAppetite();
  }, [personalId, initialData, skipApiFetch]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      // Convert file to string representation (filename)
      // In a production app, you'd typically upload the file to a storage service
      // and store the URL/path as a string
      const fileName = files[0] ? files[0].name : "";
      setFormData(prev => ({
        ...prev,
        [name]: fileName // Store filename as string instead of File object
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        personalId
      };

      // If skipApiSave is true, skip the API calls and just return the data
      if (skipApiSave) {
        console.log("Skipping API save for risk appetite (used in multi-step form)");
        const callback = onComplete || onNext;
        if (callback) {
          callback(dataToSubmit);
        }
        setLoading(false);
        return;
      }

      let response;
      
      // Check if we have a riskAppetiteId (from formData, initialData, or fetched data)
      const existingRiskAppetiteId = formData.riskAppetiteId || initialData?.riskAppetiteId;
      
      console.log("Existing risk appetite ID:", existingRiskAppetiteId);
      if (existingRiskAppetiteId) {
        console.log(`Updating existing risk appetite with ID: ${existingRiskAppetiteId}`);
        // Update existing risk appetite
        response = await profileApi.updateRiskAppetite({
          ...dataToSubmit,
          riskAppetiteId: existingRiskAppetiteId
        });
      } else {
        // Check if risk appetite exists for this personalId
        try {
          console.log("Checking if risk appetite exists for personalId:", personalId);
          const existingRiskAppetite = await profileApi.getRiskAppetite(personalId);
          
          if (existingRiskAppetite && (existingRiskAppetite.riskAppetiteId || existingRiskAppetite.id)) {
            console.log(`Risk appetite found, updating with ID: ${existingRiskAppetite.riskAppetiteId || existingRiskAppetite.id}`);
            // Update existing risk appetite
            response = await profileApi.updateRiskAppetite({
              ...dataToSubmit,
              riskAppetiteId: existingRiskAppetite.riskAppetiteId || existingRiskAppetite.id
            });
          } else {
            console.log("Creating new risk appetite - no existing data found");
            // Create new risk appetite
            response = await profileApi.saveRiskAppetite(dataToSubmit);
          }
        } catch (checkErr) {
          // If we get a 404 or other error checking for existing data, create new
          if (checkErr.response?.status === 404 || checkErr.message?.includes('No risk appetite found')) {
            console.log("No existing risk appetite found, creating new");
            response = await profileApi.saveRiskAppetite(dataToSubmit);
          } else {
            console.error("Error checking for existing risk appetite:", checkErr);
            // If check fails for other reasons, try to create
            console.log("Creating new risk appetite after failed check");
            response = await profileApi.saveRiskAppetite(dataToSubmit);
          }
        }
      }

      // Call the onComplete or onNext callback with the response
      const callback = onComplete || onNext;
      if (callback) {
        callback(response);
      }
    } catch (err) {
      console.error("Failed to save risk appetite:", err);
      setError(err.response?.data?.message || "Failed to save risk appetite. Please try again.");
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
        <h3 className="text-lg font-semibold">{t('profile.riskAppetite.title', 'Risk Profile & Health Insurance')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('profile.riskAppetite.description', 'Please provide information about your risk tolerance and health insurance.')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">{t('profile.riskAppetite.investmentSection', 'Investment Profile')}</h4>
          
          <div className="space-y-2">
            <label htmlFor="riskAppetite" className="block text-sm font-medium">
              {t('profile.riskAppetite.riskAppetiteLabel', 'Risk Appetite')} *
            </label>
            <select
              id="riskAppetite"
              name="riskAppetite"
              value={formData.riskAppetite}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">{t('common.select', 'Select...')}</option>
              {RISK_APPETITE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {t(`profile.riskAppetite.riskAppetite.${option.replace('-', '_')}`, option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' '))}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="investmentHorizon" className="block text-sm font-medium">
              {t('profile.riskAppetite.investmentHorizonLabel', 'Investment Horizon')} *
            </label>
            <select
              id="investmentHorizon"
              name="investmentHorizon"
              value={formData.investmentHorizon}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">{t('common.select', 'Select...')}</option>
              {INVESTMENT_HORIZON_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {t(`profile.riskAppetite.investmentHorizonOptions.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' '))}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="knowledgeExperience" className="block text-sm font-medium">
              {t('profile.riskAppetite.knowledgeExperienceLabel', 'Investment Knowledge & Experience')} *
            </label>
            <select
              id="knowledgeExperience"
              name="knowledgeExperience"
              value={formData.knowledgeExperience}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">{t('common.select', 'Select...')}</option>
              {KNOWLEDGE_EXPERIENCE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {t(`profile.riskAppetite.knowledgeExperience.${option}`, option.charAt(0).toUpperCase() + option.slice(1))}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">{t('profile.riskAppetite.healthInsuranceSection', 'Health Insurance Information')}</h4>
          
          <div className="space-y-2">
            <label htmlFor="healthInsurance" className="block text-sm font-medium">
              {t('profile.riskAppetite.healthInsurance', 'Health Insurance Provider')} *
            </label>
            <Input
              id="healthInsurance"
              name="healthInsurance"
              value={formData.healthInsurance}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="healthInsuranceNumber" className="block text-sm font-medium">
              {t('profile.riskAppetite.healthInsuranceNumber', 'Health Insurance Number')} *
            </label>
            <Input
              id="healthInsuranceNumber"
              name="healthInsuranceNumber"
              value={formData.healthInsuranceNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="healthInsuranceProof" className="block text-sm font-medium">
              {t('profile.riskAppetite.healthInsuranceProof', 'Health Insurance Proof')}
            </label>
            <Input
              id="healthInsuranceProof"
              name="healthInsuranceProof"
              type="file"
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
            <p className="text-xs text-muted-foreground">
              {t('profile.riskAppetite.healthInsuranceProof.description', 'Upload a copy of your health insurance card or proof of insurance.')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={loading}
        >
          {t('common.back', 'Back')}
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
              {t('common.saving', 'Saving...')}
            </span>
          ) : t('common.finish', 'Finish')}
        </Button>
      </div>
    </form>
  );
};

export default RiskAppetiteForm; 