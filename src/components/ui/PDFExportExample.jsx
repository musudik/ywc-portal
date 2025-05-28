import React, { useState } from 'react';
import PDFExport from './PDFExport';
import { Button } from './button';

/**
 * Example component demonstrating how to use the generic PDFExport component
 */
const PDFExportExample = () => {
  const [signature, setSignature] = useState(null);

  // Example form data with flexible structure
  const exampleFormData = {
    title: "Financial Self-Disclosure Form",
    name: "Self-Disclosure",
    version: "1.0",
    description: "Comprehensive financial assessment form for advisory services",
    sections: [
      {
        title: "Personal Information",
        sectionType: "personal",
        showFields: [
          "firstName",
          "lastName", 
          "email",
          "phone",
          "streetAddress",
          "city",
          "postalCode",
          "birthDate",
          "maritalStatus",
          "nationality"
        ]
      },
      {
        title: "Employment Details",
        sectionType: "employment",
        showFields: [
          "employmentDetails[0].employmentType",
          "employmentDetails[0].occupation",
          "employmentDetails[0].employerName",
          "employmentDetails[0].contractType",
          "employmentDetails[0].employedSince"
        ]
      },
      {
        title: "Income Information",
        sectionType: "income",
        showFields: [
          "incomeDetails[0].grossIncome",
          "incomeDetails[0].netIncome",
          "incomeDetails[0].taxClass",
          "incomeDetails[0].numberOfSalaries",
          "incomeDetails[0].childBenefit"
        ]
      },
      {
        title: "Monthly Expenses",
        sectionType: "expenses",
        showFields: [
          "expensesDetails[0].coldRent",
          "expensesDetails[0].electricity",
          "expensesDetails[0].livingExpenses",
          "expensesDetails[0].gas",
          "expensesDetails[0].telecommunication",
          "expensesDetails[0].subscriptions"
        ]
      },
      {
        title: "Assets Overview",
        sectionType: "assets",
        showFields: [
          "assets[0].realEstate",
          "assets[0].securities",
          "assets[0].bankDeposits",
          "assets[0].buildingSavings",
          "assets[0].insuranceValues",
          "assets[0].otherAssets"
        ]
      },
      {
        title: "Goals and Objectives",
        sectionType: "goals",
        showFields: [
          "goalsAndWishes.retirementPlanning",
          "goalsAndWishes.capitalFormation",
          "goalsAndWishes.realEstateGoals",
          "goalsAndWishes.financing",
          "goalsAndWishes.protection"
        ]
      },
      {
        title: "Data Processing Consent",
        sectionType: "consent",
        consentText: "I hereby consent to the processing of my personal data as provided in this form for the purpose of financial advisory services. I understand that my data will be handled in accordance with applicable data protection regulations (GDPR).\n\nThis includes the collection, storage, processing, and analysis of my personal and financial information for the purpose of providing personalized financial advice and recommendations.",
        checkboxLabel: "I agree to the data processing terms",
        required: true
      },
      {
        title: "Privacy Policy Agreement",
        sectionType: "consent",
        consentText: "I acknowledge that I have read and understood the Privacy Policy of YourWealth.Coach. I understand how my personal information will be collected, used, stored, and protected.\n\nI understand my rights regarding my personal data, including the right to access, rectify, erase, restrict processing, and data portability as outlined in the Privacy Policy.",
        checkboxLabel: "I acknowledge and agree to the Privacy Policy",
        required: true
      }
    ]
  };

  // Example client data with nested structure
  const exampleClientData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+49 123 456 7890",
    streetAddress: "Musterstraße 123",
    city: "Berlin",
    postalCode: "10115",
    birthDate: "1985-06-15",
    maritalStatus: "married",
    nationality: "German",
    coachId: "COACH001",
    employmentDetails: [{
      employmentType: "full-time",
      occupation: "Software Engineer",
      employerName: "Tech Solutions GmbH",
      contractType: "permanent",
      contractDuration: "unlimited",
      employedSince: "2020-03-01"
    }],
    incomeDetails: [{
      grossIncome: 75000,
      netIncome: 48000,
      taxClass: 3,
      numberOfSalaries: 13,
      childBenefit: 250
    }],
    expensesDetails: [{
      coldRent: 1200,
      electricity: 80,
      livingExpenses: 800,
      gas: 60,
      telecommunication: 45,
      subscriptions: 120
    }],
    assets: [{
      realEstate: 250000,
      securities: 15000,
      bankDeposits: 25000,
      buildingSavings: 10000,
      insuranceValues: 5000,
      otherAssets: 8000
    }],
    goalsAndWishes: {
      retirementPlanning: "Secure retirement by age 65",
      capitalFormation: "Build wealth for children's education",
      realEstateGoals: "Purchase vacation home",
      financing: "Optimize mortgage rates",
      protection: "Comprehensive insurance coverage"
    },
    riskAppetite: {
      riskAppetite: "medium",
      investmentHorizon: "long-term",
      knowledgeExperience: "intermediate",
      healthInsurance: "private"
    }
  };

  // Example secondary client data for dual applicant
  const exampleSecondaryClientData = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    phone: "+49 123 456 7891",
    streetAddress: "Musterstraße 123",
    city: "Berlin",
    postalCode: "10115",
    birthDate: "1987-09-22",
    maritalStatus: "married",
    nationality: "German",
    employmentDetails: [{
      employmentType: "part-time",
      occupation: "Marketing Manager",
      employerName: "Creative Agency Berlin",
      contractType: "permanent",
      contractDuration: "unlimited",
      employedSince: "2019-08-15"
    }],
    incomeDetails: [{
      grossIncome: 45000,
      netIncome: 32000,
      taxClass: 5,
      numberOfSalaries: 12,
      childBenefit: 0
    }],
    expensesDetails: [{
      coldRent: 0, // Shared with primary applicant
      electricity: 0,
      livingExpenses: 600,
      gas: 0,
      telecommunication: 35,
      subscriptions: 80
    }],
    assets: [{
      realEstate: 0,
      securities: 8000,
      bankDeposits: 15000,
      buildingSavings: 5000,
      insuranceValues: 3000,
      otherAssets: 2000
    }],
    goalsAndWishes: {
      retirementPlanning: "Joint retirement planning",
      capitalFormation: "Education fund for children",
      realEstateGoals: "Family home upgrade",
      financing: "Debt consolidation",
      protection: "Family protection plan"
    }
  };

  // Alternative form structure example (Immobilien form)
  const immobilienFormData = {
    title: "Immobilien Advisory Form",
    name: "Immobilien",
    sections: [
      {
        title: "Property Information",
        fields: [
          { name: "propertyType", label: "Property Type" },
          { name: "propertyValue", label: "Property Value" },
          { name: "propertyLocation", label: "Location" },
          { name: "purchaseDate", label: "Purchase Date" }
        ]
      },
      {
        title: "Financing Details",
        fields: [
          { name: "loanAmount", label: "Loan Amount" },
          { name: "interestRate", label: "Interest Rate" },
          { name: "loanTerm", label: "Loan Term" },
          { name: "monthlyPayment", label: "Monthly Payment" }
        ]
      },
      {
        title: "Terms and Conditions",
        sectionType: "consent",
        consentText: "I agree to the terms and conditions for the Immobilien advisory service. This includes the assessment of my property investment goals and financial situation.",
        checkboxLabel: "I accept the Immobilien advisory terms"
      }
    ]
  };

  const immobilienClientData = {
    firstName: "Maria",
    lastName: "Schmidt",
    propertyType: "Apartment",
    propertyValue: 350000,
    propertyLocation: "Munich",
    purchaseDate: "2023-01-15",
    loanAmount: 280000,
    interestRate: 3.5,
    loanTerm: 25,
    monthlyPayment: 1400
  };

  const handleExportSingle = async () => {
    try {
      console.log('Starting single applicant PDF export...');
      const result = await PDFExport.exportPDF(
        exampleFormData,
        exampleClientData,
        null,
        signature,
        'single',
        'single_applicant_example.pdf'
      );
      
      console.log('Export result:', result);
      if (result.success) {
        alert(`Single applicant PDF exported successfully: ${result.filename}`);
      } else {
        alert(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting single applicant PDF:', error);
      alert(`Error exporting PDF: ${error.message}`);
    }
  };

  const handleExportDual = async () => {
    try {
      console.log('Starting dual applicant PDF export...');
      const result = await PDFExport.exportPDF(
        exampleFormData,
        exampleClientData,
        exampleSecondaryClientData,
        signature,
        'dual',
        'dual_applicant_example.pdf'
      );
      
      if (result.success) {
        alert(`Dual applicant PDF exported successfully: ${result.filename}`);
      }
    } catch (error) {
      console.error('Error exporting dual applicant PDF:', error);
      alert(`Error exporting PDF: ${error.message}`);
    }
  };

  const handleExportImmobilien = async () => {
    try {
      console.log('Starting Immobilien PDF export...');
      const result = await PDFExport.exportPDF(
        immobilienFormData,
        immobilienClientData,
        null,
        signature,
        'single',
        'immobilien_example.pdf'
      );
      
      if (result.success) {
        alert(`Immobilien PDF exported successfully: ${result.filename}`);
      }
    } catch (error) {
      console.error('Error exporting Immobilien PDF:', error);
      alert(`Error exporting PDF: ${error.message}`);
    }
  };

  const handlePreviewSingle = async () => {
    try {
      console.log('Starting single applicant PDF preview...');
      await PDFExport.previewPDF(
        exampleFormData,
        exampleClientData,
        null,
        signature,
        'single'
      );
      console.log('Preview opened successfully');
    } catch (error) {
      console.error('Error previewing single applicant PDF:', error);
      alert(`Error previewing PDF: ${error.message}`);
    }
  };

  const handlePreviewDual = async () => {
    try {
      console.log('Starting dual applicant PDF preview...');
      await PDFExport.previewPDF(
        exampleFormData,
        exampleClientData,
        exampleSecondaryClientData,
        signature,
        'dual'
      );
    } catch (error) {
      console.error('Error previewing dual applicant PDF:', error);
      alert(`Error previewing PDF: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generic PDF Export Component Examples</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Single Applicant PDF (Financial Form)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Export a PDF with data from a single client. All information is displayed on the left side 
            in a Label: Value format. Uses nested field paths like "employmentDetails[0].occupation".
          </p>
          <div className="flex gap-2">
            <Button onClick={handlePreviewSingle} variant="outline">
              Preview Single Applicant PDF
            </Button>
            <Button onClick={handleExportSingle}>
              Export Single Applicant PDF
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Dual Applicant PDF (Financial Form)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Export a PDF with data from two clients. Primary applicant data on the left, 
            secondary applicant data on the right, with field labels in the center.
          </p>
          <div className="flex gap-2">
            <Button onClick={handlePreviewDual} variant="outline">
              Preview Dual Applicant PDF
            </Button>
            <Button onClick={handleExportDual}>
              Export Dual Applicant PDF
            </Button>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Alternative Form Structure (Immobilien)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Demonstrates flexibility with different field structures. Uses "fields" array with 
            explicit labels instead of "showFields" with field paths.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleExportImmobilien}>
              Export Immobilien PDF
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Generic Component Features</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>✅ No Hardcoding:</strong> Dynamically renders any field structure</p>
            <p><strong>✅ Flexible Field Paths:</strong> Supports nested paths like "employmentDetails[0].occupation"</p>
            <p><strong>✅ Multiple Field Formats:</strong> Works with "showFields" (strings) or "fields" (objects)</p>
            <p><strong>✅ Auto Label Generation:</strong> Converts camelCase to readable labels</p>
            <p><strong>✅ Consent Sections:</strong> Automatically detects and formats consent sections</p>
            <p><strong>✅ Responsive Layout:</strong> Single vs Dual applicant layouts</p>
            <p><strong>✅ Professional Styling:</strong> YWC branding, headers, footers, page numbers</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Usage Examples</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Field Path Examples:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>"firstName"</code> - Direct field access</li>
              <li><code>"employmentDetails[0].occupation"</code> - Array with index</li>
              <li><code>"goalsAndWishes.retirementPlanning"</code> - Nested object</li>
              <li><code>"assets[0].realEstate"</code> - Array of objects</li>
            </ul>
            <p className="mt-4"><strong>Section Types:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>sectionType: "consent"</code> - Renders as consent section</li>
              <li><code>showFields: [...]</code> - Array of field paths</li>
              <li><code>fields: [...]</code> - Array of field objects with labels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExportExample; 