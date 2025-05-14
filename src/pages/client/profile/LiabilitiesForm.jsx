import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";
import { LoanType } from "../../../api/profile/types";

const LiabilitiesForm = ({ onComplete, onBack, personalId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liabilities, setLiabilities] = useState([]);
  const [currentLiability, setCurrentLiability] = useState({
    personalId,
    loanType: LoanType.MORTGAGE,
    loanBank: "",
    loanAmount: 0,
    loanMonthlyRate: 0,
    loanInterest: 0
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Load initial data if available
  useEffect(() => {
    const fetchLiabilities = async () => {
      if (personalId) {
        try {
          const data = await profileApi.getLiabilities(personalId);
          if (data && Array.isArray(data)) {
            setLiabilities(data);
          }
        } catch (err) {
          // If 404, it means no liabilities exist yet
          if (err.response?.status !== 404) {
            console.error("Failed to fetch liabilities:", err);
            setError("Failed to load liabilities. Please try again.");
          }
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    };

    fetchLiabilities();
  }, [personalId]);

  // Handle input changes for current liability
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric values to numbers
    let parsedValue;
    
    if (name === "loanType" || name === "loanBank") {
      parsedValue = value;
    } else {
      parsedValue = parseFloat(value) || 0;
    }
    
    setCurrentLiability(prevData => ({
      ...prevData,
      [name]: parsedValue
    }));
  };

  // Handle edit liability
  const handleEdit = (liability) => {
    setCurrentLiability(liability);
    setEditMode(true);
  };

  // Handle delete liability
  const handleDelete = async (liabilityId) => {
    try {
      await profileApi.deleteLiability(liabilityId);
      setLiabilities(liabilities.filter(item => item.liabilityId !== liabilityId));
    } catch (err) {
      console.error("Failed to delete liability:", err);
      setError("Failed to delete liability. Please try again.");
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentLiability({
      personalId,
      loanType: LoanType.MORTGAGE,
      loanBank: "",
      loanAmount: 0,
      loanMonthlyRate: 0,
      loanInterest: 0
    });
    setEditMode(false);
  };

  // Handle save liability
  const handleSaveLiability = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (editMode && currentLiability.liabilityId) {
        // Update existing liability
        response = await profileApi.updateLiability(currentLiability);
        
        // Update the liability in the list
        setLiabilities(liabilities.map(item => 
          item.liabilityId === response.liabilityId ? response : item
        ));
      } else {
        // Create new liability
        response = await profileApi.saveLiability({
          ...currentLiability,
          personalId
        });
        
        // Add the new liability to the list
        setLiabilities([...liabilities, response]);
      }

      // Reset the form
      resetForm();
    } catch (err) {
      console.error("Failed to save liability:", err);
      setError(err.response?.data?.message || "Failed to save liability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to proceed to next step
  const handleSubmit = async () => {
    try {
      // Proceed to next step
      onComplete();
    } catch (err) {
      console.error("Failed to proceed:", err);
      setError("Failed to proceed. Please try again.");
    }
  };

  // Calculate total monthly payments
  const calculateTotalMonthly = () => {
    return liabilities.reduce((sum, liability) => sum + (parseFloat(liability.loanMonthlyRate) || 0), 0);
  };

  // Calculate total loan amounts
  const calculateTotalAmount = () => {
    return liabilities.reduce((sum, liability) => sum + (parseFloat(liability.loanAmount) || 0), 0);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t('profile.liabilities.title', 'Liabilities')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('profile.liabilities.description', 'Please provide information about your loans and other liabilities.')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Existing Liabilities */}
      {liabilities.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">{t('profile.liabilities.existingLoans', 'Your Existing Loans')}</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary/30">
                  <th className="px-4 py-2 text-left">{t('profile.liabilities.loanType', 'Type')}</th>
                  <th className="px-4 py-2 text-left">{t('profile.liabilities.loanBank', 'Bank')}</th>
                  <th className="px-4 py-2 text-right">{t('profile.liabilities.loanAmount', 'Amount')}</th>
                  <th className="px-4 py-2 text-right">{t('profile.liabilities.loanMonthlyRate', 'Monthly')}</th>
                  <th className="px-4 py-2 text-right">{t('profile.liabilities.loanInterest', 'Interest %')}</th>
                  <th className="px-4 py-2 text-center">{t('common.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {liabilities.map((liability) => (
                  <tr key={liability.liabilityId} className="border-b border-secondary/20">
                    <td className="px-4 py-2">
                      {t(`profile.liabilities.loanType.${liability.loanType.toLowerCase()}`, liability.loanType)}
                    </td>
                    <td className="px-4 py-2">{liability.loanBank}</td>
                    <td className="px-4 py-2 text-right">€{parseFloat(liability.loanAmount).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">€{parseFloat(liability.loanMonthlyRate).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{parseFloat(liability.loanInterest).toFixed(2)}%</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          type="button"
                          onClick={() => handleEdit(liability)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {t('common.edit', 'Edit')}
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDelete(liability.liabilityId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          {t('common.delete', 'Delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-secondary/10 font-medium">
                  <td colSpan={2} className="px-4 py-2 text-right">{t('profile.liabilities.total', 'Total')}:</td>
                  <td className="px-4 py-2 text-right">€{calculateTotalAmount().toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">€{calculateTotalMonthly().toFixed(2)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Liability Form */}
      <form onSubmit={handleSaveLiability} className="space-y-4 border border-secondary/30 rounded-md p-4">
        <h4 className="font-medium">
          {editMode 
            ? t('profile.liabilities.editLoan', 'Edit Loan') 
            : t('profile.liabilities.addLoan', 'Add New Loan')}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="loanType" className="block text-sm font-medium">
              {t('profile.liabilities.loanType', 'Loan Type')} *
            </label>
            <select
              id="loanType"
              name="loanType"
              value={currentLiability.loanType}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value={LoanType.MORTGAGE}>{t('profile.liabilities.loanType.mortgage', 'Mortgage')}</option>
              <option value={LoanType.PERSONAL}>{t('profile.liabilities.loanType.personal', 'Personal Loan')}</option>
              <option value={LoanType.AUTO}>{t('profile.liabilities.loanType.auto', 'Auto Loan')}</option>
              <option value={LoanType.STUDENT}>{t('profile.liabilities.loanType.student', 'Student Loan')}</option>
              <option value={LoanType.OTHER}>{t('profile.liabilities.loanType.other', 'Other')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="loanBank" className="block text-sm font-medium">
              {t('profile.liabilities.loanBank', 'Bank/Lender')} *
            </label>
            <Input
              id="loanBank"
              name="loanBank"
              value={currentLiability.loanBank}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="loanAmount" className="block text-sm font-medium">
              {t('profile.liabilities.loanAmount', 'Loan Amount')} (€) *
            </label>
            <Input
              id="loanAmount"
              name="loanAmount"
              type="number"
              min="0"
              step="0.01"
              value={currentLiability.loanAmount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="loanMonthlyRate" className="block text-sm font-medium">
              {t('profile.liabilities.loanMonthlyRate', 'Monthly Payment')} (€) *
            </label>
            <Input
              id="loanMonthlyRate"
              name="loanMonthlyRate"
              type="number"
              min="0"
              step="0.01"
              value={currentLiability.loanMonthlyRate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="loanInterest" className="block text-sm font-medium">
              {t('profile.liabilities.loanInterest', 'Interest Rate')} (%) *
            </label>
            <Input
              id="loanInterest"
              name="loanInterest"
              type="number"
              min="0"
              step="0.01"
              value={currentLiability.loanInterest}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          {editMode && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              disabled={loading}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
          )}
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
            ) : editMode ? t('common.update', 'Update') : t('common.add', 'Add')}
          </Button>
        </div>
      </form>

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
          type="button" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {t('common.next', 'Next')}
        </Button>
      </div>
    </div>
  );
};

export default LiabilitiesForm; 