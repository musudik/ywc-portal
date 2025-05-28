import React from "react";
import { useTranslation } from "react-i18next";

const StepProgress = ({ currentStep, totalSteps, onStepClick, isEditMode = false, clientName = "" }) => {
  const { t } = useTranslation();
  const steps = [
    { key: 'personal', label: 'Personal Details' },
    { key: 'employment', label: 'Employment' },
    { key: 'income', label: 'Income' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'assets', label: 'Assets' },
    { key: 'liabilities', label: 'Liabilities' },
    { key: 'goals', label: 'Goals & Wishes' },
    { key: 'risk', label: 'Risk Profile' }
  ];

  const percentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {isEditMode ? `Edit Client Profile${clientName ? ` - ${clientName}` : ""}` : "Client Profile Setup"}
          </h2>
          {isEditMode && (
            <p className="text-sm text-muted-foreground mt-1">
              Update client information across all profile sections
            </p>
          )}
        </div>
        <span className="text-sm px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium">
          Step {currentStep + 1} of {totalSteps} ({percentage}% Complete)
        </span>
      </div>
      <div className="flex w-full h-2 bg-gray-200 dark:bg-black rounded-full overflow-hidden mb-6">
        <div
          className="bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <button 
              key={step.key} 
              onClick={() => onStepClick(index)}
              className={`
                py-3 px-2 rounded-md text-center transition-all duration-200 flex flex-col items-center justify-center
                ${isCurrent 
                  ? 'bg-blue-600 text-white' 
                  : isCompleted 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-black dark:text-gray-300'
                } cursor-pointer
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

export default StepProgress; 