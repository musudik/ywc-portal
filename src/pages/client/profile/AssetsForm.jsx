import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";

const AssetsForm = ({ 
  onComplete, 
  onBack,
  personalId,
  initialData,
  showPreviousButton,
  onPrevious,
  skipApiSave = false 
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalId,
    realEstate: 0,
    securities: 0,
    bankDeposits: 0,
    buildingSavings: 0,
    insuranceValues: 0,
    otherAssets: 0
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting assets form data from initialData:", initialData);
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
    const fetchAssets = async () => {
      if (personalId && !initialData) {
        try {
          const details = await profileApi.getAssets(personalId);
          if (details) {
            const assetsData = Array.isArray(details) && details.length > 0 ? details[0] : details;
            setFormData(prevData => ({
              ...prevData,
              ...assetsData,
              personalId
            }));
          }
        } catch (err) {
          // If 404, it means no assets exist yet
          if (err.response?.status !== 404) {
            console.error("Failed to fetch assets:", err);
            setError("Failed to load assets. Please try again.");
          }
        } finally {
          setInitialLoading(false);
        }
      } else if (!initialData) {
        setInitialLoading(false);
      }
    };

    fetchAssets();
  }, [personalId, initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert values to numbers
    const parsedValue = parseFloat(value) || 0;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: parsedValue
    }));
  };

  // Calculate total assets
  const calculateTotal = () => {
    return Object.entries(formData)
      .filter(([key]) => key !== "personalId" && key !== "assetId")
      .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const dataToSubmit = {
        ...formData
      };

      console.log("Submitting assets details:", dataToSubmit);

      // If skipApiSave is true, skip the API calls and just return the data
      if (skipApiSave) {
        console.log("Skipping API save for assets (used in multi-step form)");
        onComplete(dataToSubmit);
        setLoading(false);
        return;
      }

      let response;
      
      // If we already have assetsId, update the existing record
      if (formData.assetsId) {
        console.log(`Updating existing assets with assetsId: ${formData.assetsId}`);
        response = await profileApi.updateAssets(dataToSubmit);
      } else {
        // Create new assets
        console.log("Creating new assets");
        response = await profileApi.saveAssets(dataToSubmit);
      }

      console.log("Assets saved successfully:", response);
      
      // Call the onComplete callback with the response
      onComplete(response);
    } catch (err) {
      console.error("Failed to save assets:", err);
      setError(err.response?.data?.message || "Failed to save assets. Please try again.");
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
        <h3 className="text-lg font-semibold">{t('profile.assets.title', 'Assets')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('profile.assets.description', 'Please provide information about your assets.')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="realEstate" className="block text-sm font-medium">
            {t('profile.assets.realEstate', 'Real Estate Value')} (€)
          </label>
          <Input
            id="realEstate"
            name="realEstate"
            type="number"
            min="0"
            step="0.01"
            value={formData.realEstate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="securities" className="block text-sm font-medium">
            {t('profile.assets.securities', 'Securities (Stocks, Bonds, etc.)')} (€)
          </label>
          <Input
            id="securities"
            name="securities"
            type="number"
            min="0"
            step="0.01"
            value={formData.securities}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bankDeposits" className="block text-sm font-medium">
            {t('profile.assets.bankDeposits', 'Bank Deposits')} (€)
          </label>
          <Input
            id="bankDeposits"
            name="bankDeposits"
            type="number"
            min="0"
            step="0.01"
            value={formData.bankDeposits}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="buildingSavings" className="block text-sm font-medium">
            {t('profile.assets.buildingSavings', 'Building Savings')} (€)
          </label>
          <Input
            id="buildingSavings"
            name="buildingSavings"
            type="number"
            min="0"
            step="0.01"
            value={formData.buildingSavings}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="insuranceValues" className="block text-sm font-medium">
            {t('profile.assets.insuranceValues', 'Insurance Values')} (€)
          </label>
          <Input
            id="insuranceValues"
            name="insuranceValues"
            type="number"
            min="0"
            step="0.01"
            value={formData.insuranceValues}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="otherAssets" className="block text-sm font-medium">
            {t('profile.assets.otherAssets', 'Other Assets')} (€)
          </label>
          <Input
            id="otherAssets"
            name="otherAssets"
            type="number"
            min="0"
            step="0.01"
            value={formData.otherAssets}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-secondary/20 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-medium">{t('profile.assets.totalAssets', 'Total Assets')}:</span>
          <span className="font-bold text-lg">€{calculateTotal().toFixed(2)}</span>
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

export default AssetsForm; 