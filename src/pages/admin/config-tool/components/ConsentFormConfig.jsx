import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Plus, Trash2, Eye, Shield, FileText } from "lucide-react";
import { createSafeTranslate } from "../../../../utils/translationUtils";

// Common consent sections that can be added
const CONSENT_SECTIONS = [
  {
    id: 'dataProcessing',
    title: 'Data Processing Consent',
    description: 'Consent for processing personal data',
    defaultText: 'I consent to the processing of my personal data for the purposes outlined in this form.',
    required: true
  },
  {
    id: 'marketing',
    title: 'Marketing Communications',
    description: 'Consent for marketing communications',
    defaultText: 'I consent to receive marketing communications and promotional materials.',
    required: false
  },
  {
    id: 'thirdParty',
    title: 'Third Party Sharing',
    description: 'Consent for sharing data with third parties',
    defaultText: 'I consent to sharing my data with trusted third-party partners for service delivery.',
    required: false
  },
  {
    id: 'analytics',
    title: 'Analytics & Cookies',
    description: 'Consent for analytics and cookie usage',
    defaultText: 'I consent to the use of cookies and analytics tools to improve service quality.',
    required: false
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    description: 'Agreement to terms and conditions',
    defaultText: 'I have read and agree to the Terms and Conditions.',
    required: true
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    description: 'Acknowledgment of privacy policy',
    defaultText: 'I have read and understand the Privacy Policy.',
    required: true
  }
];

