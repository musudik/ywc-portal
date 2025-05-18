import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import { useProfile } from "../../../contexts/ProfileContext";
import { profileApi } from "../../../api";
import { createSafeTranslate } from "../../../utils/translationUtils";
import DashboardLayout from "../../../components/dashboard/layout";

// Import form components
import PersonalDetailsForm from "./PersonalDetailsForm";
import EmploymentDetailsForm from "./EmploymentDetailsForm";
import IncomeDetailsForm from "./IncomeDetailsForm";
import ExpensesDetailsForm from "./ExpensesDetailsForm";
import AssetsForm from "./AssetsForm";
import LiabilitiesForm from "./LiabilitiesForm";
import GoalsAndWishesForm from "./GoalsAndWishesForm";
import RiskAppetiteForm from "./RiskAppetiteForm";

// Step progress component
const StepProgress = ({ currentStep, totalSteps, sections, completionPercentage, onStepClick }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const steps = [
    { key: 'personalDetails', label: safeTranslate('profile.steps.personalDetails', 'Personal Details') },
    { key: 'employment', label: safeTranslate('profile.steps.employment', 'Employment') },
    { key: 'income', label: safeTranslate('profile.steps.income', 'Income') },
    { key: 'expenses', label: safeTranslate('profile.steps.expenses', 'Expenses') },
    { key: 'assets', label: safeTranslate('profile.steps.assets', 'Assets') },
    { key: 'liabilities', label: safeTranslate('profile.steps.liabilities', 'Liabilities') },
    { key: 'goalsAndWishes', label: safeTranslate('profile.steps.goalsAndWishes', 'Goals & Wishes') },
    { key: 'riskAppetite', label: safeTranslate('profile.steps.riskAppetite', 'Risk Profile') }
  ];

  // Sanitize current step to be within valid range
  const safeCurrentStep = Math.min(Math.max(0, currentStep), totalSteps - 1);
  
  // Calculate percentage if not provided
  const percentage = completionPercentage || Math.round((safeCurrentStep / totalSteps) * 100);
  
  // Calculate step display value - handle edge case for display
  const currentStepDisplay = currentStep >= totalSteps ? totalSteps : (safeCurrentStep + 1);
  
  // Check for edit mode
  const isEditMode = window.location.search.includes('edit=true');

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{safeTranslate('profile.progress.title', 'Profile Setup')}</h2>
        <span className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 font-medium">
          {`${safeTranslate('profile.steps.step', 'Step')} ${currentStepDisplay} ${safeTranslate('profile.steps.of', 'of')} ${totalSteps} (${percentage}% ${safeTranslate('profile.steps.complete', 'Complete')})`}
        </span>
      </div>
      <div className="flex w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
        <div
          className="bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {steps.map((step, index) => {
          // In edit mode, consider steps completed if they have data or are before current step
          const isCompleted = isEditMode || index < safeCurrentStep || sections?.[step.key];
          const isCurrent = index === safeCurrentStep;
          const hasData = sections?.[step.key];
          
          return (
            <button 
              key={step.key} 
              onClick={() => onStepClick(index)}
              className={`
                py-3 px-2 rounded-md text-center transition-all duration-200 flex flex-col items-center justify-center
                bg-green-600 text-white hover:bg-green-700 cursor-pointer
              `}
            >
              <span className="text-sm font-medium">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Section menu for completed profiles
const ProfileSectionMenu = ({ currentStep, setCurrentStep }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const sections = [
    { key: 0, label: safeTranslate('profile.steps.personalDetails', 'Personal Details') },
    { key: 1, label: safeTranslate('profile.steps.employment', 'Employment') },
    { key: 2, label: safeTranslate('profile.steps.income', 'Income') },
    { key: 3, label: safeTranslate('profile.steps.expenses', 'Expenses') },
    { key: 4, label: safeTranslate('profile.steps.assets', 'Assets') },
    { key: 5, label: safeTranslate('profile.steps.liabilities', 'Liabilities') },
    { key: 6, label: safeTranslate('profile.steps.goalsAndWishes', 'Goals & Wishes') },
    { key: 7, label: safeTranslate('profile.steps.riskAppetite', 'Risk Profile') },
  ];
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {sections.map(section => (
        <button
          key={section.key}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentStep === section.key
              ? 'bg-green-600 text-white'
              : 'bg-green-500/20 text-green-900 hover:bg-green-500/40'
          }`}
          onClick={() => setCurrentStep(section.key)}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
};

const ProfileSetup = () => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profileCompletion, personalId, updateProfileCompletion, getCurrentStep, refreshPersonalId } = useProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  // Section data states
  const [personalDetails, setPersonalDetails] = useState(null);
  const [employmentDetails, setEmploymentDetails] = useState(null);
  const [incomeDetails, setIncomeDetails] = useState(null);
  const [expensesDetails, setExpensesDetails] = useState(null);
  const [assetsDetails, setAssetsDetails] = useState(null);
  const [liabilitiesDetails, setLiabilitiesDetails] = useState(null);
  const [goalsAndWishesDetails, setGoalsAndWishesDetails] = useState(null);
  const [riskAppetiteDetails, setRiskAppetiteDetails] = useState(null);

  // Debug log for personalId
  useEffect(() => {
    console.log("ProfileSetup - personalId:", personalId);
    
    // If we're on step 1 or later and personalId is missing, try to refresh it
    if (currentStep > 0 && !personalId) {
      console.log("Trying to refresh personalId because it's missing and we're on step:", currentStep);
      refreshPersonalId().then(id => {
        if (id) {
          console.log("Successfully refreshed personalId:", id);
        } else {
          console.log("Could not refresh personalId, still missing");
        }
      });
    }
  }, [personalId, currentStep, refreshPersonalId]);

  // Total number of steps
  const totalSteps = 8;

  // Effect to determine the current step based on profile completion
  useEffect(() => {
    if (profileCompletion) {
      // Check if we're coming from dashboard (edit mode)
      const isEditMode = window.location.search.includes('edit=true');
      
      // Get current step from profile completion
      const step = getCurrentStep();
      console.log("Current step from profile completion:", step, "total steps:", totalSteps);
      
      // If in edit mode, don't redirect to dashboard even if complete
      if (isEditMode) {
        // If step is >= totalSteps, set to first step (Personal Details)
        if (step >= totalSteps) {
          console.log("All steps complete in edit mode, defaulting to Personal Details step");
          setCurrentStep(0);
        } else {
          setCurrentStep(step);
        }
      } else {
        if (step >= totalSteps) {
          // All steps are complete, redirect to dashboard
          // Only redirect if not in edit mode
          navigate("/client/dashboard");
        } else {
          setCurrentStep(step);
        }
      }
    }
  }, [profileCompletion, navigate, getCurrentStep, totalSteps]);

  // Direct fetch of all profile data (useful for prepopulating forms)
  const fetchAllProfileData = async () => {
    if (!personalId) return;
    setLoading(true);
    try {
      const data = await profileApi.getPersonalDetails(personalId);
      if (data) {
        // Handle main personal details
        const userDetails = Array.isArray(data) ? data[0] : data;
        setPersonalDetails(userDetails);
        
        // Set data from nested objects/arrays
        if (userDetails.employmentDetails && userDetails.employmentDetails.length > 0) {
          setEmploymentDetails(userDetails.employmentDetails[0]);
        }
        
        if (userDetails.incomeDetails && userDetails.incomeDetails.length > 0) {
          setIncomeDetails(userDetails.incomeDetails[0]);
        }
        
        if (userDetails.expensesDetails && userDetails.expensesDetails.length > 0) {
          setExpensesDetails(userDetails.expensesDetails[0]);
        }
        
        if (userDetails.assets && userDetails.assets.length > 0) {
          setAssetsDetails(userDetails.assets[0]);
        }
        
        if (userDetails.liabilities && userDetails.liabilities.length > 0) {
          setLiabilitiesDetails(userDetails.liabilities[0]);
        }
        
        if (userDetails.goalsAndWishes) {
          setGoalsAndWishesDetails(userDetails.goalsAndWishes);
        }
        
        if (userDetails.riskAppetite) {
          setRiskAppetiteDetails(userDetails.riskAppetite);
        }
        
        console.log("All profile data loaded", userDetails);
      }
    } catch (err) {
      console.error("Failed to fetch all profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load when personalId becomes available
  useEffect(() => {
    if (personalId) {
      fetchAllProfileData();
    }
  }, [personalId]);

  // Fetch section data when currentStep changes
  useEffect(() => {
    const fetchSectionData = async () => {
      if (!personalId) return;
      setLoading(true);
      try {
        switch (currentStep) {
          case 0: {
            const data = await profileApi.getPersonalDetails(personalId);
            setPersonalDetails(Array.isArray(data) ? data[0] : data);
            break;
          }
          case 1: {
            const data = await profileApi.getEmploymentDetails(personalId);
            setEmploymentDetails(Array.isArray(data) ? data[0] : data);
            break;
          }
          case 2: {
            const data = await profileApi.getIncomeDetails(personalId);
            setIncomeDetails(Array.isArray(data) ? data[0] : data);
            break;
          }
          case 3: {
            const data = await profileApi.getExpensesDetails(personalId);
            setExpensesDetails(Array.isArray(data) ? data[0] : data);
            break;
          }
          case 4: {
            const data = await profileApi.getAssets(personalId);
            setAssetsDetails(Array.isArray(data) ? data[0] : data);
            break;
          }
          case 5: {
            const data = await profileApi.getLiabilities(personalId);
            setLiabilitiesDetails(Array.isArray(data) ? data[0] : data);
            break;
          }
          case 6: {
            const data = await profileApi.getGoalsAndWishes(personalId);
            setGoalsAndWishesDetails(Array.isArray(data) ? data[0] : data);
            break;
          }
          case 7: {
            const data = await profileApi.getRiskAppetite(personalId);
            setRiskAppetiteDetails(Array.isArray(data) ? data[0] : data);
            break;
          }
          default:
            break;
        }
      } catch (err) {
        setError('Failed to load section data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSectionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, personalId]);

  // Handler for clicking on a step in the progress bar
  const handleStepClick = (stepIndex) => {
    // Check if we're in edit mode
    const isEditMode = window.location.search.includes('edit=true');
    
    // In edit mode, always allow clicking on any step without additional conditions
    if (isEditMode) {
      setSelectedStep(stepIndex);
      setCurrentStep(stepIndex);
      setShowUpdateButton(true);
      return;
    }
    
    // For non-edit mode, only allow clicking on completed steps or the current step
    const currentStepFromContext = getCurrentStep();
    if (stepIndex <= currentStepFromContext || profileCompletion?.[Object.keys(profileCompletion)[stepIndex]]) {
      setSelectedStep(stepIndex);
      setCurrentStep(stepIndex);
      setShowUpdateButton(stepIndex < currentStepFromContext);
    }
  };

  // Handle update button click
  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Directly call the appropriate API based on the current step
      switch (currentStep) {
        case 0:
          if (personalDetails) {
            // Create a clean copy without nested objects
            const cleanData = { ...personalDetails };
            
            // Extract IDs from nested objects
            if (cleanData.coach && typeof cleanData.coach === 'object') {
              cleanData.coachId = cleanData.coach.id;
              delete cleanData.coach;
            }
            
            // Remove user object (keep userId if needed)
            if (cleanData.user && typeof cleanData.user === 'object') {
              delete cleanData.user;
            }
            
            await profileApi.updatePersonalDetails(cleanData);
          }
          break;
        case 1:
          if (employmentDetails) {
            await profileApi.updateEmploymentDetails(employmentDetails);
          }
          break;
        case 2:
          if (incomeDetails) {
            await profileApi.updateIncomeDetails(incomeDetails);
          }
          break;
        case 3:
          if (expensesDetails) {
            await profileApi.updateExpensesDetails(expensesDetails);
          }
          break;
        case 4:
          if (assetsDetails) {
            await profileApi.updateAssets(assetsDetails);
          }
          break;
        case 5:
          if (liabilitiesDetails) {
            await profileApi.updateLiabilities(liabilitiesDetails);
          }
          break;
        case 6:
          if (goalsAndWishesDetails) {
            await profileApi.updateGoalsAndWishes(goalsAndWishesDetails);
          }
          break;
        case 7:
          if (riskAppetiteDetails) {
            await profileApi.updateRiskAppetite(riskAppetiteDetails);
          }
          break;
        default:
          break;
      }
      
      // After updating, refresh the data for the current step
      await refreshCurrentStepData();
      
      // Reset the update button state
      setShowUpdateButton(false);
      setLoading(false);
    } catch (err) {
      console.error("Failed to update:", err);
      setError(safeTranslate("profile.updateError", "Failed to update data. Please try again."));
      setLoading(false);
    }
  };

  // Add a new helper function to refresh data for the current step
  const refreshCurrentStepData = async () => {
    if (!personalId) return;
    
    try {
      switch (currentStep) {
        case 0: {
          const data = await profileApi.getPersonalDetails(personalId);
          setPersonalDetails(Array.isArray(data) ? data[0] : data);
          break;
        }
        case 1: {
          const data = await profileApi.getEmploymentDetails(personalId);
          setEmploymentDetails(Array.isArray(data) ? data[0] : data);
          break;
        }
        case 2: {
          const data = await profileApi.getIncomeDetails(personalId);
          setIncomeDetails(Array.isArray(data) ? data[0] : data);
          break;
        }
        case 3: {
          const data = await profileApi.getExpensesDetails(personalId);
          setExpensesDetails(Array.isArray(data) ? data[0] : data);
          break;
        }
        case 4: {
          const data = await profileApi.getAssets(personalId);
          setAssetsDetails(Array.isArray(data) ? data[0] : data);
          break;
        }
        case 5: {
          const data = await profileApi.getLiabilities(personalId);
          setLiabilitiesDetails(Array.isArray(data) ? data[0] : data);
          break;
        }
        case 6: {
          const data = await profileApi.getGoalsAndWishes(personalId);
          setGoalsAndWishesDetails(Array.isArray(data) ? data[0] : data);
          break;
        }
        case 7: {
          const data = await profileApi.getRiskAppetite(personalId);
          setRiskAppetiteDetails(Array.isArray(data) ? data[0] : data);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error(`Failed to refresh data for step ${currentStep}:`, err);
    }
  };

  // Handle next step
  const handleNextStep = async (response) => {
    try {
      console.log("Step completed with response:", response);
      
      // Check if we're in edit mode
      const isEditMode = window.location.search.includes('edit=true');
      
      // If we're on the personal details step and have a response with an ID, set it
      if (currentStep === 0 && response) {
        // Try to extract ID from response
        let newPersonalId = null;
        
        if (response.personalId) {
          newPersonalId = response.personalId;
          console.log("Found personalId in response:", newPersonalId);
        } else if (response.id) {
          newPersonalId = response.id;
          console.log("Found id in response:", newPersonalId);
        }
        
        if (newPersonalId) {
          console.log("Setting personalId from response:", newPersonalId);
          // Force refresh personal ID in context
          await refreshPersonalId();
        }
      }
      
      // Update profile completion status
      const updatedStatus = await updateProfileCompletion();
      console.log("Updated profile completion status:", updatedStatus);
      
      // Move to next step based on updated completion status
      const nextStep = getCurrentStep();
      
      if (nextStep >= totalSteps) {
        // All steps complete
        if (!isEditMode) {
          // Redirect to dashboard only if not in edit mode
          navigate("/client/dashboard");
        } else {
          // In edit mode, don't redirect, go to the first step to allow editing all sections
          setCurrentStep(0);
        }
      } else {
        setCurrentStep(nextStep);
      }
    } catch (err) {
      console.error("Failed to proceed to next step:", err);
      setError(safeTranslate("profile.saveError", "Failed to save data. Please try again."));
    }
  };

  // Handle previous step
  const handlePreviousStep = async () => {
    if (currentStep > 0) {
      try {
        // When going back to any previous step, refresh the personalId first
        const refreshedId = await refreshPersonalId();
        console.log("Refreshed personalId before going back:", refreshedId);
        
        // When going back to step 0 (Personal Details), make sure to fetch the latest data
        if (currentStep === 1) {
          try {
            // Try to get the latest personal details directly using the context's getPersonalDetails function
            console.log("Fetching personal details when going back to step 0");
            const details = await profileApi.getPersonalDetails();
            
            if (details) {
              // Handle case where details is an array
              const personalDetails = Array.isArray(details) && details.length > 0 ? details[0] : details;
              console.log("Setting personal details for step 0:", personalDetails);
              setPersonalDetails(personalDetails);
            }
          } catch (err) {
            console.error("Failed to fetch personal details when going back:", err);
          }
        }
        
        setCurrentStep(currentStep - 1);
      } catch (err) {
        console.error("Error while navigating to previous step:", err);
        // Still allow navigation even if refresh fails
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Render the current step form
  const renderStepForm = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      );
    }
    
    // Check if we're in edit mode
    const isEditMode = window.location.search.includes('edit=true');
    
    // Get form components with adjusted props to handle the button logic
    switch (currentStep) {
      case 0:
        return <PersonalDetailsForm 
          onComplete={handleNextStep} 
          initialData={personalDetails} 
          id={user?.id}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
      case 1:
        return <EmploymentDetailsForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId || ''}
          initialData={employmentDetails}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
      case 2:
        return <IncomeDetailsForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
          initialData={incomeDetails}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
      case 3:
        return <ExpensesDetailsForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
          initialData={expensesDetails}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
      case 4:
        return <AssetsForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
          initialData={assetsDetails}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
      case 5:
        return <LiabilitiesForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
          initialData={liabilitiesDetails}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
      case 6:
        return <GoalsAndWishesForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
          initialData={goalsAndWishesDetails}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
      case 7:
        return <RiskAppetiteForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
          initialData={riskAppetiteDetails}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
      default:
        return <PersonalDetailsForm 
          onComplete={handleNextStep} 
          initialData={personalDetails} 
          id={user?.id}
          showUpdateButton={showUpdateButton || isEditMode}
          onUpdate={handleUpdate}
          profileComplete={profileCompletion?.isComplete}
          isEditMode={isEditMode}
        />;
    }
  };

  // Main render function
  return (
    <DashboardLayout>
      <div className="container max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Always show section menu in edit mode */}
          {window.location.search.includes('edit=true') ? (
            // Show section menu for edit mode
            <ProfileSectionMenu 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
            />
          ) : (
            // For non-edit mode, show section menu for completed profiles, otherwise show progress bar
            profileCompletion?.personalDetails && currentStep >= totalSteps ? (
              <ProfileSectionMenu 
                currentStep={currentStep} 
                setCurrentStep={setCurrentStep} 
              />
            ) : (
              <StepProgress 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                sections={profileCompletion}
                completionPercentage={profileCompletion?.completionPercentage}
                onStepClick={handleStepClick}
              />
            )
          )}

          {/* Content area with improved padding */}
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 m-6 rounded">
                {error}
              </div>
            )}
            
            {/* Update button when a completed step is selected - removed notification text */}
            {showUpdateButton && (
              <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-border flex justify-end">
                <Button 
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? t('Updating...') : t('Update')}
                </Button>
              </div>
            )}
            
            {/* Form content with proper padding */}
            <div className="p-6">
              {renderStepForm()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSetup; 