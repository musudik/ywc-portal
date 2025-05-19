import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";

const ExpensesDetailsForm = ({ 
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
    coldRent: 0,
    electricity: 0,
    livingExpenses: 0,
    gas: 0,
    telecommunication: 0,
    accountMaintenanceFee: 0,
    alimony: 0,
    subscriptions: 0,
    otherExpenses: 0
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting expenses form data from initialData:", initialData);
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
    const fetchExpensesDetails = async () => {
      if (personalId && !initialData) {
        try {
          const details = await profileApi.getExpensesDetails(personalId);
          if (details) {
            const expensesData = Array.isArray(details) && details.length > 0 ? details[0] : details;
            setFormData(prevData => ({
              ...prevData,
              ...expensesData,
              personalId
            }));
          }
        } catch (err) {
          // If 404, it means no expenses details exist yet
          if (err.response?.status !== 404) {
            console.error("Failed to fetch expenses details:", err);
            setError("Failed to load expenses details. Please try again.");
          }
        } finally {
          setInitialLoading(false);
        }
      } else if (!initialData) {
        setInitialLoading(false);
      }
    };

    fetchExpensesDetails();
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

  // Calculate total expenses
  const calculateTotal = () => {
    return Object.entries(formData)
      .filter(([key]) => key !== "personalId" && key !== "expensesId")
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

      console.log("Submitting expenses details:", dataToSubmit);

      // If skipApiSave is true, skip the API calls and just return the data
      if (skipApiSave) {
        console.log("Skipping API save for expenses details (used in multi-step form)");
        onComplete(dataToSubmit);
        setLoading(false);
        return;
      }

      let response;
      
      // If we already have expensesId, update the existing record
      if (formData.expensesId) {
        console.log(`Updating existing expenses with expensesId: ${formData.expensesId}`);
        response = await profileApi.updateExpensesDetails(dataToSubmit);
      } else {
        // Create new expenses details
        console.log("Creating new expenses details");
        response = await profileApi.saveExpensesDetails(dataToSubmit);
      }

      console.log("Expenses details saved successfully:", response);
      
      // Call the onComplete callback with the response
      onComplete(response);
    } catch (err) {
      console.error("Failed to save expenses details:", err);
      setError(err.response?.data?.message || "Failed to save expenses details. Please try again.");
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
        <h3 className="text-lg font-semibold">{t('profile.expensesDetails.title', 'Monthly Expenses')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('profile.expensesDetails.description', 'Please provide information about your monthly expenses.')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="coldRent" className="block text-sm font-medium">
            {t('profile.expensesDetails.coldRent', 'Rent (excl. utilities)')} (€)
          </label>
          <Input
            id="coldRent"
            name="coldRent"
            type="number"
            min="0"
            step="0.01"
            value={formData.coldRent}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="electricity" className="block text-sm font-medium">
            {t('profile.expensesDetails.electricity', 'Electricity')} (€)
          </label>
          <Input
            id="electricity"
            name="electricity"
            type="number"
            min="0"
            step="0.01"
            value={formData.electricity}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gas" className="block text-sm font-medium">
            {t('profile.expensesDetails.gas', 'Gas/Heating')} (€)
          </label>
          <Input
            id="gas"
            name="gas"
            type="number"
            min="0"
            step="0.01"
            value={formData.gas}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="livingExpenses" className="block text-sm font-medium">
            {t('profile.expensesDetails.livingExpenses', 'Living Expenses (Food, etc.)')} (€)
          </label>
          <Input
            id="livingExpenses"
            name="livingExpenses"
            type="number"
            min="0"
            step="0.01"
            value={formData.livingExpenses}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="telecommunication" className="block text-sm font-medium">
            {t('profile.expensesDetails.telecommunication', 'Phone/Internet')} (€)
          </label>
          <Input
            id="telecommunication"
            name="telecommunication"
            type="number"
            min="0"
            step="0.01"
            value={formData.telecommunication}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="accountMaintenanceFee" className="block text-sm font-medium">
            {t('profile.expensesDetails.accountMaintenanceFee', 'Bank Fees')} (€)
          </label>
          <Input
            id="accountMaintenanceFee"
            name="accountMaintenanceFee"
            type="number"
            min="0"
            step="0.01"
            value={formData.accountMaintenanceFee}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="alimony" className="block text-sm font-medium">
            {t('profile.expensesDetails.alimony', 'Alimony/Child Support')} (€)
          </label>
          <Input
            id="alimony"
            name="alimony"
            type="number"
            min="0"
            step="0.01"
            value={formData.alimony}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subscriptions" className="block text-sm font-medium">
            {t('profile.expensesDetails.subscriptions', 'Subscriptions')} (€)
          </label>
          <Input
            id="subscriptions"
            name="subscriptions"
            type="number"
            min="0"
            step="0.01"
            value={formData.subscriptions}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="otherExpenses" className="block text-sm font-medium">
            {t('profile.expensesDetails.otherExpenses', 'Other Expenses')} (€)
          </label>
          <Input
            id="otherExpenses"
            name="otherExpenses"
            type="number"
            min="0"
            step="0.01"
            value={formData.otherExpenses}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-secondary/20 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-medium">{t('profile.expensesDetails.totalMonthly', 'Total Monthly Expenses')}:</span>
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

export default ExpensesDetailsForm; 