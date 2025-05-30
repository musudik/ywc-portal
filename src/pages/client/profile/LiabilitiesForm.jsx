import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";

// Loan type constants matching backend values

// Loan type options for dropdown
const LOAN_TYPE_OPTIONS = ["PersonalLoan", "HomeLoan", "CarLoan", "BusinessLoan", "EducationLoan", "OtherLoan"];

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

const LiabilitiesForm = ({ 
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
  const [liabilities, setLiabilities] = useState([]);
  const [currentLiability, setCurrentLiability] = useState({
    personalId,
    loanType: "",
    loanBank: "",
    loanAmount: 0,
    loanMonthlyRate: 0,
    loanInterest: 0
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Helper function to safely get loan type string
  const getLoanTypeString = (loanType) => {
    console.log("getLoanTypeString loanType:", loanType);
    try {
      if (!loanType) return "HomeLoan";
      
      if (typeof loanType === 'string') {
        // Check for exact matches first
        if (loanType === "PersonalLoan") return "PersonalLoan";
        if (loanType === "HomeLoan") return "HomeLoan";
        if (loanType === "CarLoan") return "CarLoan";
        if (loanType === "BusinessLoan") return "BusinessLoan";
        if (loanType === "EducationLoan") return "EducationLoan";
        if (loanType === "OtherLoan") return "OtherLoan";
        
        // Default to the original string if no match
        console.log("getLoanTypeString loanType:", loanType);
        return loanType;
      }
    } catch (error) {
      console.error("Error in getLoanTypeString:", error);
    }
    
    // Default fallback
    return "HomeLoan";
  };

  // Function to get display name for loan type
  const getLoanTypeDisplay = (type) => {
    try {
      const typeString = type || "";
      
      // Default display names
      switch(typeString) {
        case "PersonalLoan": return "Personal Loan";
        case "HomeLoan": return "Home Loan / Mortgage";
        case "CarLoan": return "Car Loan";
        case "BusinessLoan": return "Business Loan";
        case "EducationLoan": return "Education Loan";
        case "OtherLoan": return "Other Loan";
        default: return typeString || "Unknown Loan Type";
      }
    } catch (error) {
      console.error("Error getting loan type display:", error);
      return 'Unknown Loan Type';
    }
  };

  // Update liabilities when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting liabilities data from initialData:", initialData);
      // Process initialData to ensure loanType is a string and clean structure
      if (Array.isArray(initialData) && initialData.length > 0) {
        const processedData = initialData.map(liability => ({
          personalId: liability.personalId || personalId,
          loanType: getLoanTypeString(liability.loanType),
          loanBank: liability.loanBank || "",
          loanAmount: liability.loanAmount || 0,
          loanMonthlyRate: liability.loanMonthlyRate || 0,
          loanInterest: liability.loanInterest || 0,
          liabilityId: liability.liabilityId || liability.id // Keep existing ID if available
        }));
        console.log("processedData:", processedData);
        setLiabilities(processedData);
      } else if (initialData && typeof initialData === 'object' && Object.keys(initialData).length > 0) {
        console.log("initialData:", initialData);
        // If initialData is a single object, create an array with that object
        const singleLiability = {
          personalId: initialData.personalId || personalId,
          loanType: getLoanTypeString(initialData.loanType),
          loanBank: initialData.loanBank || "",
          loanAmount: initialData.loanAmount || 0,
          loanMonthlyRate: initialData.loanMonthlyRate || 0,
          loanInterest: initialData.loanInterest || 0,
          liabilityId: initialData.liabilityId || initialData.id
        };
        console.log("singleLiability:", singleLiability);
        setLiabilities([singleLiability]);
      } else {
        // Initialize with empty array
        setLiabilities([]);
      }
      setInitialLoading(false);
    }
  }, [initialData]);

  // Load initial data if available and initialData prop is not provided
  useEffect(() => {
    const fetchLiabilities = async () => {
      if (personalId && !initialData && !skipApiFetch) {
        try {
          const data = await profileApi.getLiabilities(personalId);
          
          if (data && Array.isArray(data)) {
            // Process the data to ensure loanType is a string and clean structure
            const processedData = data.map(liability => ({
              personalId: liability.personalId || personalId,
              loanType: getLoanTypeString(liability.loanType),
              loanBank: liability.loanBank || "",
              loanAmount: liability.loanAmount || 0,
              loanMonthlyRate: liability.loanMonthlyRate || 0,
              loanInterest: liability.loanInterest || 0,
              liabilityId: liability.liabilityId || liability.id
            }));
            console.log("processedData:", processedData);
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
  }, [personalId, initialData, skipApiFetch]);

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
    console.log("handleEdit liability:", liability);
    // Only copy the required fields to avoid nested data structures
    setCurrentLiability({
      personalId: liability.personalId || personalId,
      loanType: getLoanTypeString(liability.loanType),
      loanBank: liability.loanBank || "",
      loanAmount: liability.loanAmount || 0,
      loanMonthlyRate: liability.loanMonthlyRate || 0,
      loanInterest: liability.loanInterest || 0,
      liabilityId: liability.liabilityId // Keep the ID for updates
    });
    setEditMode(true);
    console.log("currentLiability set to clean object");
  };

  // Handle delete liability
  const handleDelete = async (liabilityId) => {
    try {
      // If skipApiSave is true, just remove from local state without API calls
      if (skipApiSave) {
        console.log("Skipping API delete for liability (used in multi-step form)");
        setLiabilities(liabilities.filter(item => item.liabilityId !== liabilityId));
        return;
      }

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
      loanType: "HomeLoan",
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
      // Make sure loanType is a string and create clean object before sending
      const dataToSubmit = {
        personalId: currentLiability.personalId || personalId,
        loanType: getLoanTypeString(currentLiability.loanType),
        loanBank: currentLiability.loanBank || "",
        loanAmount: currentLiability.loanAmount || 0,
        loanMonthlyRate: currentLiability.loanMonthlyRate || 0,
        loanInterest: currentLiability.loanInterest || 0
      };
      console.log("dataToSubmit (clean):", dataToSubmit);

      // If skipApiSave is true, just add to local state without API calls
      if (skipApiSave) {
        console.log("Skipping API save for liability (used in multi-step form)");
        let updatedLiabilities;
        
        if (editMode && currentLiability.liabilityId) {
          // Update existing liability in local state
          updatedLiabilities = liabilities.map(item => 
            item.liabilityId === currentLiability.liabilityId ? {
              ...dataToSubmit,
              liabilityId: currentLiability.liabilityId
            } : item
          );
        } else {
          // Add new liability to local state with temporary ID
          const newLiability = {
            ...dataToSubmit,
            liabilityId: `temp-${Date.now()}` // Temporary ID for local state
          };
          updatedLiabilities = [...liabilities, newLiability];
        }
        
        setLiabilities(updatedLiabilities);
        resetForm();
        setLoading(false);
        return;
      }

      let response;
      if (editMode && currentLiability.liabilityId) {
        // Update existing liability
        response = await profileApi.updateLiability(dataToSubmit);
        
        // Update the liability in the list with clean object
        setLiabilities(liabilities.map(item => 
          item.liabilityId === response.liabilityId ? {
            personalId: response.personalId || personalId,
            loanType: getLoanTypeString(response.loanType),
            loanBank: response.loanBank || "",
            loanAmount: response.loanAmount || 0,
            loanMonthlyRate: response.loanMonthlyRate || 0,
            loanInterest: response.loanInterest || 0,
            liabilityId: response.liabilityId || response.id
          } : item
        ));
        console.log("liabilities:", liabilities);
      } else {
        // Create new liability
        response = await profileApi.saveLiability({
          ...dataToSubmit,
          personalId
        });
        
        // Add the new liability to the list with clean object
        setLiabilities([...liabilities, {
          personalId: response.personalId || personalId,
          loanType: getLoanTypeString(response.loanType),
          loanBank: response.loanBank || "",
          loanAmount: response.loanAmount || 0,
          loanMonthlyRate: response.loanMonthlyRate || 0,
          loanInterest: response.loanInterest || 0,
          liabilityId: response.liabilityId || response.id
        }]);
        console.log("liabilities:", liabilities);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Proceeding to next step with liabilities:", liabilities);

      // If skipApiSave is true, skip the API calls and just return the data
      if (skipApiSave) {
        console.log("Skipping API save for liabilities (used in multi-step form)");
        const callback = onComplete || onNext;
        if (callback) {
          // Return just the liabilities array, not wrapped in an object
          callback(liabilities);
        }
        setLoading(false);
        return;
      }

      // Individual liabilities are already saved/updated through handleSaveLiability
      // So we just need to proceed to the next step with the current data
      const callback = onComplete || onNext;
      if (callback) {
        callback(liabilities);
      }
    } catch (err) {
      console.error("Failed to proceed:", err);
      setError("Failed to proceed. Please try again.");
    } finally {
      setLoading(false);
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
                  <th scope="col" className="px-4 py-2 text-left">Type</th>
                  <th scope="col" className="px-4 py-2 text-left">Bank</th>
                  <th scope="col" className="px-4 py-2 text-right">Amount</th>
                  <th scope="col" className="px-4 py-2 text-right">Monthly</th>
                  <th scope="col" className="px-4 py-2 text-right">Interest %</th>
                  <th scope="col" className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeLiabilities.map((liability) => {
                  console.log("liability:", liability);
                  if (!liability) return null;
                  
                  try {
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
                              Edit
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDelete(liability.liabilityId)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  } catch (error) {
                    console.error("Error rendering liability row:", error);
                    return null; // Skip rendering this item if there's an error
                  }
                })}
                {safeLiabilities.length > 0 && (
                  <tr className="bg-secondary/10 font-medium">
                    <td colSpan={2} className="px-4 py-2 text-right">Total:</td>
                    <td className="px-4 py-2 text-right">€{calculateTotalAmount().toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">€{calculateTotalMonthly().toFixed(2)}</td>
                    <td colSpan={2}></td>
                  </tr>
                )}
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
              value={currentLiability.loanType}  
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">{t('common.select', 'Select...')}</option>
              {LOAN_TYPE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {t(`profile.liabilities.loanTypeOptions.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1').trim())}
                </option>
              ))}
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