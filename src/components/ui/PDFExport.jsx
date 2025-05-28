import React from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import YWCLogo from '../../assets/YWC.png';

// Vite-compatible initialization
let isInitialized = false;

const initializePdfMake = () => {
  if (isInitialized) return true;
  
  try {
    console.log('Initializing PDFMake...');
    console.log('pdfMake object:', typeof pdfMake, !!pdfMake);
    console.log('pdfFonts object:', typeof pdfFonts, !!pdfFonts);
    
    // Set up VFS with Vite-compatible approach
    if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
      console.log('Using pdfFonts.pdfMake.vfs structure');
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    } else if (pdfFonts && pdfFonts.vfs) {
      console.log('Using pdfFonts.vfs structure');
      pdfMake.vfs = pdfFonts.vfs;
    } else if (pdfFonts) {
      console.log('Using pdfFonts directly');
      pdfMake.vfs = pdfFonts;
    } else {
      console.warn('No VFS found, PDF generation may not work properly');
      return false;
    }
    
    console.log('VFS keys sample:', Object.keys(pdfMake.vfs || {}).slice(0, 5));
    console.log('PDFMake initialized successfully with Vite');
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize pdfMake:', error);
    isInitialized = true;
    return false;
  }
};

// Initialize on module load
const isPdfMakeReady = initializePdfMake();

/**
 * Generic PDF Export Component
 * @param {Object} props
 * @param {Object} props.formData - Form configuration with title and sections
 * @param {Object} props.clientData - Primary client data
 * @param {Object} props.secondaryClientData - Secondary client data (for dual applicant)
 * @param {string} props.signature - Base64 signature data
 * @param {string} props.applicationType - 'single' or 'dual'
 */
