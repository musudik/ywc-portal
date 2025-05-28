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
 * Generic PDF Export Component with Enhanced Styling
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

  // Helper function to format field value with enhanced formatting
  formatFieldValue: (value, fieldName = '') => {
    if (value === null || value === undefined || value === '') return 'Not provided';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
      // Check if this is a financial field that should show currency
      const isCurrencyField = fieldName && (
        fieldName.toLowerCase().includes('income') ||
        fieldName.toLowerCase().includes('expense') ||
        fieldName.toLowerCase().includes('rent') ||
        fieldName.toLowerCase().includes('asset') ||
        fieldName.toLowerCase().includes('loan') ||
        fieldName.toLowerCase().includes('amount') ||
        fieldName.toLowerCase().includes('benefit') ||
        fieldName.toLowerCase().includes('salary') ||
        fieldName.toLowerCase().includes('saving')
      );
      
      if (isCurrencyField && value > 0) {
        return `€${value.toLocaleString('en-US')}`;
      } else if (value > 1000 && !isCurrencyField) {
        return value.toLocaleString('en-US');
      }
      return value.toString();
    }
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      // Handle date objects
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return JSON.stringify(value);
    }
    
    // Handle string values
    const stringValue = String(value);
    
    // Check if it's a numeric string that should be formatted as currency
    if (/^\d+(\.\d{2})?$/.test(stringValue)) {
      const numValue = parseFloat(stringValue);
      const isCurrencyField = fieldName && (
        fieldName.toLowerCase().includes('income') ||
        fieldName.toLowerCase().includes('expense') ||
        fieldName.toLowerCase().includes('rent') ||
        fieldName.toLowerCase().includes('asset') ||
        fieldName.toLowerCase().includes('loan') ||
        fieldName.toLowerCase().includes('amount') ||
        fieldName.toLowerCase().includes('benefit') ||
        fieldName.toLowerCase().includes('salary') ||
        fieldName.toLowerCase().includes('saving')
      );
      
      if (isCurrencyField && numValue > 0) {
        return `€${numValue.toLocaleString('en-US')}`;
      }
    }
    
    // Check if it's a date string
    if (/^\d{4}-\d{2}-\d{2}/.test(stringValue)) {
      try {
        const date = new Date(stringValue);
        return date.toLocaleDateString();
      } catch (e) {
        // If date parsing fails, return original string
      }
    }
    
    return stringValue;
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

  // Helper function to create field row for single applicant with enhanced styling
  createSingleFieldRow: (label, value, fieldName = '') => {
    const formattedValue = PDFExport.formatFieldValue(value, fieldName);
    const isNotProvided = formattedValue === 'Not provided';
    
    return {
      columns: [
        {
          width: '35%',
          text: `${label}:`,
          style: 'fieldLabel',
          margin: [0, 2, 8, 2]
        },
        {
          width: '65%',
          text: formattedValue,
          style: isNotProvided ? 'fieldValueEmpty' : 'fieldValue',
          margin: [0, 2, 0, 2]
        }
      ],
      margin: [0, 1, 0, 1]
    };
  },

  // Helper function to create field row for dual applicant with enhanced styling
  createDualFieldRow: (label, value1, value2, fieldName = '') => {
    const formattedValue1 = PDFExport.formatFieldValue(value1, fieldName);
    const formattedValue2 = PDFExport.formatFieldValue(value2, fieldName);
    const isNotProvided1 = formattedValue1 === 'Not provided';
    const isNotProvided2 = formattedValue2 === 'Not provided';
    
    return {
      columns: [
        {
          width: '25%',
          text: `${label}:`,
          style: 'fieldLabel',
          margin: [0, 2, 8, 2]
        },
        {
          width: '32%',
          text: formattedValue1,
          style: isNotProvided1 ? 'fieldValueEmpty' : 'fieldValue',
          margin: [0, 2, 8, 2]
        },
        {
          width: '8%',
          text: '',
          margin: [0, 2, 0, 2]
        },
        {
          width: '32%',
          text: formattedValue2,
          style: isNotProvided2 ? 'fieldValueEmpty' : 'fieldValue',
          margin: [0, 2, 0, 2]
        }
      ],
      margin: [0, 1, 0, 1]
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
      // Render consent section with enhanced styling
      const consentText = section.consentText || section.content || section.description || 
        `I hereby consent to the terms and conditions outlined in the ${section.title || 'consent'} section.`;
      
      content.push({
        text: consentText,
        style: 'consentText',
        margin: [15, 10, 15, 15],
        border: [true, true, true, false],
        fillColor: '#f8fafc'
      });
      
      content.push({
        columns: [
          {
            width: 25,
            text: '☑',
            fontSize: 14,
            color: '#059669',
            bold: true
          },
          {
            width: '*',
            text: section.checkboxLabel || `I agree to the ${section.title || 'consent'} terms`,
            fontSize: 11,
            margin: [8, 2, 0, 0],
            color: '#374151'
          }
        ],
        margin: [15, 0, 15, 10],
        border: [true, false, true, true],
        fillColor: '#f8fafc'
      });
    } else {
      // Render regular form fields dynamically with enhanced styling
      if (section.showFields && Array.isArray(section.showFields) && section.showFields.length > 0) {
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
          
          // Only add field if it has a value or if we want to show empty fields
          const hasValue1 = value1 !== null && value1 !== undefined && value1 !== '';
          const hasValue2 = value2 !== null && value2 !== undefined && value2 !== '';
          
          // Skip completely empty fields to avoid showing too many "Not provided" entries
          if (!hasValue1 && !hasValue2) {
            return;
          }
          
          // Create field row based on application type
          if (isDualApplicant) {
            content.push(PDFExport.createDualFieldRow(fieldLabel, value1, value2, fieldName));
          } else {
            content.push(PDFExport.createSingleFieldRow(fieldLabel, value1, fieldName));
          }
        });
      } else if (section.fields && Array.isArray(section.fields) && section.fields.length > 0) {
        // Alternative field structure
        section.fields.forEach(field => {
          const fieldName = field.name || field.key || field.id;
          const fieldLabel = field.label || PDFExport.formatFieldLabel(fieldName);
          
          if (fieldName) {
            const value1 = PDFExport.getNestedValue(clientData, fieldName);
            const value2 = isDualApplicant ? PDFExport.getNestedValue(secondaryClientData, fieldName) : null;
            
            // Only add field if it has a value
            const hasValue1 = value1 !== null && value1 !== undefined && value1 !== '';
            const hasValue2 = value2 !== null && value2 !== undefined && value2 !== '';
            
            if (!hasValue1 && !hasValue2) {
              return;
            }
            
            if (isDualApplicant) {
              content.push(PDFExport.createDualFieldRow(fieldLabel, value1, value2, fieldName));
            } else {
              content.push(PDFExport.createSingleFieldRow(fieldLabel, value1, fieldName));
            }
          }
        });
      } else {
        // Try to auto-detect fields from section data
        const sectionData = PDFExport.getNestedValue(clientData, section.sectionType || section.name || '');
        if (sectionData && typeof sectionData === 'object') {
          Object.keys(sectionData).forEach(key => {
            // Skip internal fields
            if (key.startsWith('_') || key === 'id' || key === 'createdAt' || key === 'updatedAt') {
              return;
            }
            
            const fieldLabel = PDFExport.formatFieldLabel(key);
            const value1 = sectionData[key];
            const value2 = isDualApplicant ? PDFExport.getNestedValue(secondaryClientData, `${section.sectionType || section.name}.${key}`) : null;
            
            // Only add field if it has a value
            const hasValue1 = value1 !== null && value1 !== undefined && value1 !== '';
            const hasValue2 = value2 !== null && value2 !== undefined && value2 !== '';
            
            if (!hasValue1 && !hasValue2) {
              return;
            }
            
            if (isDualApplicant) {
              content.push(PDFExport.createDualFieldRow(fieldLabel, value1, value2, key));
            } else {
              content.push(PDFExport.createSingleFieldRow(fieldLabel, value1, key));
            }
          });
        }
      }
      
      // If no content was added, add a placeholder
      if (content.length === 0) {
        content.push({
          text: 'No data available for this section',
          style: 'fieldValueEmpty',
          alignment: 'center',
          margin: [0, 10, 0, 10]
        });
      }
    }

    return content;
  },

  // Generate PDF document definition with enhanced styling
  generatePDFDefinition: async (formData, clientData, secondaryClientData = null, signature = null, applicationType = 'single') => {
    const logoBase64 = await PDFExport.getImageBase64(YWCLogo);
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const isDualApplicant = applicationType === 'dual' && secondaryClientData;
    const formTitle = formData?.title || formData?.name || 'Financial Assessment Form';
    const clientFullName = `${clientData?.firstName || ''} ${clientData?.lastName || ''}`.trim();
    const secondaryClientFullName = isDualApplicant ? `${secondaryClientData?.firstName || ''} ${secondaryClientData?.lastName || ''}`.trim() : '';

    // Enhanced color scheme and styles
    const primaryColor = '#1e40af'; // Professional blue
    const secondaryColor = '#059669'; // Success green
    const accentColor = '#7c3aed'; // Purple accent
    const lightGray = '#f8fafc';
    const mediumGray = '#e2e8f0';
    const darkGray = '#374151';
    const textColor = '#111827';

    // Define enhanced styles
    const styles = {
      // Headers and titles
      header: {
        fontSize: 24,
        bold: true,
        color: primaryColor,
        margin: [0, 0, 0, 15],
        alignment: 'center'
      },
      subheader: {
        fontSize: 16,
        bold: true,
        color: darkGray,
        margin: [0, 10, 0, 8],
        alignment: 'center'
      },
      sectionTitle: {
        fontSize: 14,
        bold: true,
        color: 'white',
        margin: [12, 8, 12, 8],
        fillColor: primaryColor,
        alignment: 'left'
      },
      
      // Field styles
      fieldLabel: {
        fontSize: 10,
        bold: true,
        color: darkGray
      },
      fieldValue: {
        fontSize: 10,
        color: textColor
      },
      fieldValueEmpty: {
        fontSize: 10,
        color: '#9ca3af',
        italics: true
      },
      
      // Specialized content
      consentText: {
        fontSize: 9,
        color: '#4b5563',
        alignment: 'justify',
        lineHeight: 1.3
      },
      
      // Navigation elements
      footer: {
        fontSize: 8,
        color: '#6b7280',
        alignment: 'center'
      },
      pageHeader: {
        fontSize: 10,
        color: primaryColor,
        margin: [0, 0, 0, 5]
      },
      
      // Company branding
      companyName: {
        fontSize: 20,
        bold: true,
        color: primaryColor,
        margin: [0, 20, 0, 0]
      }
    };

    // Create enhanced document definition
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [50, 90, 50, 90],
      
      // Enhanced header function
      header: function(currentPage, pageCount) {
        if (currentPage === 1) return null; // No header on first page
        
        return {
          margin: [50, 25, 50, 15],
          table: {
            widths: ['60%', '40%'],
            body: [[
              {
                text: 'YourWealth.Coach',
                style: 'pageHeader',
                bold: true,
                fontSize: 12,
                border: [false, false, false, true],
                borderColor: [mediumGray]
              },
              {
                text: formTitle,
                style: 'pageHeader',
                alignment: 'right',
                fontSize: 10,
                border: [false, false, false, true],
                borderColor: [mediumGray]
              }
            ]]
          }
        };
      },
      
      // Enhanced footer function
      footer: function(currentPage, pageCount) {
        return {
          margin: [50, 15, 50, 25],
          table: {
            widths: ['50%', '50%'],
            body: [[
              {
                text: 'Confidential - YourWealth.Coach',
                style: 'footer',
                border: [false, true, false, false],
                borderColor: [mediumGray]
              },
              {
                text: `Page ${currentPage} of ${pageCount}`,
                style: 'footer',
                alignment: 'right',
                border: [false, true, false, false],
                borderColor: [mediumGray]
              }
            ]]
          }
        };
      },

      content: [
        // Enhanced Title Page
        {
          table: {
            widths: ['50%', '50%'],
            body: [[
              {
                image: logoBase64 || undefined,
                width: 180,
                alignment: 'left',
                border: [false, false, false, false]
              },
              {
                text: 'YourWealth.Coach',
                style: 'companyName',
                alignment: 'right',
                border: [false, false, false, false]
              }
            ]]
          },
          margin: [0, 0, 0, 50]
        },
        
        // Decorative line
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 3,
              lineColor: primaryColor
            }
          ],
          margin: [0, 0, 0, 30]
        },
        
        // Form Title with enhanced styling
        {
          text: formTitle,
          style: 'header',
          margin: [0, 20, 0, 15]
        },
        
        // Application Type Badge
        {
          table: {
            widths: ['*'],
            body: [[
              {
                text: isDualApplicant ? 'DUAL APPLICATION' : 'SINGLE APPLICATION',
                alignment: 'center',
                fillColor: isDualApplicant ? accentColor : secondaryColor,
                color: 'white',
                bold: true,
                fontSize: 12,
                margin: [0, 8, 0, 8]
              }
            ]]
          },
          margin: [100, 0, 100, 25]
        },
        
        // Client Information Card
        {
          table: {
            widths: ['*'],
            body: [[
              {
                text: isDualApplicant ? `${clientFullName} & ${secondaryClientFullName}` : clientFullName,
                alignment: 'center',
                fillColor: lightGray,
                fontSize: 16,
                bold: true,
                color: textColor,
                margin: [0, 15, 0, 15]
              }
            ]]
          },
          margin: [50, 0, 50, 25]
        },
        
        // Generation Date
        {
          text: `Generated: ${currentDate}`,
          style: 'subheader',
          fontSize: 12,
          margin: [0, 10, 0, 40]
        },
        
        // Page break
        { text: '', pageBreak: 'after' },
        
        // Enhanced Client Details Header for dual applicant
        ...(isDualApplicant ? [
          {
            table: {
              widths: ['25%', '32%', '8%', '32%'],
              body: [[
                {
                  text: 'Field',
                  style: 'sectionTitle',
                  alignment: 'center'
                },
                {
                  text: clientData?.firstName || 'Applicant 1',
                  style: 'sectionTitle',
                  alignment: 'center'
                },
                {
                  text: '',
                  border: [false, false, false, false]
                },
                {
                  text: secondaryClientData?.firstName || 'Applicant 2',
                  style: 'sectionTitle',
                  alignment: 'center'
                }
              ]]
            },
            margin: [0, 0, 0, 15]
          }
        ] : []),
        
        // Form Sections - Dynamically rendered with enhanced styling
        ...(formData?.sections || []).map((section, sectionIndex) => {
          const sectionContent = [];
          
          // Get section title, avoid empty or undefined titles
          const sectionTitle = section.title || section.name || section.sectionType || `Section ${sectionIndex + 1}`;
          
          // Skip sections with no valid title or content
          if (!sectionTitle || sectionTitle === 'undefined' || sectionTitle === '0') {
            return [];
          }
          
          // Enhanced section title
          sectionContent.push({
            table: {
              widths: ['*'],
              body: [[
                {
                  text: [
                    {
                      text: '● ',
                      color: secondaryColor,
                      fontSize: 16,
                      bold: true
                    },
                    {
                      text: sectionTitle,
                      style: 'sectionTitle'
                    }
                  ],
                  margin: [15, 10, 15, 10]
                }
              ]]
            },
            margin: [0, 20, 0, 10]
          });
          
          // Section content container with subtle background
          const content = PDFExport.renderSectionContent(section, clientData, secondaryClientData, isDualApplicant);
          if (content.length > 0) {
            sectionContent.push({
              table: {
                widths: ['*'],
                body: [[
                  {
                    stack: content,
                    fillColor: '#fefefe',
                    margin: [15, 10, 15, 15],
                    border: [false, false, false, false]
                  }
                ]]
              },
              margin: [0, 0, 0, 15]
            });
          }
          
          return sectionContent;
        }).flat().filter(item => item && Object.keys(item).length > 0),
        
        // Enhanced Signature Section - Last Page
        { text: '', pageBreak: 'before' },
        
        {
          table: {
            widths: ['*'],
            body: [[
              {
                text: [
                  {
                    text: '✍ ',
                    color: accentColor,
                    fontSize: 16,
                    bold: true
                  },
                  {
                    text: 'Digital Signature',
                    style: 'sectionTitle'
                  }
                ],
                margin: [15, 10, 15, 10]
              }
            ]]
          },
          margin: [0, 0, 0, 25]
        },
        
        ...(signature ? [
          {
            text: 'Client Signature:',
            style: 'fieldLabel',
            margin: [0, 0, 0, 10],
            fontSize: 12
          },
          {
            table: {
              widths: ['*'],
              body: [[
                {
                  image: signature,
                  width: 200,
                  height: 80,
                  alignment: 'center',
                  margin: [0, 10, 0, 10],
                  fillColor: lightGray
                }
              ]]
            },
            margin: [0, 0, 0, 20]
          }
        ] : [
          {
            table: {
              widths: ['*'],
              body: [[
                {
                  text: 'Client Signature: ________________________________',
                  style: 'fieldLabel',
                  fontSize: 12,
                  margin: [0, 20, 0, 20],
                  fillColor: lightGray
                }
              ]]
            },
            margin: [0, 0, 0, 30]
          }
        ]),
        
        // Final details table
        {
          table: {
            widths: ['50%', '50%'],
            body: [[
              {
                text: `Date: ${currentDate}`,
                style: 'fieldLabel',
                fontSize: 11,
                border: [false, false, false, false]
              },
              {
                text: `Client: ${clientFullName}`,
                style: 'fieldLabel',
                fontSize: 11,
                alignment: 'right',
                border: [false, false, false, false]
              }
            ]]
          },
          margin: [0, 0, 0, 20]
        },
        
        ...(isDualApplicant ? [
          {
            table: {
              widths: ['*'],
              body: [[
                {
                  text: 'Secondary Applicant Signature: ________________________________',
                  style: 'fieldLabel',
                  fontSize: 12,
                  margin: [0, 20, 0, 10],
                  fillColor: lightGray
                }
              ]]
            },
            margin: [0, 20, 0, 10]
          },
          {
            text: `Secondary Client: ${secondaryClientFullName}`,
            style: 'fieldLabel',
            fontSize: 11,
            alignment: 'right',
            margin: [0, 0, 0, 0]
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