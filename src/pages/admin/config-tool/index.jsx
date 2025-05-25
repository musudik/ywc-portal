import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Plus, Trash2, Save, Eye, Copy } from "lucide-react";
import DashboardLayout from "../../../components/dashboard/layout";
import { createSafeTranslate } from "../../../utils/translationUtils";
import { formConfigApi } from "../../../api/formConfig";

// Import the components
import SectionConfiguration from "./components/SectionConfiguration";
import CustomFieldManager from "./components/CustomFieldManager";
import ConsentFormConfig from "./components/ConsentFormConfig";
import DocumentsManager from "./components/DocumentsManager";

// Constants
const FORM_TYPES = [
  "immobilien", 
  "privateHealthInsurance", 
  "stateHealthInsurance", 
  "kfz", 
  "loans", 
  "electricity", 
  "sanuspay", 
  "gems"
];

const SECTION_TYPES = [
  "Personal", 
  "Family", 
  "Employment", 
  "Income", 
  "Expenses", 
  "Assets", 
  "Liabilities", 
  "Documents"
];

const FormConfigTool = () => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  
  // Form state
  const [formConfig, setFormConfig] = useState({
    name: "",
    formType: "",
    version: "1.0",
    description: "",
    sections: [],
    customFields: [],
    consentForm: {
      enabled: true,
      introText: "",
      sections: []
    },
    documents: [],
    isActive: true,
    createdAt: null,
    updatedAt: null
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [showConfigList, setShowConfigList] = useState(true);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Load existing configurations on mount
  useEffect(() => {
    loadSavedConfigurations();
  }, []);

  const loadSavedConfigurations = async () => {
    try {
      const response = await formConfigApi.getAllConfigurations();
      setSavedConfigs(response.data || []);
    } catch (err) {
      console.error("Failed to load saved configurations:", err);
      setError("Failed to load saved configurations");
    }
  };

  const handleBasicInfoChange = (field, value) => {
    setFormConfig(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSectionsUpdate = (sections) => {
    setFormConfig(prev => ({
      ...prev,
      sections,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleCustomFieldsUpdate = (customFields) => {
    setFormConfig(prev => ({
      ...prev,
      customFields,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleConsentFormUpdate = (consentForm) => {
    setFormConfig(prev => ({
      ...prev,
      consentForm,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleDocumentsUpdate = (documents) => {
    setFormConfig(prev => ({
      ...prev,
      documents,
      updatedAt: new Date().toISOString()
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formConfig.name.trim()) {
      errors.push("Form name is required");
    }
    
    if (!formConfig.formType) {
      errors.push("Form type is required");
    }
    
    if (formConfig.sections.length === 0) {
      errors.push("At least one section is required");
    }
    
    if (!formConfig.version.trim()) {
      errors.push("Version is required");
    }
    
    return errors;
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(", "));
        return;
      }

      const configToSave = {
        ...formConfig,
        // Remove UI-only fields that shouldn't be sent to the backend
        createdAt: undefined,
        updatedAt: undefined
      };

      const savedConfig = await formConfigApi.saveConfiguration(configToSave);
      
      // Update the form config with the saved data (including ID for updates)
      setFormConfig(savedConfig);
      
      setSuccess("Form configuration saved successfully!");
      loadSavedConfigurations();
    } catch (err) {
      console.error("Failed to save form configuration:", err);
      setError(err.message || "Failed to save form configuration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewConfig = () => {
    setFormConfig({
      name: "",
      formType: "",
      version: "1.0",
      description: "",
      sections: [],
      customFields: [],
      consentForm: {
        enabled: true,
        introText: "",
        sections: []
      },
      documents: [],
      isActive: true,
      createdAt: null,
      updatedAt: null
    });
    setSelectedConfigId(null);
    setShowConfigList(false);
    setSuccess("Started new configuration");
  };

  const handleSelectConfig = async (config) => {
    try {
      setLoading(true);
      const fullConfig = await formConfigApi.getConfigurationById(config.id);
      setFormConfig(fullConfig);
      setSelectedConfigId(config.id);
      setShowConfigList(false);
      setSuccess(`Loaded configuration: ${config.name}`);
    } catch (err) {
      console.error("Failed to load configuration:", err);
      setError("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyConfig = async (config) => {
    try {
      setLoading(true);
      const duplicatedConfig = await formConfigApi.duplicateConfiguration(config.id, {
        name: `${config.name} (Copy)`,
        version: "1.0"
      });
      setSuccess(`Configuration copied: ${duplicatedConfig.name}`);
      loadSavedConfigurations();
    } catch (err) {
      console.error("Failed to copy configuration:", err);
      setError("Failed to copy configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfig = async (config) => {
    if (!window.confirm(`Are you sure you want to delete "${config.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await formConfigApi.deleteConfiguration(config.id);
      setSuccess(`Configuration deleted: ${config.name}`);
      loadSavedConfigurations();
      
      // If the deleted config was currently selected, clear the form
      if (selectedConfigId === config.id) {
        handleNewConfig();
      }
    } catch (err) {
      console.error("Failed to delete configuration:", err);
      setError("Failed to delete configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (config) => {
    try {
      setLoading(true);
      const updatedConfig = await formConfigApi.toggleConfigurationStatus(config.id);
      setSuccess(`Configuration ${updatedConfig.isActive ? 'activated' : 'deactivated'}: ${config.name}`);
      loadSavedConfigurations();
      
      // If the toggled config is currently selected, update the form
      if (selectedConfigId === config.id) {
        setFormConfig(prev => ({ ...prev, isActive: updatedConfig.isActive }));
      }
    } catch (err) {
      console.error("Failed to toggle configuration status:", err);
      setError("Failed to toggle configuration status");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setShowConfigList(true);
    setSelectedConfigId(null);
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(formConfig, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `form-config-${formConfig.name || 'untitled'}-${formConfig.version || '1.0'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filter configurations based on search and filters
  const filteredConfigs = savedConfigs.filter(config => {
    const matchesSearch = !searchTerm || 
      config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || config.formType === filterType;
    
    const matchesStatus = !filterStatus || 
      (filterStatus === "active" && config.isActive) ||
      (filterStatus === "inactive" && !config.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-foreground">
              {safeTranslate('admin.formConfig.title', 'Form Configuration Tool')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {safeTranslate('admin.formConfig.description', 'Configure custom forms for coaches and clients')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {!showConfigList && (
              <Button variant="outline" onClick={handleBackToList} size="sm">
                ← Back to List
              </Button>
            )}
            <Button variant="outline" onClick={handleNewConfig} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            {!showConfigList && (
              <>
                <Button variant="outline" onClick={handleExportConfig} disabled={!formConfig.name} size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(true)} size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSave} disabled={loading} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              {error}
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              {success}
            </div>
          </div>
        )}

        {/* Configuration List View */}
        {showConfigList && (
          <Card className="shadow-sm">
            <CardHeader className="bg-background border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg font-semibold">
                  Existing Form Configurations ({filteredConfigs.length})
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Input
                    placeholder="Search configurations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Types</option>
                    {FORM_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredConfigs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-lg font-medium mb-2">No configurations found</p>
                  <p className="text-sm">
                    {savedConfigs.length === 0 
                      ? "Create your first form configuration to get started"
                      : "Try adjusting your search or filter criteria"
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredConfigs.map((config) => (
                    <div key={config.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleSelectConfig(config)}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground truncate">{config.name}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span className="capitalize">{config.formType}</span>
                                <span>v{config.version}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  config.isActive 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                }`}>
                                  {config.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span>Updated {new Date(config.updatedAt).toLocaleDateString()}</span>
                              </div>
                              {config.description && (
                                <p className="text-sm text-muted-foreground mt-1 truncate">{config.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectConfig(config);
                            }}
                            className="text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyConfig(config);
                            }}
                            className="text-xs"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(config);
                            }}
                            className={`text-xs ${config.isActive ? 'text-orange-600' : 'text-green-600'}`}
                          >
                            {config.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConfig(config);
                            }}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Form Configuration Editor */}
        {!showConfigList && (
          <>
        {/* Basic Information */}
        <Card className="shadow-sm">
          <CardHeader className="bg-background border-b">
            <CardTitle className="text-lg font-semibold">
              {safeTranslate('admin.formConfig.basicInfo.title', 'Basic Information')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {safeTranslate('admin.formConfig.basicInfo.name', 'Form Name')} *
                </label>
                <Input
                  value={formConfig.name}
                  onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                  placeholder="e.g., immobilien2025"
                  className="focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {safeTranslate('admin.formConfig.basicInfo.type', 'Form Type')} *
                </label>
                <select
                  value={formConfig.formType}
                  onChange={(e) => handleBasicInfoChange('formType', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select form type...</option>
                  {FORM_TYPES.map(type => (
                    <option key={type} value={type}>
                      {safeTranslate(`admin.formConfig.formTypes.${type}`, type)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {safeTranslate('admin.formConfig.basicInfo.version', 'Version')} *
                </label>
                <Input
                  value={formConfig.version}
                  onChange={(e) => handleBasicInfoChange('version', e.target.value)}
                  placeholder="1.0"
                  className="focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {safeTranslate('admin.formConfig.basicInfo.status', 'Status')}
                </label>
                <select
                  value={formConfig.isActive}
                  onChange={(e) => handleBasicInfoChange('isActive', e.target.value === 'true')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {safeTranslate('admin.formConfig.basicInfo.description', 'Description')}
              </label>
              <textarea
                value={formConfig.description}
                onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="Describe the purpose of this form..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Sections */}
        <SectionConfiguration
          sections={formConfig.sections}
          onUpdate={handleSectionsUpdate}
          availableSectionTypes={SECTION_TYPES}
        />

        {/* Custom Fields */}
        <CustomFieldManager
          customFields={formConfig.customFields}
          onUpdate={handleCustomFieldsUpdate}
        />

        {/* Consent Form */}
        <ConsentFormConfig
          consentForm={formConfig.consentForm}
          onUpdate={handleConsentFormUpdate}
        />

        {/* Document Requirements */}
        <DocumentsManager
          documents={formConfig.documents}
          onUpdate={handleDocumentsUpdate}
        />
        </>
        )}

        {/* Form Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border">
              <div className="flex items-center justify-between p-6 border-b bg-card">
                <h2 className="text-xl font-semibold text-foreground">Form Preview</h2>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-background">
                <div className="space-y-6">
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground">{formConfig.name || 'Untitled Form'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{formConfig.description}</p>
                  </div>
                  
                  {formConfig.sections.length > 0 && (
                    <div className="bg-card p-4 rounded-lg border">
                      <h4 className="font-medium mb-3 text-foreground">Configured Sections:</h4>
                      <div className="grid gap-2">
                        {formConfig.sections.map((section, index) => (
                          <div key={section.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <span className="font-medium">{section.sectionType}</span>
                            <span className="text-muted-foreground">{section.showFields.length} fields</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formConfig.customFields.length > 0 && (
                    <div className="bg-card p-4 rounded-lg border">
                      <h4 className="font-medium mb-3 text-foreground">Custom Fields:</h4>
                      <div className="grid gap-2">
                        {formConfig.customFields.map((field, index) => (
                          <div key={field.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <span className="font-medium">{field.label}</span>
                            <span className="text-muted-foreground">{field.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formConfig.consentForm.enabled && (
                    <div className="bg-card p-4 rounded-lg border">
                      <h4 className="font-medium mb-3 text-foreground">Consent Form:</h4>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Status: <span className="font-medium text-green-600">Enabled</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Sections: <span className="font-medium">{formConfig.consentForm.sections?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {formConfig.documents.length > 0 && (
                    <div className="bg-card p-4 rounded-lg border">
                      <h4 className="font-medium mb-3 text-foreground">Required Documents:</h4>
                      <div className="grid gap-2">
                        {formConfig.documents.map((document, index) => (
                          <div key={document.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <span className="font-medium">{document.name}</span>
                            <span className="text-muted-foreground">
                              {document.required ? 'Required' : 'Optional'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-muted/30 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <h4 className="font-medium mb-2 text-foreground">Configuration Summary:</h4>
                    <pre className="text-xs overflow-auto bg-background p-3 rounded border max-h-60">
                      {JSON.stringify(formConfig, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FormConfigTool; 