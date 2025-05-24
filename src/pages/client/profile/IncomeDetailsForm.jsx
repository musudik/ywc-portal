import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";

const IncomeDetailsForm = ({ 
  onComplete, 
  onBack, 
  personalId, 
  initialData,
  skipApiSave = false 
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalId,
    grossIncome: 0,
    netIncome: 0,
    taxClass: "",
    taxId: "",
    numberOfSalaries: 12,
    childBenefit: 0,
    otherIncome: 0,
    incomeTradeBusiness: 0,
    incomeSelfEmployedWork: 0,
    incomeSideJob: 0
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting income form data from initialData:", initialData);
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
    const fetchIncomeDetails = async () => {
      if (personalId && !initialData) {
        try {
          const details = await profileApi.getIncomeDetails(personalId);
          if (details) {
            const incomeData = Array.isArray(details) && details.length > 0 ? details[0] : details;
            setFormData(prevData => ({
              ...prevData,
              ...incomeData,
              personalId
            }));
          }
        } catch (err) {
          // If 404, it means no income details exist yet
          if (err.response?.status !== 404) {
            console.error("Failed to fetch income details:", err);
            setError("Failed to load income details. Please try again.");
          }
        } finally {
          setInitialLoading(false);
        }
      } else if (!initialData) {
        setInitialLoading(false);
      }
    };

    fetchIncomeDetails();
  }, [personalId, initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric values to numbers
    const parsedValue = name === "taxClass" || name === "taxId" ? value : parseFloat(value) || 0;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: parsedValue
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
        ...formData
      };

      console.log("Submitting income details:", dataToSubmit);

      // If skipApiSave is true, skip the API calls and just return the data
      if (skipApiSave) {
        console.log("Skipping API save for income details (used in multi-step form)");
        onComplete(dataToSubmit);
        setLoading(false);
        return;
      }

      let response;
      
      // Check if we have an incomeId (from formData, initialData, or fetched data)
      const existingIncomeId = formData.incomeId || initialData?.incomeId;
      
      console.log("Existing income ID:", existingIncomeId);
      if (existingIncomeId) {
        console.log(`Updating existing income details with ID: ${existingIncomeId}`);
        // Update existing income details
        response = await profileApi.updateIncomeDetails({
          ...dataToSubmit,
          incomeId: existingIncomeId
        });
      } else {
        // Check if income details exist for this personalId
        try {
          console.log("Checking if income details exist for personalId:", personalId);
          const existingIncome = await profileApi.getIncomeDetails(personalId);
          
          if (existingIncome && (existingIncome.incomeId || existingIncome.id)) {
            console.log(`Income details found, updating with ID: ${existingIncome.incomeId || existingIncome.id}`);
            // Update existing income details
            response = await profileApi.updateIncomeDetails({
              ...dataToSubmit,
              incomeId: existingIncome.incomeId || existingIncome.id
            });
          } else {
            console.log("Creating new income details - no existing data found");
            // Create new income details
            response = await profileApi.saveIncomeDetails(dataToSubmit);
          }
        } catch (checkErr) {
          // If we get a 404 or other error checking for existing data, create new
          if (checkErr.response?.status === 404 || checkErr.message?.includes('No income details found')) {
            console.log("No existing income details found, creating new");
            response = await profileApi.saveIncomeDetails(dataToSubmit);
          } else {
            console.error("Error checking for existing income details:", checkErr);
            // If check fails for other reasons, try to create
            console.log("Creating new income details after failed check");
            response = await profileApi.saveIncomeDetails(dataToSubmit);
          }
        }
      }

      console.log("Income details saved successfully:", response);
      
      // Call the onComplete callback with the response
      onComplete(response);
    } catch (err) {
      console.error("Failed to save income details:", err);
      setError(err.response?.data?.message || "Failed to save income details. Please try again.");
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
        <h3 className="text-lg font-semibold">{t('profile.incomeDetails.title', 'Income Details')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('profile.incomeDetails.description', 'Please provide information about your income sources.')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="grossIncome" className="block text-sm font-medium">
            {t('profile.incomeDetails.grossIncome', 'Monthly Gross Income')} (€) *
          </label>
          <Input
            id="grossIncome"
            name="grossIncome"
            type="number"
            min="0"
            step="0.01"
            value={formData.grossIncome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="netIncome" className="block text-sm font-medium">
            {t('profile.incomeDetails.netIncome', 'Monthly Net Income')} (€) *
          </label>
          <Input
            id="netIncome"
            name="netIncome"
            type="number"
            min="0"
            step="0.01"
            value={formData.netIncome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="taxClass" className="block text-sm font-medium">
            {t('profile.incomeDetails.taxClass', 'Tax Class')} *
          </label>
          <select
            id="taxClass"
            name="taxClass"
            value={formData.taxClass}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            <option value="">{t('common.select', 'Select...')}</option>
            <option value="1">{t('profile.incomeDetails.taxClass.1', 'Class 1')}</option>
            <option value="2">{t('profile.incomeDetails.taxClass.2', 'Class 2')}</option>
            <option value="3">{t('profile.incomeDetails.taxClass.3', 'Class 3')}</option>
            <option value="4">{t('profile.incomeDetails.taxClass.4', 'Class 4')}</option>
            <option value="5">{t('profile.incomeDetails.taxClass.5', 'Class 5')}</option>
            <option value="6">{t('profile.incomeDetails.taxClass.6', 'Class 6')}</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="taxId" className="block text-sm font-medium">
            {t('profile.incomeDetails.taxId', 'Tax ID')}
          </label>
          <Input
            id="taxId"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="numberOfSalaries" className="block text-sm font-medium">
            {t('profile.incomeDetails.numberOfSalaries', 'Number of Salaries per Year')} *
          </label>
          <select
            id="numberOfSalaries"
            name="numberOfSalaries"
            value={formData.numberOfSalaries}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            <option value={12}>12</option>
            <option value={13}>13</option>
            <option value={14}>14</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="childBenefit" className="block text-sm font-medium">
              {t('profile.incomeDetails.childBenefit', 'Child Benefit')} (€)
            </label>
            <Input
              id="childBenefit"
              name="childBenefit"
              type="number"
              min="0"
              step="0.01"
              value={formData.childBenefit}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="otherIncome" className="block text-sm font-medium">
              {t('profile.incomeDetails.otherIncome', 'Other Income')} (€)
            </label>
            <Input
              id="otherIncome"
              name="otherIncome"
              type="number"
              min="0"
              step="0.01"
              value={formData.otherIncome}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="incomeTradeBusiness" className="block text-sm font-medium">
              {t('profile.incomeDetails.incomeTradeBusiness', 'Income from Trade/Business')} (€)
            </label>
            <Input
              id="incomeTradeBusiness"
              name="incomeTradeBusiness"
              type="number"
              min="0"
              step="0.01"
              value={formData.incomeTradeBusiness}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="incomeSelfEmployedWork" className="block text-sm font-medium">
              {t('profile.incomeDetails.incomeSelfEmployedWork', 'Income from Self-Employed Work')} (€)
            </label>
            <Input
              id="incomeSelfEmployedWork"
              name="incomeSelfEmployedWork"
              type="number"
              min="0"
              step="0.01"
              value={formData.incomeSelfEmployedWork}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="incomeSideJob" className="block text-sm font-medium">
              {t('profile.incomeDetails.incomeSideJob', 'Income from Side Job')} (€)
            </label>
            <Input
              id="incomeSideJob"
              name="incomeSideJob"
              type="number"
              min="0"
              step="0.01"
              value={formData.incomeSideJob}
              onChange={handleChange}
            />
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
          ) : t('common.next', 'Next')}
        </Button>
      </div>
    </form>
  );
};

export default IncomeDetailsForm; 