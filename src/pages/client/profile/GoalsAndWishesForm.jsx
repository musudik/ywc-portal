import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { profileApi } from "../../../api";

const GoalsAndWishesForm = ({ onComplete, onBack, personalId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalId,
    retirementPlanning: "",
    capitalFormation: "",
    realEstateGoals: "",
    financing: "",
    protection: "",
    healthcareProvision: "",
    otherGoals: ""
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Load initial data if available
  useEffect(() => {
    const fetchGoalsAndWishes = async () => {
      if (personalId) {
        try {
          const details = await profileApi.getGoalsAndWishes(personalId);
          if (details) {
            setFormData(prevData => ({
              ...prevData,
              ...details
            }));
          }
        } catch (err) {
          // If 404, it means no goals and wishes exist yet
          if (err.response?.status !== 404) {
            console.error("Failed to fetch goals and wishes:", err);
            setError("Failed to load goals and wishes. Please try again.");
          }
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    };

    fetchGoalsAndWishes();
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
      if (formData.goalsAndWishesId) {
        // Update existing goals and wishes
        response = await profileApi.updateGoalsAndWishes(dataToSubmit);
      } else {
        // Create new goals and wishes
        response = await profileApi.saveGoalsAndWishes(dataToSubmit);
      }

      // Call the onComplete callback with the response
      onComplete(response);
    } catch (err) {
      console.error("Failed to save goals and wishes:", err);
      setError(err.response?.data?.message || "Failed to save goals and wishes. Please try again.");
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
        <h3 className="text-lg font-semibold">{t('profile.goalsAndWishes.title', 'Financial Goals & Wishes')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('profile.goalsAndWishes.description', 'Please tell us about your financial goals and wishes.')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="retirementPlanning" className="block text-sm font-medium">
            {t('profile.goalsAndWishes.retirementPlanning', 'Retirement Planning')}
          </label>
          <textarea
            id="retirementPlanning"
            name="retirementPlanning"
            value={formData.retirementPlanning}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder={t('profile.goalsAndWishes.retirementPlanning.placeholder', 'Describe your retirement goals...')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="capitalFormation" className="block text-sm font-medium">
            {t('profile.goalsAndWishes.capitalFormation', 'Capital Formation / Investments')}
          </label>
          <textarea
            id="capitalFormation"
            name="capitalFormation"
            value={formData.capitalFormation}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder={t('profile.goalsAndWishes.capitalFormation.placeholder', 'Describe your investment goals...')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="realEstateGoals" className="block text-sm font-medium">
            {t('profile.goalsAndWishes.realEstateGoals', 'Real Estate Goals')}
          </label>
          <textarea
            id="realEstateGoals"
            name="realEstateGoals"
            value={formData.realEstateGoals}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder={t('profile.goalsAndWishes.realEstateGoals.placeholder', 'Describe your real estate goals...')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="financing" className="block text-sm font-medium">
            {t('profile.goalsAndWishes.financing', 'Financing Needs')}
          </label>
          <textarea
            id="financing"
            name="financing"
            value={formData.financing}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder={t('profile.goalsAndWishes.financing.placeholder', 'Describe your financing needs...')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="protection" className="block text-sm font-medium">
            {t('profile.goalsAndWishes.protection', 'Protection & Insurance')}
          </label>
          <textarea
            id="protection"
            name="protection"
            value={formData.protection}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder={t('profile.goalsAndWishes.protection.placeholder', 'Describe your insurance needs...')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="healthcareProvision" className="block text-sm font-medium">
            {t('profile.goalsAndWishes.healthcareProvision', 'Healthcare Provision')}
          </label>
          <textarea
            id="healthcareProvision"
            name="healthcareProvision"
            value={formData.healthcareProvision}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder={t('profile.goalsAndWishes.healthcareProvision.placeholder', 'Describe your healthcare provision needs...')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="otherGoals" className="block text-sm font-medium">
            {t('profile.goalsAndWishes.otherGoals', 'Other Goals')}
          </label>
          <textarea
            id="otherGoals"
            name="otherGoals"
            value={formData.otherGoals}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder={t('profile.goalsAndWishes.otherGoals.placeholder', 'Describe any other financial goals...')}
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
          ) : t('common.next', 'Next')}
        </Button>
      </div>
    </form>
  );
};

export default GoalsAndWishesForm; 