const ConsentFormConfig = ({ consentForm, onUpdate }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [showPreview, setShowPreview] = useState(false);
  const [newSection, setNewSection] = useState({
    id: '',
    title: '',
    description: '',
    text: '',
    required: false
  });

  const updateConsentForm = (field, value) => {
    onUpdate({
      ...consentForm,
      [field]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const addConsentSection = (sectionTemplate = null) => {
    const section = sectionTemplate || {
      ...newSection,
      id: newSection.id || `custom_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (!section.title.trim()) {
      alert('Section title is required');
      return;
    }

    // Check for duplicate section IDs
    if (consentForm.sections?.some(s => s.id === section.id)) {
      alert('Section ID must be unique');
      return;
    }

    const updatedSections = [...(consentForm.sections || []), section];
    updateConsentForm('sections', updatedSections);
    
    if (!sectionTemplate) {
      resetNewSection();
    }
  };

  const removeConsentSection = (sectionId) => {
    const updatedSections = consentForm.sections?.filter(s => s.id !== sectionId) || [];
    updateConsentForm('sections', updatedSections);
  };

  const updateConsentSection = (sectionId, field, value) => {
    const updatedSections = consentForm.sections?.map(section =>
      section.id === sectionId
        ? { ...section, [field]: value, updatedAt: new Date().toISOString() }
        : section
    ) || [];
    updateConsentForm('sections', updatedSections);
  };

  const resetNewSection = () => {
    setNewSection({
      id: '',
      title: '',
      description: '',
      text: '',
      required: false
    });
  };

  const updateNewSection = (field, value) => {
    setNewSection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPredefinedSection = (template) => {
    addConsentSection({
      ...template,
      text: template.defaultText,
      createdAt: new Date().toISOString()
    });
  };

  const getAvailablePredefinedSections = () => {
    const existingIds = consentForm.sections?.map(s => s.id) || [];
    return CONSENT_SECTIONS.filter(section => !existingIds.includes(section.id));
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-background border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {safeTranslate('admin.formConfig.consent.title', 'Consent Form Configuration')}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 bg-background">
        {/* Enable/Disable Consent Form */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
          <div>
            <h3 className="text-lg font-medium text-foreground">Enable Consent Form</h3>
            <p className="text-sm text-muted-foreground">Include consent form in the submission process</p>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={consentForm.enabled}
              onChange={(e) => updateConsentForm('enabled', e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary scale-125"
            />
            <span className="text-sm font-medium text-foreground">
              {consentForm.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {consentForm.enabled && (
          <>
            {/* Introduction Text */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Introduction Text</h3>
              <textarea
                value={consentForm.introText || ''}
                onChange={(e) => updateConsentForm('introText', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="Enter introduction text that will appear at the top of the consent form..."
              />
            </div>

            {/* Quick Add Predefined Sections */}
            {getAvailablePredefinedSections().length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Quick Add Common Consent Sections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getAvailablePredefinedSections().map((section) => (
                    <div key={section.id} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground mb-1">{section.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{section.description}</p>
                          <p className="text-xs text-muted-foreground italic">"{section.defaultText}"</p>
                          {section.required && (
                            <span className="inline-block mt-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                              Required
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addPredefinedSection(section)}
                          className="ml-3 shrink-0"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Custom Section */}
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Add Custom Consent Section</h3>
                <span className="text-xs text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  Custom Section
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Section ID *</label>
                    <Input
                      value={newSection.id}
                      onChange={(e) => updateNewSection('id', e.target.value)}
                      placeholder="e.g., customConsent1"
                      className="focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Section Title *</label>
                    <Input
                      value={newSection.title}
                      onChange={(e) => updateNewSection('title', e.target.value)}
                      placeholder="e.g., Custom Consent"
                      className="focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Input
                    value={newSection.description}
                    onChange={(e) => updateNewSection('description', e.target.value)}
                    placeholder="Brief description of this consent section"
                    className="focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Consent Text *</label>
                  <textarea
                    value={newSection.text}
                    onChange={(e) => updateNewSection('text', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Enter the consent text that users will agree to..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Required</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={newSection.required}
                      onChange={(e) => updateNewSection('required', e.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">This consent is required for form submission</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-blue-200 dark:border-blue-800">
                <Button variant="outline" onClick={resetNewSection}>
                  Reset
                </Button>
                <Button onClick={() => addConsentSection()} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>

            {/* Existing Consent Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  Consent Sections
                </h3>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {consentForm.sections?.length || 0} section{(consentForm.sections?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
              
              {(!consentForm.sections || consentForm.sections.length === 0) && (
                <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <div className="max-w-sm mx-auto">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h4 className="text-lg font-medium mb-2">No consent sections configured yet</h4>
                    <p className="text-sm">Add consent sections above to create a comprehensive consent form.</p>
                  </div>
                </div>
              )}

              {consentForm.sections?.map((section) => (
                <div key={section.id} className="border border-border rounded-lg bg-card shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-medium text-foreground">{section.title}</h4>
                        {section.required ? (
                          <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                            Required
                          </span>
                        ) : (
                          <span className="bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs font-medium">
                            Optional
                          </span>
                        )}
                      </div>
                      {section.description && (
                        <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                      )}
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm text-foreground">{section.text}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 shrink-0 ml-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={section.required}
                          onChange={(e) => updateConsentSection(section.id, 'required', e.target.checked)}
                          className="rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="text-xs text-muted-foreground">Required</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeConsentSection(section.id)}
                        className="h-8"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Edit section text */}
                  <div className="border-t border-border pt-4">
                    <label className="text-xs font-medium text-foreground mb-2 block">Edit Consent Text:</label>
                    <textarea
                      value={section.text}
                      onChange={(e) => updateConsentSection(section.id, 'text', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Consent Form Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border">
              <div className="flex items-center justify-between p-6 border-b bg-card">
                <h2 className="text-xl font-semibold text-foreground">Consent Form Preview</h2>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-background">
                <div className="space-y-6">
                  {consentForm.introText && (
                    <div className="bg-card p-4 rounded-lg border">
                      <p className="text-sm text-foreground">{consentForm.introText}</p>
                    </div>
                  )}
                  
                  {consentForm.sections?.map((section) => (
                    <div key={section.id} className="bg-card p-4 rounded-lg border">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-input text-primary focus:ring-primary"
                          disabled
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">
                            {section.title}
                            {section.required && <span className="text-red-500 ml-1">*</span>}
                          </h4>
                          <p className="text-sm text-muted-foreground">{section.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!consentForm.sections || consentForm.sections.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No consent sections configured</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsentFormConfig; 