import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";

// Loan type constants matching backend values
const PERSONAL_LOAN = "PersonalLoan";
const HOME_LOAN = "HomeLoan";
const CAR_LOAN = "CarLoan";
const BUSINESS_LOAN = "BusinessLoan";
const EDUCATION_LOAN = "EducationLoan";
const OTHER_LOAN = "OtherLoan";

// Debug function to safely stringify any value for rendering
const safeStringify = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.error("Failed to stringify value:", e);
    return "[Object]";
  }
};

const LiabilitiesForm = ({ onComplete, onBack, personalId, initialData }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liabilities, setLiabilities] = useState([]);
  const [currentLiability, setCurrentLiability] = useState({
    personalId,
    loanType: HOME_LOAN,
    loanBank: "",
    loanAmount: 0,
    loanMonthlyRate: 0,
    loanInterest: 0
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Helper function to safely get loan type string
  const getLoanTypeString = (loanType) => {
    console.log("loanType", loanType);
    if (!loanType) return HOME_LOAN;
    
    if (typeof loanType === 'string') {
      // Check for exact matches first
      if (loanType === PERSONAL_LOAN) return PERSONAL_LOAN;
      if (loanType === HOME_LOAN) return HOME_LOAN;
      if (loanType === CAR_LOAN) return CAR_LOAN;
      if (loanType === BUSINESS_LOAN) return BUSINESS_LOAN;
      if (loanType === EDUCATION_LOAN) return EDUCATION_LOAN;
      if (loanType === OTHER_LOAN) return OTHER_LOAN;
      
      // Check for partial matches
      const loanTypeUpper = loanType.toUpperCase();
      if (loanTypeUpper.includes("PERSONAL") || loanTypeUpper.includes("CONSUMER")) return PERSONAL_LOAN;
      if (loanTypeUpper.includes("HOME") || loanTypeUpper.includes("MORTGAGE") || loanTypeUpper.includes("HOUSE")) return HOME_LOAN;
      if (loanTypeUpper.includes("CAR") || loanTypeUpper.includes("AUTO") || loanTypeUpper.includes("VEHICLE")) return CAR_LOAN;
      if (loanTypeUpper.includes("BUSINESS") || loanTypeUpper.includes("COMMERCIAL")) return BUSINESS_LOAN;
      if (loanTypeUpper.includes("EDUCATION") || loanTypeUpper.includes("STUDENT") || loanTypeUpper.includes("STUDY")) return EDUCATION_LOAN;
      
      // Default to the original string if no match
      return loanType;
    }
    
    try {
      // If it's an object, try to convert to string
      const str = JSON.stringify(loanType);
      
      if (str.includes("PersonalLoan") || str.includes("personal")) return PERSONAL_LOAN;
      if (str.includes("HomeLoan") || str.includes("home") || str.includes("mortgage")) return HOME_LOAN;
      if (str.includes("CarLoan") || str.includes("car") || str.includes("auto")) return CAR_LOAN;
      if (str.includes("BusinessLoan") || str.includes("business")) return BUSINESS_LOAN;
      if (str.includes("EducationLoan") || str.includes("education") || str.includes("student")) return EDUCATION_LOAN;
      if (str.includes("OtherLoan") || str.includes("other")) return OTHER_LOAN;
    } catch (e) {
      console.error("Error converting loan type to string:", e);
    }
    
    return HOME_LOAN;
  };

  // Function to get display name for loan type
  const getLoanTypeDisplay = (type) => {
    const typeString = getLoanTypeString(type);
    
    switch(typeString) {
      case PERSONAL_LOAN: return t('profile.liabilities.loanType.personal', 'Personal Loan');
      case HOME_LOAN: return t('profile.liabilities.loanType.home', 'Home Loan / Mortgage');
      case CAR_LOAN: return t('profile.liabilities.loanType.car', 'Car Loan');
      case BUSINESS_LOAN: return t('profile.liabilities.loanType.business', 'Business Loan');
      case EDUCATION_LOAN: return t('profile.liabilities.loanType.education', 'Education Loan');
      case OTHER_LOAN: return t('profile.liabilities.loanType.other', 'Other Loan');
      default: return typeString;
    }
  };

  // Update liabilities when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting liabilities data from initialData:", initialData);
      // Process initialData to ensure loanType is a string
      if (Array.isArray(initialData)) {
        const processedData = initialData.map(liability => ({
          ...liability,
          loanType: getLoanTypeString(liability.loanType)
        }));
        setLiabilities(processedData);
      } else {
        // If initialData is a single object, create an array with that object
        const singleLiability = {
          ...initialData,
          loanType: getLoanTypeString(initialData.loanType)
        };
        setLiabilities([singleLiability]);
      }
      setInitialLoading(false);
    }
  }, [initialData]);

  // Load initial data if available and initialData prop is not provided
  useEffect(() => {
    const fetchLiabilities = async () => {
      if (personalId && !initialData) {
        try {
          const data = await profileApi.getLiabilities(personalId);
          
          if (data && Array.isArray(data)) {
            // Process the data to ensure loanType is a string
            const processedData = data.map(liability => ({
              ...liability,
              loanType: getLoanTypeString(liability.loanType)
            }));
            setLiabilities(processedData);
          } else {
            setLiabilities([]);
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Failed to fetch liabilities:", err);
            setError("Failed to load liabilities. Please try again.");
          }
          setLiabilities([]);
        } finally {
          setInitialLoading(false);
        }
      } else if (!initialData) {
        setInitialLoading(false);
        setLiabilities([]);
      }
    };

    fetchLiabilities();
  }, [personalId, initialData]);

  // Handle input changes for current liability
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let parsedValue = value;
    if (name !== "loanType" && name !== "loanBank") {
      parsedValue = parseFloat(value) || 0;
    }
    
    setCurrentLiability(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  // Handle edit liability
  const handleEdit = (liability) => {
    setCurrentLiability({
      ...liability,
      loanType: getLoanTypeString(liability.loanType)
    });
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
      loanType: HOME_LOAN,
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
      // Make sure loanType is a string before sending
      const dataToSubmit = {
        ...currentLiability,
        loanType: getLoanTypeString(currentLiability.loanType)
      };
      
      let response;
      if (editMode && currentLiability.liabilityId) {
        // Update existing liability
        response = await profileApi.updateLiability(dataToSubmit);
        
        // Update the liability in the list
        setLiabilities(liabilities.map(item => 
          item.liabilityId === response.liabilityId ? {
            ...response,
            loanType: getLoanTypeString(response.loanType)
          } : item
        ));
      } else {
        // Create new liability
        response = await profileApi.saveLiability({
          ...dataToSubmit,
          personalId
        });
        
        // Add the new liability to the list
        setLiabilities([...liabilities, {
          ...response,
          loanType: getLoanTypeString(response.loanType)
        }]);
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

  // Ensure liabilities is always an array before rendering
  const safeLiabilities = Array.isArray(liabilities) ? liabilities : [];

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
          {typeof error === 'string' ? error : safeStringify(error)}
        </div>
      )}

      {/* Existing Liabilities */}
      {safeLiabilities.length > 0 && (
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
                {safeLiabilities.map((liability) => {
                  // Ensure we have string values for display
                  const loanTypeStr = getLoanTypeString(liability.loanType);
                  const loanTypeDisplay = getLoanTypeDisplay(loanTypeStr);
                  const loanBank = typeof liability.loanBank === 'string' ? liability.loanBank : safeStringify(liability.loanBank);
                  const loanAmount = parseFloat(liability.loanAmount || 0).toFixed(2);
                  const loanMonthlyRate = parseFloat(liability.loanMonthlyRate || 0).toFixed(2);
                  const loanInterest = parseFloat(liability.loanInterest || 0).toFixed(2);
                  
                  return (
                    <tr key={liability.liabilityId || `liability-${Math.random()}`} className="border-b border-secondary/20">
                      <td className="px-4 py-2">{loanTypeDisplay}</td>
                      <td className="px-4 py-2">{loanBank}</td>
                      <td className="px-4 py-2 text-right">€{loanAmount}</td>
                      <td className="px-4 py-2 text-right">€{loanMonthlyRate}</td>
                      <td className="px-4 py-2 text-right">{loanInterest}%</td>
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
                  );
                })}
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
              {t('profile.liabilities.loanTypeLabel', 'Loan Type')} *
            </label>
            <select
              id="loanType"
              name="loanType"
              value={typeof currentLiability.loanType === 'string' ? currentLiability.loanType : HOME_LOAN}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value={PERSONAL_LOAN}>{t('profile.liabilities.loanType.personal', 'Personal Loan')}</option>
              <option value={HOME_LOAN}>{t('profile.liabilities.loanType.home', 'Home Loan / Mortgage')}</option>
              <option value={CAR_LOAN}>{t('profile.liabilities.loanType.car', 'Car Loan')}</option>
              <option value={BUSINESS_LOAN}>{t('profile.liabilities.loanType.business', 'Business Loan')}</option>
              <option value={EDUCATION_LOAN}>{t('profile.liabilities.loanType.education', 'Education Loan')}</option>
              <option value={OTHER_LOAN}>{t('profile.liabilities.loanType.other', 'Other Loan')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="loanBank" className="block text-sm font-medium">
              {t('profile.liabilities.loanBank', 'Bank/Lender')} *
            </label>
            <Input
              id="loanBank"
              name="loanBank"
              value={typeof currentLiability.loanBank === 'string' ? currentLiability.loanBank : ''}
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
              value={currentLiability.loanAmount || 0}
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
              value={currentLiability.loanMonthlyRate || 0}
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
              value={currentLiability.loanInterest || 0}
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