const PDFExport = {
  // Convert image to base64 for PDF
  getImageBase64: async (imagePath) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  },

  // Helper function to format field value
  formatFieldValue: (value) => {
    if (value === null || value === undefined || value === '') return 'Not provided';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  },

  // Helper function to get nested field value
  getNestedValue: (obj, path) => {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object') {
        // Handle array access like "employmentDetails[0].occupation"
        if (key.includes('[') && key.includes(']')) {
          const [arrayKey, indexStr] = key.split('[');
          const index = parseInt(indexStr.replace(']', ''));
          return current[arrayKey] && current[arrayKey][index];
        }
        return current[key];
      }
      return undefined;
    }, obj);
  },

  // Helper function to convert camelCase to readable label
  formatFieldLabel: (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .trim();
  },

  // Helper function to create field row for single applicant
  createSingleFieldRow: (label, value) => {
    return {
      columns: [
        {
          width: '40%',
          text: `${label}:`,
          style: 'fieldLabel'
        },
        {
          width: '60%',
          text: PDFExport.formatFieldValue(value),
          style: 'fieldValue'
        }
      ],
      margin: [0, 2, 0, 2]
    };
  },

  // Helper function to create field row for dual applicant
  createDualFieldRow: (label, value1, value2) => {
    return {
      columns: [
        {
          width: '30%',
          text: `${label}:`,
          style: 'fieldLabel'
        },
        {
          width: '30%',
          text: PDFExport.formatFieldValue(value1),
          style: 'fieldValue'
        },
        {
          width: '10%',
          text: ''
        },
        {
          width: '30%',
          text: PDFExport.formatFieldValue(value2),
          style: 'fieldValue'
        }
      ],
      margin: [0, 2, 0, 2]
    };
  },

  // Helper function to render section content dynamically
  renderSectionContent: (section, clientData, secondaryClientData, isDualApplicant) => {
    const content = [];

    // Check if this is a consent section
    const isConsentSection = section.sectionType === 'consent' || 
                           section.type === 'consent' ||
                           (section.title && section.title.toLowerCase().includes('consent')) ||
                           (section.title && section.title.toLowerCase().includes('privacy')) ||
                           section.consentText ||
                           section.checkboxLabel;

    if (isConsentSection) {
      // Render consent section
      const consentText = section.consentText || section.content || section.description || 
        `I hereby consent to the terms and conditions outlined in the ${section.title || 'consent'} section.`;
      
      content.push({
        text: consentText,
        style: 'consentText'
      });
      
      content.push({
        columns: [
          {
            width: 20,
            text: '☑',
            fontSize: 12,
            color: '#059669'
          },
          {
            width: '*',
            text: section.checkboxLabel || `I agree to the ${section.title || 'consent'} terms`,
            fontSize: 10,
            margin: [5, 0, 0, 0]
          }
        ],
        margin: [0, 10, 0, 0]
      });
    } else {
      // Render regular form fields dynamically
      if (section.showFields && Array.isArray(section.showFields)) {
        section.showFields.forEach(field => {
          let fieldName, fieldLabel;
          
          // Handle different field formats
          if (typeof field === 'string') {
            fieldName = field;
            fieldLabel = PDFExport.formatFieldLabel(field);
          } else if (typeof field === 'object' && field.name) {
            fieldName = field.name;
            fieldLabel = field.label || PDFExport.formatFieldLabel(field.name);
          } else {
            return; // Skip invalid field
          }
          
          // Get values from client data
          const value1 = PDFExport.getNestedValue(clientData, fieldName);
          const value2 = isDualApplicant ? PDFExport.getNestedValue(secondaryClientData, fieldName) : null;
          
          // Create field row based on application type
          if (isDualApplicant) {
            content.push(PDFExport.createDualFieldRow(fieldLabel, value1, value2));
          } else {
            content.push(PDFExport.createSingleFieldRow(fieldLabel, value1));
          }
        });
      } else if (section.fields && Array.isArray(section.fields)) {
        // Alternative field structure
        section.fields.forEach(field => {
          const fieldName = field.name || field.key || field.id;
          const fieldLabel = field.label || PDFExport.formatFieldLabel(fieldName);
          
          if (fieldName) {
            const value1 = PDFExport.getNestedValue(clientData, fieldName);
            const value2 = isDualApplicant ? PDFExport.getNestedValue(secondaryClientData, fieldName) : null;
            
            if (isDualApplicant) {
              content.push(PDFExport.createDualFieldRow(fieldLabel, value1, value2));
            } else {
              content.push(PDFExport.createSingleFieldRow(fieldLabel, value1));
            }
          }
        });
      } else {
        // If no specific fields defined, try to render all client data for this section
        const sectionData = PDFExport.getNestedValue(clientData, section.sectionType || section.name || '');
        if (sectionData && typeof sectionData === 'object') {
          Object.keys(sectionData).forEach(key => {
            const fieldLabel = PDFExport.formatFieldLabel(key);
            const value1 = sectionData[key];
            const value2 = isDualApplicant ? PDFExport.getNestedValue(secondaryClientData, `${section.sectionType || section.name}.${key}`) : null;
            
            if (isDualApplicant) {
              content.push(PDFExport.createDualFieldRow(fieldLabel, value1, value2));
            } else {
              content.push(PDFExport.createSingleFieldRow(fieldLabel, value1));
            }
          });
        }
      }
    }

    return content;
  },

  // Generate PDF document definition
  generatePDFDefinition: async (formData, clientData, secondaryClientData = null, signature = null, applicationType = 'single') => {
    const logoBase64 = await PDFExport.getImageBase64(YWCLogo);
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const isDualApplicant = applicationType === 'dual' && secondaryClientData;
    const formTitle = formData?.title || formData?.name || 'Form';
    const clientFullName = `${clientData?.firstName || ''} ${clientData?.lastName || ''}`.trim();
    const secondaryClientFullName = isDualApplicant ? `${secondaryClientData?.firstName || ''} ${secondaryClientData?.lastName || ''}`.trim() : '';

    // Define styles
    const styles = {
      header: {
        fontSize: 16,
        bold: true,
        color: '#2563eb',
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        color: '#374151',
        margin: [0, 10, 0, 5]
      },
      sectionTitle: {
        fontSize: 12,
        bold: true,
        color: '#1f2937',
        margin: [0, 15, 0, 8],
        fillColor: '#f3f4f6'
      },
      fieldLabel: {
        fontSize: 10,
        bold: true,
        color: '#374151'
      },
      fieldValue: {
        fontSize: 10,
        color: '#111827'
      },
      consentText: {
        fontSize: 9,
        color: '#4b5563',
        alignment: 'justify',
        margin: [0, 5, 0, 10]
      },
      footer: {
        fontSize: 8,
        color: '#6b7280',
        alignment: 'center'
      },
      pageHeader: {
        fontSize: 10,
        color: '#2563eb',
        margin: [0, 0, 0, 10]
      }
    };

    // Create document definition
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 80, 40, 80],
      
      // Header function
      header: function(currentPage, pageCount) {
        if (currentPage === 1) return null; // No header on first page
        
        return {
          columns: [
            {
              width: '70%',
              text: 'YourWealth.Coach',
              style: 'pageHeader',
              bold: true
            },
            {
              width: '30%',
              text: formTitle,
              style: 'pageHeader',
              alignment: 'right'
            }
          ],
          margin: [40, 20, 40, 0]
        };
      },
      
      // Footer function
      footer: function(currentPage, pageCount) {
        return {
          columns: [
            {
              width: '50%',
              text: 'Confidential - YourWealth.Coach',
              style: 'footer'
            },
            {
              width: '50%',
              text: `Page ${currentPage} of ${pageCount}`,
              style: 'footer',
              alignment: 'right'
            }
          ],
          margin: [40, 0, 40, 20]
        };
      },

      content: [
        // First Page - Title Page
        {
          columns: [
            {
              width: '50%',
              image: logoBase64 ? logoBase64 : undefined,
              width: 200,
              alignment: 'left'
            },
            {
              width: '50%',
              text: 'YourWealth.Coach',
              style: 'header',
              fontSize: 24,
              alignment: 'right',
              margin: [0, 40, 0, 0]
            }
          ],
          margin: [0, 0, 0, 40]
        },
        
        // Form Title
        {
          text: formTitle,
          style: 'header',
          fontSize: 20,
          alignment: 'center',
          margin: [0, 40, 0, 20]
        },
        
        // Application Type
        {
          text: isDualApplicant ? 'Dual Application' : 'Single Application',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        
        // Client Name(s)
        {
          text: isDualApplicant ? `${clientFullName} & ${secondaryClientFullName}` : clientFullName,
          style: 'header',
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        
        // Generated Date
        {
          text: `PDF Generated Date: ${currentDate}`,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 20, 0, 40]
        },
        
        // Page break
        { text: '', pageBreak: 'after' },
        
        // Client Details Header for dual applicant
        ...(isDualApplicant ? [
          {
            columns: [
              {
                width: '30%',
                text: 'Field',
                style: 'sectionTitle',
                alignment: 'center'
              },
              {
                width: '30%',
                text: clientData?.firstName || 'Applicant 1',
                style: 'sectionTitle',
                alignment: 'center'
              },
              {
                width: '10%',
                text: ''
              },
              {
                width: '30%',
                text: secondaryClientData?.firstName || 'Applicant 2',
                style: 'sectionTitle',
                alignment: 'center'
              }
            ],
            margin: [0, 0, 0, 10]
          }
        ] : []),
        
        // Form Sections - Dynamically rendered
        ...(formData?.sections || []).map(section => {
          const sectionContent = [];
          
          // Section title
          sectionContent.push({
            text: section.title || section.name || section.sectionType || 'Section',
            style: 'sectionTitle',
            fillColor: '#e5e7eb',
            margin: [0, 15, 0, 10]
          });
          
          // Render section content dynamically
          const content = PDFExport.renderSectionContent(section, clientData, secondaryClientData, isDualApplicant);
          sectionContent.push(...content);
          
          return sectionContent;
        }).flat(),
        
        // Signature Section - Last Page
        { text: '', pageBreak: 'before' },
        
        {
          text: 'Digital Signature',
          style: 'sectionTitle',
          fillColor: '#e5e7eb',
          margin: [0, 0, 0, 20]
        },
        
        ...(signature ? [
          {
            text: 'Client Signature:',
            style: 'fieldLabel',
            margin: [0, 0, 0, 10]
          },
          {
            image: signature,
            width: 200,
            height: 80,
            margin: [0, 0, 0, 20]
          }
        ] : [
          {
            text: 'Client Signature: ________________________',
            style: 'fieldLabel',
            margin: [0, 0, 0, 40]
          }
        ]),
        
        {
          columns: [
            {
              width: '50%',
              text: `Date: ${currentDate}`,
              style: 'fieldLabel'
            },
            {
              width: '50%',
              text: `Client: ${clientFullName}`,
              style: 'fieldLabel',
              alignment: 'right'
            }
          ]
        },
        
        ...(isDualApplicant ? [
          {
            text: 'Secondary Applicant Signature: ________________________',
            style: 'fieldLabel',
            margin: [0, 40, 0, 20]
          },
          {
            text: `Client: ${secondaryClientFullName}`,
            style: 'fieldLabel',
            alignment: 'right'
          }
        ] : [])
      ],
      
      styles: styles
    };

    return docDefinition;
  },

  // Export PDF function
  exportPDF: async (formData, clientData, secondaryClientData = null, signature = null, applicationType = 'single', filename = null) => {
    try {
      // Ensure pdfMake is ready
      if (!isPdfMakeReady) {
        throw new Error('PDF library is not properly initialized');
      }

      const docDefinition = await PDFExport.generatePDFDefinition(
        formData, 
        clientData, 
        secondaryClientData, 
        signature, 
        applicationType
      );
      
      const pdfFileName = filename || `${formData?.title || formData?.name || 'form'}_${clientData?.firstName || 'client'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdfMake.createPdf(docDefinition).download(pdfFileName);
      
      return { success: true, filename: pdfFileName };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return { success: false, error: error.message };
    }
  },

  // Preview PDF function
  previewPDF: async (formData, clientData, secondaryClientData = null, signature = null, applicationType = 'single') => {
    try {
      // Ensure pdfMake is ready
      if (!isPdfMakeReady) {
        throw new Error('PDF library is not properly initialized');
      }

      const docDefinition = await PDFExport.generatePDFDefinition(
        formData, 
        clientData, 
        secondaryClientData, 
        signature, 
        applicationType
      );
      
      pdfMake.createPdf(docDefinition).open();
      
      return { success: true };
    } catch (error) {
      console.error('Error previewing PDF:', error);
      return { success: false, error: error.message };
    }
  }
};

export default PDFExport; 