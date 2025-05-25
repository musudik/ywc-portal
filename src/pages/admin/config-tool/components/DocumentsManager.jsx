import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Plus, Trash2, FileText, Upload } from "lucide-react";
import { createSafeTranslate } from "../../../../utils/translationUtils";

// Common document types that can be quickly added
const COMMON_DOCUMENT_TYPES = [
  { name: "Passport", description: "Valid passport copy" },
  { name: "National ID", description: "National identity card" },
  { name: "Driver's License", description: "Valid driver's license" },
  { name: "Bank Statement", description: "Recent bank statement (last 3 months)" },
  { name: "Salary Certificate", description: "Employment and salary certificate" },
  { name: "Tax Return", description: "Latest tax return document" },
  { name: "Proof of Address", description: "Utility bill or rental agreement" },
  { name: "Insurance Policy", description: "Current insurance policy documents" },
  { name: "Birth Certificate", description: "Official birth certificate" },
  { name: "Marriage Certificate", description: "Marriage certificate (if applicable)" },
  { name: "Divorce Decree", description: "Divorce decree (if applicable)" },
  { name: "Property Deed", description: "Property ownership documents" },
  { name: "Rental Agreement", description: "Current rental/lease agreement" },
  { name: "Medical Certificate", description: "Medical examination certificate" },
  { name: "Educational Certificate", description: "Educational qualification certificates" },
  { name: "Business License", description: "Business registration/license" },
  { name: "Financial Statement", description: "Business financial statements" },
  { name: "Credit Report", description: "Credit history report" },
  { name: "Investment Portfolio", description: "Investment and portfolio statements" },
  { name: "Other Document", description: "Other relevant document" }
];

const DocumentsManager = ({ documents, onUpdate }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [newDocument, setNewDocument] = useState({
    name: '',
    description: '',
    required: true,
    acceptedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSize: '5MB'
  });

  const addDocument = () => {
    if (!newDocument.name.trim()) {
      alert('Document name is required');
      return;
    }

    // Check for duplicate document names
    if (documents.some(doc => doc.name.toLowerCase() === newDocument.name.toLowerCase())) {
      alert('Document name must be unique');
      return;
    }

    const documentToAdd = {
      ...newDocument,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    onUpdate([...documents, documentToAdd]);
    resetNewDocument();
  };

  const removeDocument = (documentId) => {
    onUpdate(documents.filter(doc => doc.id !== documentId));
  };

  const updateDocument = (documentId, field, value) => {
    onUpdate(documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, [field]: value, updatedAt: new Date().toISOString() }
        : doc
    ));
  };

  const resetNewDocument = () => {
    setNewDocument({
      name: '',
      description: '',
      required: true,
      acceptedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: '5MB'
    });
  };

  const addCommonDocument = (commonDoc) => {
    setNewDocument({
      ...newDocument,
      name: commonDoc.name,
      description: commonDoc.description
    });
  };

  const updateNewDocument = (field, value) => {
    setNewDocument(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAcceptedFormats = (format, isChecked) => {
    const currentFormats = newDocument.acceptedFormats;
    if (isChecked) {
      if (!currentFormats.includes(format)) {
        updateNewDocument('acceptedFormats', [...currentFormats, format]);
      }
    } else {
      updateNewDocument('acceptedFormats', currentFormats.filter(f => f !== format));
    }
  };

  const updateDocumentFormats = (documentId, format, isChecked) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;

    const currentFormats = document.acceptedFormats || [];
    let newFormats;
    
    if (isChecked) {
      newFormats = currentFormats.includes(format) ? currentFormats : [...currentFormats, format];
    } else {
      newFormats = currentFormats.filter(f => f !== format);
    }
    
    updateDocument(documentId, 'acceptedFormats', newFormats);
  };

  const availableFormats = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'txt', 'xls', 'xlsx'];
  const sizeOptions = ['1MB', '2MB', '5MB', '10MB', '20MB', '50MB'];

  return (
    <Card className="w-full">
      <CardHeader className="bg-background border-b">
        <CardTitle className="text-lg font-semibold">
          {safeTranslate('admin.formConfig.documents.title', 'Document Requirements')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 bg-background">
        {/* Add New Document Form */}
        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Add Required Document</h3>
            <span className="text-xs text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              New Document
            </span>
          </div>

          {/* Quick Add Common Documents */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Quick Add Common Documents:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {COMMON_DOCUMENT_TYPES.map((doc, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addCommonDocument(doc)}
                  className="text-xs h-8 justify-start"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  {doc.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Document Name *</label>
                <Input
                  value={newDocument.name}
                  onChange={(e) => updateNewDocument('name', e.target.value)}
                  placeholder="e.g., Passport Copy"
                  className="focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Max File Size</label>
                <select
                  value={newDocument.maxSize}
                  onChange={(e) => updateNewDocument('maxSize', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {sizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                value={newDocument.description}
                onChange={(e) => updateNewDocument('description', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={2}
                placeholder="Describe what document is needed and any specific requirements..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Accepted File Formats</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {availableFormats.map(format => (
                  <label key={format} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDocument.acceptedFormats.includes(format)}
                      onChange={(e) => updateAcceptedFormats(format, e.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground uppercase">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Required</label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={newDocument.required}
                  onChange={(e) => updateNewDocument('required', e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">This document is required for form submission</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-blue-200 dark:border-blue-800">
            <Button variant="outline" onClick={resetNewDocument}>
              Reset
            </Button>
            <Button onClick={addDocument} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Button>
          </div>
        </div>

        {/* Existing Documents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              Required Documents
            </h3>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {documents.length} document{documents.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {documents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
              <div className="max-w-sm mx-auto">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h4 className="text-lg font-medium mb-2">No documents configured yet</h4>
                <p className="text-sm">Add required documents above to create a document checklist for form submission.</p>
              </div>
            </div>
          )}

          {documents.map((document) => (
            <div key={document.id} className="border border-border rounded-lg bg-card shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-medium text-foreground">{document.name}</h4>
                    {document.required ? (
                      <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        Required
                      </span>
                    ) : (
                      <span className="bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        Optional
                      </span>
                    )}
                  </div>
                  {document.description && (
                    <p className="text-sm text-muted-foreground mb-3">{document.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Max Size: <span className="font-medium">{document.maxSize}</span></span>
                    <span>Formats: <span className="font-medium">{document.acceptedFormats?.join(', ').toUpperCase()}</span></span>
                  </div>
                </div>
                <div className="flex space-x-2 shrink-0">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={document.required}
                      onChange={(e) => updateDocument(document.id, 'required', e.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground">Required</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDocument(document.id)}
                    className="h-8"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* File Format Selection for existing documents */}
              <div className="border-t border-border pt-4">
                <label className="text-xs font-medium text-foreground mb-2 block">Accepted Formats:</label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {availableFormats.map(format => (
                    <label key={format} className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={document.acceptedFormats?.includes(format) || false}
                        onChange={(e) => updateDocumentFormats(document.id, format, e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary scale-75"
                      />
                      <span className="text-xs text-muted-foreground uppercase">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsManager; 