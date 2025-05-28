import React, { useState, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import SignatureCanvas from "../../../components/ui/SignatureCanvas";
import { 
  DownloadIcon, 
  MailIcon, 
  PenToolIcon 
} from "../components/Icons";
import { 
  getFieldLabel, 
  getFieldType, 
  getFieldOptions, 
  isLiabilityField 
} from "../utils/clientUtils";
import { exportFormAsPDF, previewFormAsPDF, emailForm } from "../utils/pdfExport";

const ClientForms = ({ 
  selectedClient,
  availableForms = [],
  loadingForms = false,
  onBackToClients,
  themeColor = "bg-teal-600",
  themeColorHover = "hover:bg-teal-700"
}) => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [signature, setSignature] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const formRef = useRef(null);

  // Debug logging
  console.log('ClientForms - selectedClient:', selectedClient);
  console.log('ClientForms - availableForms:', availableForms);
  console.log('ClientForms - selectedForm:', selectedForm);

  const handlePreviewPDF = async () => {
    if (!selectedForm || !selectedClient) return;
    
    try {
      await previewFormAsPDF(selectedForm, selectedClient, signature);
    } catch (error) {
      console.error('Error previewing PDF:', error);
      alert('Error previewing PDF. Please try again.');
    }
  };

  const handleExportPDF = async () => {
    if (!selectedForm || !selectedClient) return;
    
    setIsExporting(true);
    try {
      await exportFormAsPDF(selectedForm, selectedClient, signature, formRef);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailForm = async () => {
    if (!selectedForm || !selectedClient) return;
    
    try {
      await emailForm(selectedForm, selectedClient);
    } catch (error) {
      console.error('Error emailing form:', error);
      alert('Error creating email. Please try again.');
    }
  };

  const getClientFieldValue = (fieldName, clientData) => {
    if (!clientData) {
      console.log('No client data provided');
      return '';
    }
    
    // Field mapping for client data
    const fieldMapping = {
      // Personal Details
      'coachId': clientData.coachId,
      'coach_id': clientData.coachId,
      'firstName': clientData.firstName,
      'first_name': clientData.firstName,
      'lastName': clientData.lastName,
      'last_name': clientData.lastName,
      'email': clientData.email,
      'phone': clientData.phone,
      'streetAddress': clientData.streetAddress,
      'street_address': clientData.streetAddress,
      'address': clientData.streetAddress,
      'city': clientData.city,
      'postalCode': clientData.postalCode,
      'postal_code': clientData.postalCode,
      'zip': clientData.postalCode,
      'birthDate': clientData.birthDate,
      'birth_date': clientData.birthDate,
      'dateOfBirth': clientData.birthDate,
      'date_of_birth': clientData.birthDate,
      'birthPlace': clientData.birthPlace,
      'birth_place': clientData.birthPlace,
      'maritalStatus': clientData.maritalStatus,
      'marital_status': clientData.maritalStatus,
      'nationality': clientData.nationality,
      'housing': clientData.housing,
      
      // Employment Details
      'employmentType': clientData.employmentDetails?.[0]?.employmentType,
      'employment_type': clientData.employmentDetails?.[0]?.employmentType,
      'occupation': clientData.employmentDetails?.[0]?.occupation,
      'employerName': clientData.employmentDetails?.[0]?.employerName,
      'employer_name': clientData.employmentDetails?.[0]?.employerName,
      'company': clientData.employmentDetails?.[0]?.employerName,
      'contractType': clientData.employmentDetails?.[0]?.contractType,
      'contract_type': clientData.employmentDetails?.[0]?.contractType,
      'contractDuration': clientData.employmentDetails?.[0]?.contractDuration,
      'contract_duration': clientData.employmentDetails?.[0]?.contractDuration,
      'employedSince': clientData.employmentDetails?.[0]?.employedSince,
      'employed_since': clientData.employmentDetails?.[0]?.employedSince,
      
      // Income Details
      'grossIncome': clientData.incomeDetails?.[0]?.grossIncome,
      'gross_income': clientData.incomeDetails?.[0]?.grossIncome,
      'netIncome': clientData.incomeDetails?.[0]?.netIncome,
      'net_income': clientData.incomeDetails?.[0]?.netIncome,
      'income': clientData.incomeDetails?.[0]?.grossIncome || clientData.incomeDetails?.[0]?.netIncome,
      'taxClass': clientData.incomeDetails?.[0]?.taxClass,
      'tax_class': clientData.incomeDetails?.[0]?.taxClass,
      'numberOfSalaries': clientData.incomeDetails?.[0]?.numberOfSalaries,
      'number_of_salaries': clientData.incomeDetails?.[0]?.numberOfSalaries,
      'childBenefit': clientData.incomeDetails?.[0]?.childBenefit,
      'child_benefit': clientData.incomeDetails?.[0]?.childBenefit,
      
      // Expenses Details
      'coldRent': clientData.expensesDetails?.[0]?.coldRent,
      'cold_rent': clientData.expensesDetails?.[0]?.coldRent,
      'rent': clientData.expensesDetails?.[0]?.coldRent,
      'electricity': clientData.expensesDetails?.[0]?.electricity,
      'livingExpenses': clientData.expensesDetails?.[0]?.livingExpenses,
      'living_expenses': clientData.expensesDetails?.[0]?.livingExpenses,
      'gas': clientData.expensesDetails?.[0]?.gas,
      'telecommunication': clientData.expensesDetails?.[0]?.telecommunication,
      'subscriptions': clientData.expensesDetails?.[0]?.subscriptions,
      
      // Assets
      'realEstate': clientData.assets?.[0]?.realEstate,
      'real_estate': clientData.assets?.[0]?.realEstate,
      'securities': clientData.assets?.[0]?.securities,
      'bankDeposits': clientData.assets?.[0]?.bankDeposits,
      'bank_deposits': clientData.assets?.[0]?.bankDeposits,
      'buildingSavings': clientData.assets?.[0]?.buildingSavings,
      'building_savings': clientData.assets?.[0]?.buildingSavings,
      'insuranceValues': clientData.assets?.[0]?.insuranceValues,
      'insurance_values': clientData.assets?.[0]?.insuranceValues,
      'otherAssets': clientData.assets?.[0]?.otherAssets,
      'other_assets': clientData.assets?.[0]?.otherAssets,
      
      // Goals and Wishes
      'retirementPlanning': clientData.goalsAndWishes?.retirementPlanning,
      'retirement_planning': clientData.goalsAndWishes?.retirementPlanning,
      'capitalFormation': clientData.goalsAndWishes?.capitalFormation,
      'capital_formation': clientData.goalsAndWishes?.capitalFormation,
      'realEstateGoals': clientData.goalsAndWishes?.realEstateGoals,
      'real_estate_goals': clientData.goalsAndWishes?.realEstateGoals,
      'financing': clientData.goalsAndWishes?.financing,
      'protection': clientData.goalsAndWishes?.protection,
      'healthcareProvision': clientData.goalsAndWishes?.healthcareProvision,
      'healthcare_provision': clientData.goalsAndWishes?.healthcareProvision,
      'otherGoals': clientData.goalsAndWishes?.otherGoals,
      'other_goals': clientData.goalsAndWishes?.otherGoals,
      
      // Risk Appetite
      'riskAppetite': clientData.riskAppetite?.riskAppetite,
      'risk_appetite': clientData.riskAppetite?.riskAppetite,
      'investmentHorizon': clientData.riskAppetite?.investmentHorizon,
      'investment_horizon': clientData.riskAppetite?.investmentHorizon,
      'knowledgeExperience': clientData.riskAppetite?.knowledgeExperience,
      'knowledge_experience': clientData.riskAppetite?.knowledgeExperience,
      'healthInsurance': clientData.riskAppetite?.healthInsurance,
      'health_insurance': clientData.riskAppetite?.healthInsurance
    };
    
    // Try exact match first
    if (fieldMapping.hasOwnProperty(fieldName)) {
      const value = fieldMapping[fieldName] || '';
      if (value) console.log(`✓ ${fieldName}: ${value}`);
      return value;
    }
    
    // Try case-insensitive match
    const lowerFieldName = fieldName.toLowerCase();
    for (const [key, value] of Object.entries(fieldMapping)) {
      if (key.toLowerCase() === lowerFieldName) {
        const finalValue = value || '';
        if (finalValue) console.log(`✓ ${fieldName} (case-insensitive): ${finalValue}`);
        return finalValue;
      }
    }
    
    // Pattern matching for common field types
    if (fieldName.toLowerCase().includes('name')) {
      if (fieldName.toLowerCase().includes('first')) {
        const value = clientData.firstName || '';
        if (value) console.log(`✓ ${fieldName} (pattern - first name): ${value}`);
        return value;
      }
      if (fieldName.toLowerCase().includes('last')) {
        const value = clientData.lastName || '';
        if (value) console.log(`✓ ${fieldName} (pattern - last name): ${value}`);
        return value;
      }
      if (fieldName.toLowerCase().includes('full')) {
        const value = `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim();
        if (value) console.log(`✓ ${fieldName} (pattern - full name): ${value}`);
        return value;
      }
    }
    
    if (fieldName.toLowerCase().includes('address')) {
      const value = clientData.streetAddress || '';
      if (value) console.log(`✓ ${fieldName} (pattern - address): ${value}`);
      return value;
    }
    
    if (fieldName.toLowerCase().includes('date') && fieldName.toLowerCase().includes('birth')) {
      const value = clientData.birthDate || '';
      if (value) console.log(`✓ ${fieldName} (pattern - birth date): ${value}`);
      return value;
    }
    
    // No match found
    console.log(`✗ No value found for: ${fieldName}`);
    return '';
  };

  const renderLiabilityFields = (fieldName, clientData) => {
    const liabilities = clientData.liabilities || [];
    
    if (liabilities.length === 0) {
      return (
        <div className="text-sm text-muted-foreground italic">
          No liabilities data available
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {liabilities.map((liability, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="font-medium text-sm mb-3 text-gray-900 dark:text-gray-100">
              Liability {index + 1}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{liability.loanType || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Bank:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">{liability.loanBank || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {liability.loanAmount ? `€${Number(liability.loanAmount).toLocaleString()}` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Monthly Payment:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {liability.loanMonthlyRate ? `€${Number(liability.loanMonthlyRate).toLocaleString()}` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Interest Rate:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {liability.loanInterest ? `${liability.loanInterest}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFormField = (field, clientData) => {
    // Safety check for field object and field.name
    if (!field || !field.name) {
      console.warn('Invalid field object:', field);
      return (
        <div key={Math.random()} className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Invalid Field
          </label>
          <div className="text-sm text-red-500">
            Field configuration error
          </div>
        </div>
      );
    }

    const fieldType = getFieldType(field.name);
    const fieldLabel = getFieldLabel(field.name);
    const fieldValue = getClientFieldValue(field.name, clientData);
    const fieldOptions = getFieldOptions(field.name);
    
    // Special handling for liability fields
    if (isLiabilityField(field.name)) {
      return (
        <div key={field.name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            {fieldLabel}
          </label>
          {renderLiabilityFields(field.name, clientData)}
        </div>
      );
    }
    
    return (
      <div key={field.name} className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          {fieldLabel}
        </label>
        {fieldType === 'select' ? (
          <select
            value={fieldValue}
            readOnly
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">{fieldValue || 'Not specified'}</option>
            {fieldOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : fieldType === 'textarea' ? (
          <textarea
            value={fieldValue}
            readOnly
            rows={3}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            placeholder={`${fieldLabel} will be populated from client profile`}
          />
        ) : fieldType === 'checkbox' ? (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!!fieldValue}
              readOnly
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {fieldValue ? 'Yes' : 'No'}
            </span>
          </div>
        ) : (
          <input
            type={fieldType}
            value={fieldValue}
            readOnly
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder={`${fieldLabel} will be populated from client profile`}
          />
        )}
      </div>
    );
  };

  if (!selectedClient) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No client selected</p>
          <Button onClick={onBackToClients} className="mt-4">
            Back to Clients
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Forms for {selectedClient.firstName} {selectedClient.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage client forms with auto-populated data
            </p>
          </div>
          <Button onClick={onBackToClients} variant="outline">
            ← Back to Clients
          </Button>
        </div>

        {!selectedForm ? (
          /* Forms List */
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Available Forms</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingForms ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading forms...</p>
                </div>
              ) : availableForms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-lg font-medium mb-2">No forms available</p>
                  <p className="text-sm">Contact your administrator to create forms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableForms.map((form) => (
                    <Card 
                      key={form.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-teal-200"
                      onClick={() => setSelectedForm(form)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{form.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {form.description || 'No description available'}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Type: {form.formType}</span>
                          <span>v{form.version}</span>
                        </div>
                        <div className="mt-3">
                          <span className="inline-block px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                            {form.sections?.length || 0} sections
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Form Renderer */
          <div className="space-y-6">
            {/* Form Header */}
            <Card className="shadow-sm">
              <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{selectedForm.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedForm.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Type: {selectedForm.formType}</span>
                      <span>Version: {selectedForm.version}</span>
                      <span>Sections: {selectedForm.sections?.length || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setSelectedForm(null)} variant="outline">
                      ← Back to Forms
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Form Content */}
            <div ref={formRef} className="pdf-export-content">
              {selectedForm.sections?.map((section, sectionIndex) => {
                console.log(`Rendering section: ${section.title || section.sectionType} with ${section.showFields?.length || 0} fields`);
                console.log('Section data:', section);
                
                // Check if this is a consent section - be more flexible with detection
                const isConsentSection = section.sectionType === 'consent' || 
                                       section.type === 'consent' ||
                                       section.title?.toLowerCase().includes('consent') ||
                                       section.title?.toLowerCase().includes('privacy') ||
                                       section.title?.toLowerCase().includes('analytics') ||
                                       section.title?.toLowerCase().includes('cookies') ||
                                       section.name?.toLowerCase().includes('consent') ||
                                       section.name?.toLowerCase().includes('privacy') ||
                                       section.name?.toLowerCase().includes('analytics') ||
                                       section.name?.toLowerCase().includes('cookies');
                
                console.log(`Section "${section.title || section.name}" is consent section: ${isConsentSection}`);
                
                return (
                  <Card key={sectionIndex} className="shadow-sm mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                        {section.title || section.name || section.sectionType || `Section ${sectionIndex + 1}`}
                      </CardTitle>
                      {section.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {section.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 bg-white dark:bg-gray-900">
                      {isConsentSection ? (
                        /* Render Consent Section */
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
                              {section.title || section.name || 'Consent'}
                            </h4>
                            
                            {/* Render consent text */}
                            {section.consentText && (
                              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {typeof section.consentText === 'string' ? (
                                  <div className="whitespace-pre-wrap">{section.consentText}</div>
                                ) : (
                                  <p>{section.consentText}</p>
                                )}
                              </div>
                            )}
                            
                            {/* Render consent content if available */}
                            {section.content && (
                              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {typeof section.content === 'string' ? (
                                  <div className="whitespace-pre-wrap">{section.content}</div>
                                ) : (
                                  <p>{section.content}</p>
                                )}
                              </div>
                            )}
                            
                            {/* Render description as consent text if available */}
                            {section.description && !section.consentText && !section.content && (
                              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                <div className="whitespace-pre-wrap">{section.description}</div>
                              </div>
                            )}
                            
                            {/* Default consent text if none provided */}
                            {!section.consentText && !section.content && !section.description && (
                              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                <p>
                                  I hereby consent to the processing of my personal data as described in this section 
                                  for the purpose of financial advisory services. I understand that my data will 
                                  be handled in accordance with applicable data protection regulations.
                                </p>
                              </div>
                            )}
                            
                            {/* Consent checkbox */}
                            <div className="flex items-start space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <input
                                type="checkbox"
                                id={`consent-${sectionIndex}`}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
                                defaultChecked={section.required !== false}
                              />
                              <label htmlFor={`consent-${sectionIndex}`} className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                                {section.checkboxLabel || `I agree to the ${section.title || section.name || 'consent'} terms`}
                                {section.required !== false && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </label>
                            </div>
                            
                            {/* Show if this is required */}
                            {section.required !== false && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                This consent is required to proceed.
                              </div>
                            )}
                            
                            {/* Show if this is optional */}
                            {section.required === false && (
                              <div className="mt-2 text-xs text-blue-500 dark:text-blue-400">
                                This consent is optional.
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Render Regular Form Fields */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Array.isArray(section.showFields) && section.showFields.length > 0 ? (
                            section.showFields.filter(fieldName => fieldName && typeof fieldName === 'string').map((fieldName) => {
                              // Convert field name string to field object
                              const fieldObject = { name: fieldName };
                              return renderFormField(fieldObject, selectedClient);
                            })
                          ) : (
                            <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">
                              <p>No fields configured for this section</p>
                              <p className="text-sm mt-1">Section type: {section.sectionType || 'Unknown'}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Fallback Consent Sections - Always show these if no consent sections were found in form config */}
              {!selectedForm.sections?.some(section => 
                section.sectionType === 'consent' || 
                section.type === 'consent' ||
                section.title?.toLowerCase().includes('consent') ||
                section.title?.toLowerCase().includes('privacy') ||
                section.title?.toLowerCase().includes('analytics') ||
                section.title?.toLowerCase().includes('cookies') ||
                section.name?.toLowerCase().includes('consent') ||
                section.name?.toLowerCase().includes('privacy') ||
                section.name?.toLowerCase().includes('analytics') ||
                section.name?.toLowerCase().includes('cookies')
              ) && (
                <>
                  {/* Data Processing Consent */}
                  <Card className="shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                        Data Processing Consent
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white dark:bg-gray-900">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
                            Data Processing Consent
                          </h4>
                          
                          <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>
                              I hereby consent to the processing of my personal data as provided in this form 
                              for the purpose of financial advisory services. I understand that my data will 
                              be handled in accordance with applicable data protection regulations (GDPR).
                            </p>
                            <p className="mt-2">
                              This includes the collection, storage, processing, and analysis of my personal 
                              and financial information for the purpose of providing personalized financial 
                              advice and recommendations.
                            </p>
                          </div>
                          
                          <div className="flex items-start space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <input
                              type="checkbox"
                              id="data-processing-consent"
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
                              defaultChecked
                            />
                            <label htmlFor="data-processing-consent" className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                              I agree to the data processing terms
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            This consent is required to proceed.
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <br />  
                  {/* Privacy Policy Consent */}
                  <Card className="shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                        Privacy Policy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white dark:bg-gray-900">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
                            Privacy Policy Acknowledgment
                          </h4>
                          
                          <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>
                              I acknowledge that I have read and understood the Privacy Policy of YourWealth.Coach. 
                              I understand how my personal information will be collected, used, stored, and protected.
                            </p>
                            <p className="mt-2">
                              I understand my rights regarding my personal data, including the right to access, 
                              rectify, erase, restrict processing, and data portability as outlined in the Privacy Policy.
                            </p>
                          </div>
                          
                          <div className="flex items-start space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <input
                              type="checkbox"
                              id="privacy-policy-consent"
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
                              defaultChecked
                            />
                            <label htmlFor="privacy-policy-consent" className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                              I acknowledge and agree to the Privacy Policy
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            This consent is required to proceed.
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

              {/* Digital Signature Section */}
              <Card className="shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="bg-teal-50 dark:bg-teal-900/20 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                    Digital Signature
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white dark:bg-gray-900">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Digital Signature</h4>
                      <SignatureCanvas
                        onSignatureChange={setSignature}
                        clearButtonText="Clear Signature"
                      />
                      {signature && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Signature captured successfully
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p>Form completed on: {new Date().toLocaleDateString()}</p>
                      <p>Client: {selectedClient.firstName} {selectedClient.lastName}</p>
                      <p>Email: {selectedClient.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              

            {/* Action Buttons at Bottom */}
            <Card className="shadow-sm mt-6">
              <CardContent className="p-4">
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handlePreviewPDF}
                    variant="outline"
                    className="border-teal-500 text-teal-600 hover:bg-teal-50"
                  >
                    <DownloadIcon className="mr-2" />
                    Preview PDF
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className={`${themeColor} ${themeColorHover} text-white`}
                  >
                    {isExporting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <DownloadIcon className="mr-2" />
                    )}
                    {isExporting ? 'Exporting...' : 'Export PDF'}
                  </Button>
                  <Button onClick={handleEmailForm} variant="outline">
                    <MailIcon className="mr-2" />
                    Email Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
};

export default ClientForms; 