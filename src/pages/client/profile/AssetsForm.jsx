import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";

const AssetsForm = ({ 
  onComplete, 
  onNext,
  onBack,
  personalId,
  initialData,
  showPreviousButton,
  onPrevious,
  skipApiSave = false,
  skipApiFetch = false
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
      if (personalId && !initialData && !skipApiFetch) {
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
  }, [personalId, initialData, skipApiFetch]);

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
        const callback = onComplete || onNext;
        if (callback) {
          callback(dataToSubmit);
        }
        setLoading(false);
        return;
      }

      let response;
      
      // Check if we have an assetsId (from formData, initialData, or fetched data)
      const existingAssetsId = formData.assetsId || initialData?.assetsId;
      
      console.log("Existing assets ID:", existingAssetsId);
      if (existingAssetsId) {
        console.log(`Updating existing assets with ID: ${existingAssetsId}`);
        // Update existing assets
        response = await profileApi.updateAssets({
          ...dataToSubmit,
          assetsId: existingAssetsId
        });
      } else {
        // Check if assets exist for this personalId
        try {
          console.log("Checking if assets exist for personalId:", personalId);
          const existingAssets = await profileApi.getAssets(personalId);
          
          if (existingAssets && (existingAssets.assetsId || existingAssets.id)) {
            console.log(`Assets found, updating with ID: ${existingAssets.assetsId || existingAssets.id}`);
            // Update existing assets
            response = await profileApi.updateAssets({
              ...dataToSubmit,
              assetsId: existingAssets.assetsId || existingAssets.id
            });
          } else {
            console.log("Creating new assets - no existing data found");
            // Create new assets
            response = await profileApi.saveAssets(dataToSubmit);
          }
        } catch (checkErr) {
          // If we get a 404 or other error checking for existing data, create new
          if (checkErr.response?.status === 404 || checkErr.message?.includes('No assets found')) {
            console.log("No existing assets found, creating new");
            response = await profileApi.saveAssets(dataToSubmit);
          } else {
            console.error("Error checking for existing assets:", checkErr);
            // If check fails for other reasons, try to create
            console.log("Creating new assets after failed check");
            response = await profileApi.saveAssets(dataToSubmit);
          }
        }
      }

      console.log("Assets saved successfully:", response);
      
      // Call the onComplete or onNext callback with the response
      const callback = onComplete || onNext;
      if (callback) {
        callback(response);
      }
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