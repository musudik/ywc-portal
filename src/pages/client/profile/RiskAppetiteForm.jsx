import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";

const RiskAppetiteForm = ({ onComplete, onBack, personalId }) => {
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
    healthInsuranceProof: ""
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Load initial data if available
  useEffect(() => {
    const fetchRiskAppetite = async () => {
      if (personalId) {
        try {
          const details = await profileApi.getRiskAppetite(personalId);
          if (details) {
            setFormData(prevData => ({
              ...prevData,
              ...details
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
      } else {
        setInitialLoading(false);
      }
    };

    fetchRiskAppetite();
  }, [personalId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
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

      let response;
      if (formData.riskAppetiteId) {
        // Update existing risk appetite
        response = await profileApi.updateRiskAppetite(dataToSubmit);
      } else {
        // Create new risk appetite
        response = await profileApi.saveRiskAppetite(dataToSubmit);
      }

      // Call the onComplete callback with the response
      onComplete(response);
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
              {t('profile.riskAppetite.riskAppetite', 'Risk Appetite')} *
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
              <option value="conservative">{t('profile.riskAppetite.riskAppetite.conservative', 'Conservative - I prefer safe investments with stable returns')}</option>
              <option value="moderate">{t('profile.riskAppetite.riskAppetite.moderate', 'Moderate - I can accept some risk for potentially higher returns')}</option>
              <option value="aggressive">{t('profile.riskAppetite.riskAppetite.aggressive', 'Aggressive - I am comfortable with higher risk for potentially higher returns')}</option>
              <option value="very_aggressive">{t('profile.riskAppetite.riskAppetite.very_aggressive', 'Very Aggressive - I seek maximum returns and can accept significant volatility')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="investmentHorizon" className="block text-sm font-medium">
              {t('profile.riskAppetite.investmentHorizon', 'Investment Horizon')} *
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
              <option value="short_term">{t('profile.riskAppetite.investmentHorizon.short_term', 'Short-term (1-3 years)')}</option>
              <option value="medium_term">{t('profile.riskAppetite.investmentHorizon.medium_term', 'Medium-term (4-7 years)')}</option>
              <option value="long_term">{t('profile.riskAppetite.investmentHorizon.long_term', 'Long-term (8+ years)')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="knowledgeExperience" className="block text-sm font-medium">
              {t('profile.riskAppetite.knowledgeExperience', 'Investment Knowledge & Experience')} *
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
              <option value="beginner">{t('profile.riskAppetite.knowledgeExperience.beginner', 'Beginner - Limited knowledge and experience')}</option>
              <option value="intermediate">{t('profile.riskAppetite.knowledgeExperience.intermediate', 'Intermediate - Some knowledge and experience')}</option>
              <option value="advanced">{t('profile.riskAppetite.knowledgeExperience.advanced', 'Advanced - Extensive knowledge and experience')}</option>
              <option value="expert">{t('profile.riskAppetite.knowledgeExperience.expert', 'Expert - Professional knowledge and experience')}</option>
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