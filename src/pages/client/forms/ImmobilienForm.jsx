import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { profileApi, formsApi } from "../../../api";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardLayout from "../../../components/dashboard/layout";
import { Input } from "../../../components/ui/input";
import { createSafeTranslate } from "../../../utils/translationUtils";
import { useNavigate } from "react-router-dom";

// Import form components
import PersonalDetailsForm from "../profile/PersonalDetailsForm";
import EmploymentDetailsForm from "../profile/EmploymentDetailsForm";
import IncomeDetailsForm from "../profile/IncomeDetailsForm";
import ExpensesDetailsForm from "../profile/ExpensesDetailsForm";
import AssetsForm from "../profile/AssetsForm";
import LiabilitiesForm from "../profile/LiabilitiesForm";

// Import form templates
import templates from "./templates.json";

// Service map for fetching pre-populated data
const serviceMap = {
  personal: "getPersonalDetails",
  employment: "getEmploymentDetails",
  income: "getIncomeDetails",
  expenses: "getExpensesDetails",
  assets: "getAssets",
  liabilities: "getLiabilities"
};

// Step progress component
const StepProgress = ({ currentStep, totalSteps, onStepClick }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  
  // Define steps based on immobilien template
  const steps = [
    { key: 'personalDetails', label: safeTranslate('profile.steps.personalDetails', 'Personal Details') },
    { key: 'employment', label: safeTranslate('profile.steps.employment', 'Employment') },
    { key: 'income', label: safeTranslate('profile.steps.income', 'Income') },
    { key: 'expenses', label: safeTranslate('profile.steps.expenses', 'Expenses') },
    { key: 'assets', label: safeTranslate('profile.steps.assets', 'Assets') },
    { key: 'liabilities', label: safeTranslate('profile.steps.liabilities', 'Liabilities') },
    { key: 'consent', label: safeTranslate('form.consent', 'Consent') }
  ];

  // Calculate percentage completion
  const percentage = Math.round((currentStep / (totalSteps - 1)) * 100);
  
  // Display current step (1-indexed)
  const currentStepDisplay = currentStep + 1;
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{safeTranslate('form.immobilien.title', 'Immobilien Form')}</h2>
        <span className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 font-medium">
          {safeTranslate('profile.progress.status', 'Step {{current}} of {{total}} ({{percentage}}% Complete)', { 
            current: currentStepDisplay, 
            total: totalSteps,
            percentage
          })}
        </span>
      </div>
      <div className="flex w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
        <div
          className="bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
        {steps.map((step, index) => {
          // Consider steps completed if they're before current step
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <button 
              key={step.key} 
              onClick={() => onStepClick(index)}
              disabled={!isCompleted && !isCurrent}
              className={`
                py-3 px-2 rounded-md text-center transition-all duration-200 flex flex-col items-center justify-center
                ${isCurrent ? 'bg-green-600 text-white' : 
                  isCompleted ? 'bg-green-500/80 text-white hover:bg-green-600' : 
                  'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'}
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

// Signature Canvas component for consent form
const SignatureCanvas = ({ onSignatureChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastX(x);
    setLastY(y);
    
    // Pass the canvas data to parent
    if (onSignatureChange) {
      onSignatureChange(canvas.toDataURL());
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Pass empty data to parent
    if (onSignatureChange) {
      onSignatureChange("");
    }
  };

  return (
    <div className="mt-4">
      <div className="border border-gray-300 rounded-md mb-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          className="w-full touch-none"
        />
      </div>
      <Button 
        type="button" 
        variant="outline" 
        onClick={clearCanvas}
        className="text-sm"
      >
        Clear Signature
      </Button>
    </div>
  );
};

// Consent form component
const ConsentForm = ({ onComplete, consentText }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [signature, setSignature] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    place: "",
    agreed: false
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!formData.place) {
      setError(safeTranslate("form.errors.placeRequired", "Please enter the place"));
      return;
    }
    
    if (!formData.agreed) {
      setError(safeTranslate("form.errors.consentRequired", "You must agree to the terms"));
      return;
    }
    
    if (!signature) {
      setError(safeTranslate("form.errors.signatureRequired", "Please provide your signature"));
      return;
    }
    
    // If all validations pass
    onComplete({
      signature,
      date: formData.date,
      place: formData.place,
      agreed: formData.agreed
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">{safeTranslate("form.consent", "Consent")}</h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {consentText}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {safeTranslate("form.date", "Date")}
          </label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {safeTranslate("form.place", "Place")}
          </label>
          <Input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder={safeTranslate("form.placePlaceholder", "Enter city/location")}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          {safeTranslate("form.signature", "Signature")}
        </label>
        <SignatureCanvas onSignatureChange={setSignature} />
      </div>
      
      <div className="flex items-start mt-4">
        <input
          type="checkbox"
          id="agreed"
          name="agreed"
          checked={formData.agreed}
          onChange={handleChange}
          className="mt-1 mr-2"
        />
        <label htmlFor="agreed" className="text-sm">
          {safeTranslate("form.agreeToTerms", "I agree to the terms and conditions described above")}
        </label>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button type="submit">
          {safeTranslate("form.submit", "Submit Form")}
        </Button>
      </div>
    </form>
  );
};

// Main Immobilien Form component
const ImmobilienForm = () => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data for each form section
  const [personalData, setPersonalData] = useState(null);
  const [employmentData, setEmploymentData] = useState(null);
  const [incomeData, setIncomeData] = useState(null);
  const [expensesData, setExpensesData] = useState(null);
  const [assetsData, setAssetsData] = useState(null);
  const [liabilitiesData, setLiabilitiesData] = useState(null);
  const [consentData, setConsentData] = useState(null);
  
  // Get immobilien template
  const immobilienTemplate = templates.immobilien;
  
  // Total number of steps
  const totalSteps = immobilienTemplate.required.length;
  
  // Load pre-populated data for all required sections
  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        // Fetch data for each required section using the service map
        for (const section of immobilienTemplate.required) {
          if (section === 'consent') continue; // Skip consent as it doesn't have API data
          
          const serviceName = serviceMap[section];
          if (serviceName && profileApi[serviceName]) {
            try {
              const data = await profileApi[serviceName]();
              // Store the data in the appropriate state variable
              switch (section) {
                case 'personal':
                  setPersonalData(data);
                  break;
                case 'employment':
                  setEmploymentData(data);
                  break;
                case 'income':
                  setIncomeData(data);
                  break;
                case 'expenses':
                  setExpensesData(data);
                  break;
                case 'assets':
                  setAssetsData(data);
                  break;
                case 'liabilities':
                  setLiabilitiesData(data);
                  break;
                default:
                  break;
              }
            } catch (err) {
              console.error(`Error fetching ${section} data:`, err);
              // Continue with other sections even if one fails
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch form data:", err);
        setError(safeTranslate("form.errors.loadingFailed", "Failed to load form data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    
    fetchFormData();
  }, [immobilienTemplate.required]);
  
  // Handle step click for navigation
  const handleStepClick = (stepIndex) => {
    // Only allow navigating to completed steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };
  
  // Handle next step
  const handleNextStep = (stepData) => {
    // Save the current step's data
    const currentStepName = immobilienTemplate.required[currentStep];
    setFormData(prev => ({
      ...prev,
      [currentStepName]: stepData
    }));
    
    // Move to the next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Handle form completion
  const handleFormComplete = async (consentData) => {
    // Save consent data
    setConsentData(consentData);
    
    // Compile all form data
    const completeFormData = {
      ...formData,
      consent: consentData,
      userId: user?.id, // Add user ID
      formType: 'immobilien',
      submittedAt: new Date().toISOString()
    };
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Submit form data using the forms API
      const response = await formsApi.saveImmobilienForm(completeFormData);
      
      if (response.success) {
        // Show success message
        alert(safeTranslate("form.success", "Form submitted successfully!"));
        
        // Redirect to forms page
        navigate("/client/forms");
      } else {
        // Show error message
        setError(response.message || safeTranslate("form.errors.submissionFailed", "Failed to submit form. Please try again."));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(safeTranslate("form.errors.submissionFailed", "Failed to submit form. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the current step form
  const renderStepForm = () => {
    const currentStepName = immobilienTemplate.required[currentStep];
    
    switch (currentStepName) {
      case 'personal':
        return (
          <PersonalDetailsForm 
            initialData={personalData}
            onComplete={handleNextStep}
            showPreviousButton={currentStep > 0}
            onPrevious={handlePreviousStep}
          />
        );
      case 'employment':
        return (
          <EmploymentDetailsForm 
            initialData={employmentData}
            onComplete={handleNextStep}
            showPreviousButton={currentStep > 0}
            onPrevious={handlePreviousStep}
          />
        );
      case 'income':
        return (
          <IncomeDetailsForm 
            initialData={incomeData}
            onComplete={handleNextStep}
            showPreviousButton={currentStep > 0}
            onPrevious={handlePreviousStep}
          />
        );
      case 'expenses':
        return (
          <ExpensesDetailsForm 
            initialData={expensesData}
            onComplete={handleNextStep}
            showPreviousButton={currentStep > 0}
            onPrevious={handlePreviousStep}
          />
        );
      case 'assets':
        return (
          <AssetsForm 
            initialData={assetsData}
            onComplete={handleNextStep}
            showPreviousButton={currentStep > 0}
            onPrevious={handlePreviousStep}
          />
        );
      case 'liabilities':
        return (
          <LiabilitiesForm 
            initialData={liabilitiesData}
            onComplete={handleNextStep}
            showPreviousButton={currentStep > 0}
            onPrevious={handlePreviousStep}
          />
        );
      case 'consent':
        return (
          <ConsentForm 
            onComplete={handleFormComplete}
            consentText={safeTranslate(immobilienTemplate.consent, "By providing your data, you agree to its use for the purpose of this application.")}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{safeTranslate("form.immobilien.description", "Immobilien Antrag")}</h1>
          <p className="text-muted-foreground">{safeTranslate("form.description", "Please fill out all required information")}</p>
        </div>
        
        {/* Progress bar and navigation */}
        <StepProgress 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          onStepClick={handleStepClick} 
        />
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Loading indicator */}
        {(loading || isSubmitting) ? (
          <div className="flex justify-center items-center p-8">
            <span className="text-lg">
              {isSubmitting 
                ? safeTranslate("form.submitting", "Submitting form...") 
                : safeTranslate("common.loading", "Loading...")}
            </span>
          </div>
        ) : (
          /* Form content */
          <Card>
            <CardContent className="p-6">
              {renderStepForm()}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ImmobilienForm; 