import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import { useProfile } from "../../../contexts/ProfileContext";
import { profileApi } from "../../../api";
import { createSafeTranslate } from "../../../utils/translationUtils";

// Import form components
import PersonalDetailsForm from "./PersonalDetailsForm";
import EmploymentDetailsForm from "./EmploymentDetailsForm";
import IncomeDetailsForm from "./IncomeDetailsForm";
import ExpensesDetailsForm from "./ExpensesDetailsForm";
import AssetsForm from "./AssetsForm";
import LiabilitiesForm from "./LiabilitiesForm";
import GoalsAndWishesForm from "./GoalsAndWishesForm";
import RiskAppetiteForm from "./RiskAppetiteForm";

// Header component with logout and language options
const ProfileHeader = () => {
  const { t, i18n } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full flex justify-between items-center mb-6 p-4 bg-background border-b">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">{safeTranslate('profile.header.title', 'Profile Setup')}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLanguage('en')}
            className={i18n.language === 'en' ? 'bg-primary/20' : ''}
          >
            EN
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLanguage('de')}
            className={i18n.language === 'de' ? 'bg-primary/20' : ''}
          >
            DE
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          {safeTranslate('common.logout', 'Logout')}
        </Button>
      </div>
    </div>
  );
};

// Step progress component
const StepProgress = ({ currentStep, totalSteps, sections, completionPercentage }) => {
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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{safeTranslate('profile.progress.title', 'Profile Setup')}</h2>
        <span className="text-sm text-muted-foreground">
          {safeTranslate('profile.progress.status', 'Step {{current}} of {{total}} ({{percentage}}% Complete)', {
            current: currentStep + 1,
            total: totalSteps,
            percentage: completionPercentage
          })}
        </span>
      </div>
      <div className="flex w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
        <div
          className="bg-green-500 transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        {steps.map((step, index) => (
          <div 
            key={step.key} 
            className={`text-xs p-2 rounded-md text-center ${
              index < currentStep 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                  ? 'bg-green-500/20 border border-green-500' 
                  : 'bg-secondary/30'
            } ${sections?.[step.key] ? 'border border-green-500' : ''}`}
          >
            {step.label}
          </div>
        ))}
      </div>
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
  const [personalDetails, setPersonalDetails] = useState(null);

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
      const step = getCurrentStep();
      
      if (step >= totalSteps) {
        // All steps are complete, redirect to dashboard
        navigate("/client/dashboard");
      } else {
        setCurrentStep(step);
      }
    }
  }, [profileCompletion, navigate, getCurrentStep, totalSteps]);

  // Effect to fetch personal details when component mounts
  useEffect(() => {
    const fetchPersonalDetails = async () => {
      if (personalId) {
        try {
          const details = await profileApi.getPersonalDetails(personalId);
          setPersonalDetails(details);
        } catch (err) {
          console.error("Failed to fetch personal details:", err);
        }
      }
    };

    fetchPersonalDetails();
  }, [personalId]);

  // Handle next step
  const handleNextStep = async (response) => {
    try {
      console.log("Step completed with response:", response);
      
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
        // All steps complete, redirect to dashboard
        navigate("/client/dashboard");
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
    console.log("Rendering step form for step:", currentStep, "with personalId:", personalId);
    
    switch (currentStep) {
      case 0:
        console.log("Rendering PersonalDetailsForm with initialData:", personalDetails, "and id:", user?.id);
        return <PersonalDetailsForm 
          onComplete={handleNextStep} 
          initialData={personalDetails} 
          id={user?.id}
        />;
      case 1:
        // Don't show just an error message - render the form with the error at the top
        return (
          <>
            {!personalId && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                <h3 className="font-bold mb-2">{safeTranslate('common.error', 'Error')}</h3>
                <p>{safeTranslate('profile.employment.personalIdMissing', 'Personal ID is required but not available. Please complete the personal details step first.')}</p>
              </div>
            )}
            <EmploymentDetailsForm 
              onComplete={handleNextStep} 
              onBack={handlePreviousStep} 
              personalId={personalId || ''} // Pass empty string instead of null/undefined
            />
          </>
        );
      case 2:
        return <IncomeDetailsForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
        />;
      case 3:
        return <ExpensesDetailsForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
        />;
      case 4:
        return <AssetsForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
        />;
      case 5:
        return <LiabilitiesForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
        />;
      case 6:
        return <GoalsAndWishesForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
        />;
      case 7:
        return <RiskAppetiteForm 
          onComplete={handleNextStep} 
          onBack={handlePreviousStep} 
          personalId={personalId} 
        />;
      default:
        return <div>Unknown step</div>;
    }
  };

  if (!profileCompletion) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <ProfileHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl">
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6">
            <StepProgress 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
              sections={profileCompletion.sections}
              completionPercentage={profileCompletion.completionPercentage}
            />
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {renderStepForm()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup; 