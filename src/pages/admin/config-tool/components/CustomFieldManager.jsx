import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { createSafeTranslate } from "../../../../utils/translationUtils";

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'email', label: 'Email Input' },
  { value: 'tel', label: 'Phone Input' },
  { value: 'date', label: 'Date Picker' },
  { value: 'datetime', label: 'Date & Time Picker' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'file', label: 'File Upload' },
  { value: 'array', label: 'Array/List' }
];

const CustomFieldManager = ({ customFields, onUpdate }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [editingField, setEditingField] = useState(null);
  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    helpText: '',
    defaultValue: '',
    options: [],
    validation: {
      minLength: '',
      maxLength: '',
      min: '',
      max: '',
      pattern: ''
    }
  });

  const resetNewField = () => {
    setNewField({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      helpText: '',
      defaultValue: '',
      options: [],
      validation: {
        minLength: '',
        maxLength: '',
        min: '',
        max: '',
        pattern: ''
      }
    });
  };

  const addCustomField = () => {
    if (!newField.name || !newField.label) {
      alert('Field name and label are required');
      return;
    }

    // Check for duplicate field names
    if (customFields.some(field => field.name === newField.name)) {
      alert('Field name must be unique');
      return;
    }

    const fieldToAdd = {
      ...newField,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    onUpdate([...customFields, fieldToAdd]);
    resetNewField();
  };

  const removeCustomField = (fieldId) => {
    onUpdate(customFields.filter(field => field.id !== fieldId));
  };

  const startEditing = (field) => {
    setEditingField({ ...field });
  };

  const saveEdit = () => {
    if (!editingField.name || !editingField.label) {
      alert('Field name and label are required');
      return;
    }

    // Check for duplicate field names (excluding current field)
    if (customFields.some(field => field.name === editingField.name && field.id !== editingField.id)) {
      alert('Field name must be unique');
      return;
    }

    onUpdate(customFields.map(field => 
      field.id === editingField.id 
        ? { ...editingField, updatedAt: new Date().toISOString() }
        : field
    ));
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const updateNewField = (field, value) => {
    setNewField(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateEditingField = (field, value) => {
    setEditingField(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateValidation = (field, value, isEditing = false) => {
    const updateFunc = isEditing ? updateEditingField : updateNewField;
    const currentField = isEditing ? editingField : newField;
    
    updateFunc('validation', {
      ...currentField.validation,
      [field]: value
    });
  };

  const addOption = (isEditing = false) => {
    const currentField = isEditing ? editingField : newField;
    const updateFunc = isEditing ? updateEditingField : updateNewField;
    
    updateFunc('options', [...currentField.options, '']);
  };

  const updateOption = (index, value, isEditing = false) => {
    const currentField = isEditing ? editingField : newField;
    const updateFunc = isEditing ? updateEditingField : updateNewField;
    
    const newOptions = [...currentField.options];
    newOptions[index] = value;
    updateFunc('options', newOptions);
  };

  const removeOption = (index, isEditing = false) => {
    const currentField = isEditing ? editingField : newField;
    const updateFunc = isEditing ? updateEditingField : updateNewField;
    
    updateFunc('options', currentField.options.filter((_, i) => i !== index));
  };

  const needsOptions = (type) => {
    return ['select', 'radio'].includes(type);
  };

  const renderFieldForm = (field, updateFunc, isEditing = false) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Field Name *</label>
            <Input
              value={field.name}
              onChange={(e) => updateFunc('name', e.target.value)}
              placeholder="e.g., customField1"
              disabled={isEditing}
              className="focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Field Label *</label>
            <Input
              value={field.label}
              onChange={(e) => updateFunc('label', e.target.value)}
              placeholder="e.g., Custom Field"
              className="focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Field Type *</label>
            <select
              value={field.type}
              onChange={(e) => updateFunc('type', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {FIELD_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Required</label>
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateFunc('required', e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">This field is required</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Placeholder</label>
            <Input
              value={field.placeholder}
              onChange={(e) => updateFunc('placeholder', e.target.value)}
              placeholder="Enter placeholder text..."
              className="focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Default Value</label>
            <Input
              value={field.defaultValue}
              onChange={(e) => updateFunc('defaultValue', e.target.value)}
              placeholder="Enter default value..."
              className="focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Help Text</label>
          <textarea
            value={field.helpText}
            onChange={(e) => updateFunc('helpText', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={3}
            placeholder="Enter help text for users..."
          />
        </div>

        {/* Options for select and radio fields */}
        {needsOptions(field.type) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Options</label>
              <Button
                type="button"
                size="sm"
                onClick={() => addOption(isEditing)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {field.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value, isEditing)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 focus:ring-2 focus:ring-ring"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeOption(index, isEditing)}
                    className="h-9 w-9 p-0 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div className="space-y-4 border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground">Validation Rules</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(field.type === 'text' || field.type === 'textarea') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Min Length</label>
                  <Input
                    type="number"
                    value={field.validation.minLength}
                    onChange={(e) => updateValidation('minLength', e.target.value, isEditing)}
                    placeholder="Minimum characters"
                    className="focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Max Length</label>
                  <Input
                    type="number"
                    value={field.validation.maxLength}
                    onChange={(e) => updateValidation('maxLength', e.target.value, isEditing)}
                    placeholder="Maximum characters"
                    className="focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}
            {field.type === 'number' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Min Value</label>
                  <Input
                    type="number"
                    value={field.validation.min}
                    onChange={(e) => updateValidation('min', e.target.value, isEditing)}
                    placeholder="Minimum value"
                    className="focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Max Value</label>
                  <Input
                    type="number"
                    value={field.validation.max}
                    onChange={(e) => updateValidation('max', e.target.value, isEditing)}
                    placeholder="Maximum value"
                    className="focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">Pattern (Regex)</label>
              <Input
                value={field.validation.pattern}
                onChange={(e) => updateValidation('pattern', e.target.value, isEditing)}
                placeholder="Enter regex pattern..."
                className="focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-background">
        <CardTitle className="text-lg font-semibold">
          {safeTranslate('admin.formConfig.customFields.title', 'Custom Fields')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 bg-background">
        {/* Add New Field Form */}
        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Add New Custom Field</h3>
            <span className="text-xs text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              New Field
            </span>
          </div>
          {renderFieldForm(newField, updateNewField)}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-blue-200 dark:border-blue-800">
            <Button variant="outline" onClick={resetNewField}>
              Reset
            </Button>
            <Button onClick={addCustomField} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
        </div>

        {/* Existing Custom Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              Existing Custom Fields
            </h3>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {customFields.length} field{customFields.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {customFields.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
              <div className="max-w-sm mx-auto">
                <h4 className="text-lg font-medium mb-2">No custom fields created yet</h4>
                <p className="text-sm">Add a custom field above to get started with custom form elements.</p>
              </div>
            </div>
          )}

          {customFields.map((field) => (
            <div key={field.id} className="border border-border rounded-lg bg-card shadow-sm">
              {editingField && editingField.id === field.id ? (
                // Edit Mode
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-foreground">Edit Custom Field</h4>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEdit}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                  {renderFieldForm(editingField, updateEditingField, true)}
                </div>
              ) : (
                // View Mode
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-foreground mb-1">{field.label}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Name: <code className="bg-muted px-1 rounded text-xs">{field.name}</code></span>
                        <span>Type: <span className="font-medium">{FIELD_TYPES.find(t => t.value === field.type)?.label}</span></span>
                        {field.required && (
                          <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(field)}
                        className="h-8"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                        className="h-8"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {field.placeholder && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <span className="font-medium text-foreground">Placeholder:</span>
                        <p className="text-muted-foreground mt-1">{field.placeholder}</p>
                      </div>
                    )}
                    {field.defaultValue && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <span className="font-medium text-foreground">Default Value:</span>
                        <p className="text-muted-foreground mt-1">{field.defaultValue}</p>
                      </div>
                    )}
                    {field.helpText && (
                      <div className="bg-muted/50 p-3 rounded-md md:col-span-2">
                        <span className="font-medium text-foreground">Help Text:</span>
                        <p className="text-muted-foreground mt-1">{field.helpText}</p>
                      </div>
                    )}
                    {needsOptions(field.type) && field.options.length > 0 && (
                      <div className="bg-muted/50 p-3 rounded-md md:col-span-2">
                        <span className="font-medium text-foreground">Options:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {field.options.map((option, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomFieldManager; 