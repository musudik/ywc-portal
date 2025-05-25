import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { createSafeTranslate } from "../../../../utils/translationUtils";

// Predefined fields for each section type
const SECTION_FIELDS = {
  Personal: [
    { name: 'coachId', type: 'text', required: true, label: 'Coach ID' },
    { name: 'applicantType', type: 'select', required: true, label: 'Applicant Type', options: ['PrimaryApplicant', 'SecondaryApplicant'] },
    { name: 'firstName', type: 'text', required: true, label: 'First Name' },
    { name: 'lastName', type: 'text', required: true, label: 'Last Name' },
    { name: 'streetAddress', type: 'text', required: true, label: 'Street Address' },
    { name: 'postalCode', type: 'text', required: true, label: 'Postal Code' },
    { name: 'city', type: 'text', required: true, label: 'City' },
    { name: 'phone', type: 'tel', required: true, label: 'Phone' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'birthDate', type: 'date', required: true, label: 'Birth Date' },
    { name: 'birthPlace', type: 'text', required: true, label: 'Birth Place' },
    { name: 'maritalStatus', type: 'select', required: true, label: 'Marital Status', options: ['single', 'married', 'divorced', 'widowed'] },
    { name: 'nationality', type: 'text', required: true, label: 'Nationality' },
    { name: 'housing', type: 'select', required: true, label: 'Housing', options: ['owned', 'rented', 'livingWithParents', 'other'] }
  ],
  Family: [
    { name: 'hasSpouse', type: 'checkbox', required: false, label: 'Has Spouse/Partner' },
    { name: 'spouseFirstName', type: 'text', required: false, label: 'Spouse First Name' },
    { name: 'spouseLastName', type: 'text', required: false, label: 'Spouse Last Name' },
    { name: 'spouseBirthDate', type: 'date', required: false, label: 'Spouse Birth Date' },
    { name: 'spouseOccupation', type: 'text', required: false, label: 'Spouse Occupation' },
    { name: 'spouseIncome', type: 'number', required: false, label: 'Spouse Income' },
    { name: 'numberOfChildren', type: 'number', required: false, label: 'Number of Children' },
    { name: 'children', type: 'array', required: false, label: 'Children Details' },
    { name: 'dependents', type: 'number', required: false, label: 'Number of Dependents' },
    { name: 'familyInsurance', type: 'text', required: false, label: 'Family Insurance' }
  ],
  Employment: [
    { name: 'employmentType', type: 'select', required: true, label: 'Employment Type', options: ['Employed', 'SelfEmployed', 'Unemployed', 'Retired', 'Student', 'Other'] },
    { name: 'occupation', type: 'text', required: true, label: 'Occupation/Job Title' },
    { name: 'contractType', type: 'select', required: false, label: 'Contract Type', options: ['permanent', 'temporary', 'partTime', 'fullTime', 'freelance', 'other'] },
    { name: 'contractDuration', type: 'text', required: false, label: 'Contract Duration' },
    { name: 'employerName', type: 'text', required: false, label: 'Employer Name' },
    { name: 'employedSince', type: 'date', required: false, label: 'Employed Since' }
  ],
  Income: [
    { name: 'grossIncome', type: 'number', required: true, label: 'Monthly Gross Income' },
    { name: 'netIncome', type: 'number', required: true, label: 'Monthly Net Income' },
    { name: 'taxClass', type: 'select', required: true, label: 'Tax Class', options: ['1', '2', '3', '4', '5', '6'] },
    { name: 'taxId', type: 'text', required: false, label: 'Tax ID' },
    { name: 'numberOfSalaries', type: 'select', required: true, label: 'Number of Salaries per Year', options: ['12', '13', '14'] },
    { name: 'childBenefit', type: 'number', required: false, label: 'Child Benefit' },
    { name: 'otherIncome', type: 'number', required: false, label: 'Other Income' },
    { name: 'incomeTradeBusiness', type: 'number', required: false, label: 'Income from Trade/Business' },
    { name: 'incomeSelfEmployedWork', type: 'number', required: false, label: 'Income from Self-Employed Work' },
    { name: 'incomeSideJob', type: 'number', required: false, label: 'Income from Side Job' }
  ],
  Expenses: [
    { name: 'coldRent', type: 'number', required: false, label: 'Rent (excl. utilities)' },
    { name: 'electricity', type: 'number', required: false, label: 'Electricity' },
    { name: 'livingExpenses', type: 'number', required: false, label: 'Living Expenses (Food, etc.)' },
    { name: 'gas', type: 'number', required: false, label: 'Gas/Heating' },
    { name: 'telecommunication', type: 'number', required: false, label: 'Phone/Internet' },
    { name: 'accountMaintenanceFee', type: 'number', required: false, label: 'Bank Fees' },
    { name: 'alimony', type: 'number', required: false, label: 'Alimony/Child Support' },
    { name: 'subscriptions', type: 'number', required: false, label: 'Subscriptions' },
    { name: 'otherExpenses', type: 'number', required: false, label: 'Other Expenses' }
  ],
  Assets: [
    { name: 'realEstate', type: 'number', required: false, label: 'Real Estate Value' },
    { name: 'securities', type: 'number', required: false, label: 'Securities (Stocks, Bonds, etc.)' },
    { name: 'bankDeposits', type: 'number', required: false, label: 'Bank Deposits' },
    { name: 'buildingSavings', type: 'number', required: false, label: 'Building Savings' },
    { name: 'insuranceValues', type: 'number', required: false, label: 'Insurance Values' },
    { name: 'otherAssets', type: 'number', required: false, label: 'Other Assets' }
  ],
  Liabilities: [
    { name: 'loanType', type: 'select', required: true, label: 'Loan Type', options: ['PersonalLoan', 'HomeLoan', 'CarLoan', 'BusinessLoan', 'EducationLoan', 'OtherLoan'] },
    { name: 'loanBank', type: 'text', required: true, label: 'Bank/Lender' },
    { name: 'loanAmount', type: 'number', required: true, label: 'Loan Amount' },
    { name: 'loanMonthlyRate', type: 'number', required: true, label: 'Monthly Payment' },
    { name: 'loanInterest', type: 'number', required: true, label: 'Interest Rate' }
  ],
  Documents: [
    { name: 'documents', type: 'file', required: false, label: 'Document Upload' }
  ]
};

const SectionConfiguration = ({ sections, onUpdate, availableSectionTypes }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [expandedSections, setExpandedSections] = useState({});

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      sectionType: "",
      showFields: [],
      hideFields: [],
      order: sections.length
    };
    onUpdate([...sections, newSection]);
  };

  const removeSection = (sectionId) => {
    onUpdate(sections.filter(section => section.id !== sectionId));
  };

  const updateSection = (sectionId, field, value) => {
    onUpdate(sections.map(section => 
      section.id === sectionId 
        ? { ...section, [field]: value }
        : section
    ));
  };

  const updateSectionType = (sectionId, sectionType) => {
    const availableFields = SECTION_FIELDS[sectionType] || [];
    const fieldNames = availableFields.map(field => field.name);
    
    onUpdate(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            sectionType,
            showFields: fieldNames, // By default, show all fields
            hideFields: [] // No hidden fields by default
          }
        : section
    ));
  };

  const toggleSectionExpanded = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getAvailableFields = (sectionType) => {
    return SECTION_FIELDS[sectionType] || [];
  };

  const handleFieldSelection = (sectionId, fieldName, isShow) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    let newShowFields = [...section.showFields];
    let newHideFields = [...section.hideFields];

    if (isShow) {
      // Adding to show fields
      if (!newShowFields.includes(fieldName)) {
        newShowFields.push(fieldName);
      }
      // Remove from hide fields if present
      newHideFields = newHideFields.filter(f => f !== fieldName);
    } else {
      // Adding to hide fields
      if (!newHideFields.includes(fieldName)) {
        newHideFields.push(fieldName);
      }
      // Remove from show fields
      newShowFields = newShowFields.filter(f => f !== fieldName);
    }

    updateSection(sectionId, 'showFields', newShowFields);
    updateSection(sectionId, 'hideFields', newHideFields);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-background">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {safeTranslate('admin.formConfig.sections.title', 'Form Sections')}
          </CardTitle>
          <Button onClick={addSection} size="sm" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 bg-background">
        {sections.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <div className="max-w-sm mx-auto">
              <h3 className="text-lg font-medium mb-2">No sections configured yet</h3>
              <p className="text-sm">Add a section to get started with your form configuration.</p>
            </div>
          </div>
        )}

        {sections.map((section) => {
          const availableFields = getAvailableFields(section.sectionType);
          const isExpanded = expandedSections[section.id];
          
          return (
            <div key={section.id} className="border border-border rounded-lg bg-card shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Section Type *</label>
                      <select
                        value={section.sectionType}
                        onChange={(e) => updateSectionType(section.id, e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      >
                        <option value="">Select section type...</option>
                        {availableSectionTypes
                          .filter(type => !sections.some(s => s.sectionType === type && s.id !== section.id))
                          .map(type => (
                            <option key={type} value={type}>
                              {safeTranslate(`admin.formConfig.sectionTypes.${type}`, type)}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {section.sectionType && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSectionExpanded(section.id)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {section.sectionType && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Show Fields */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-green-700 dark:text-green-400">
                            Fields to Show
                          </label>
                          <span className="text-xs text-muted-foreground bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            {section.showFields.length} selected
                          </span>
                        </div>
                        <div className="border border-green-200 dark:border-green-800 rounded-md p-3 max-h-48 overflow-y-auto bg-green-50/50 dark:bg-green-950/20">
                          <div className="space-y-2">
                            {availableFields.map(field => (
                              <label key={field.name} className="flex items-start space-x-3 py-1 cursor-pointer hover:bg-green-100/50 dark:hover:bg-green-900/20 rounded px-2 -mx-2">
                                <input
                                  type="checkbox"
                                  checked={section.showFields.includes(field.name)}
                                  onChange={(e) => handleFieldSelection(section.id, field.name, e.target.checked)}
                                  className="mt-0.5 rounded border-green-300 text-green-600 focus:ring-green-500"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {field.type}
                                    {field.options && ` • ${field.options.length} options`}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Hide Fields */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-red-700 dark:text-red-400">
                            Fields to Hide
                          </label>
                          <span className="text-xs text-muted-foreground bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full">
                            {section.hideFields.length} hidden
                          </span>
                        </div>
                        <div className="border border-red-200 dark:border-red-800 rounded-md p-3 max-h-48 overflow-y-auto bg-red-50/50 dark:bg-red-950/20">
                          <div className="space-y-2">
                            {availableFields.map(field => (
                              <label key={field.name} className="flex items-start space-x-3 py-1 cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-900/20 rounded px-2 -mx-2">
                                <input
                                  type="checkbox"
                                  checked={section.hideFields.includes(field.name)}
                                  onChange={(e) => handleFieldSelection(section.id, field.name, !e.target.checked)}
                                  className="mt-0.5 rounded border-red-300 text-red-600 focus:ring-red-500"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {field.type}
                                    {field.options && ` • ${field.options.length} options`}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Field Summary */}
                    <div className="mt-4 bg-muted/50 p-4 rounded-md border">
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">Configuration Summary</span>
                          <span className="text-xs text-muted-foreground">
                            {availableFields.length} total fields
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>{section.showFields.length} fields will be shown</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>{section.hideFields.length} fields will be hidden</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SectionConfiguration; 