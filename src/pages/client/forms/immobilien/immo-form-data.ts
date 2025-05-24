/**
 * Immobilien Form Data Structure
 * Based on immo-form-template.json
 * Uses centralized client model interfaces to avoid duplication
 */

// Import all interfaces from the centralized client model
import {
  PersonalDetails,
  EmploymentDetails,
  IncomeDetails,
  ExpensesDetails,
  Assets,
  Liabilities,
  PropertyDetails,
  LoanDetails,
  Consent,
  Document,
  FormMetadata,
  ImmobilienFormData,
  BaseClientData,
  createEmptyPersonalDetails,
  createFormMetadata,
  createEmptyConsent,
  mapPersonalDetailsToApi,
  mapPersonalDetailsFromApi,
  mapIncomeDetailsToApi,
  mapIncomeDetailsFromApi,
  mapExpensesDetailsToApi,
  mapExpensesDetailsFromApi,
  mapAssetsToApi,
  mapAssetsFromApi
} from '../../model/client';

/**
 * Creates an empty Immobilien form data structure with default values
 * @param userId User ID for the form
 * @param formName Optional form name
 * @returns A new Immobilien form data structure
 */
export function createEmptyImmobilienForm(userId?: string, formName = 'Immobilien Antrag'): ImmobilienFormData {
  const currentDate = new Date().toISOString();
  
  const emptyPersonalDetails = createEmptyPersonalDetails();
  
  const emptyEmploymentDetails: EmploymentDetails = {
    employmentType: '',
    occupation: '',
    employerName: '',
    contractType: '',
    employedSince: currentDate
  };

  const emptyIncomeDetails: IncomeDetails = {
    monthlyNetIncome: 0,
    annualGrossIncome: 0
  };

  const emptyExpensesDetails: ExpensesDetails = {
    housingExpenses: 0,
    utilityBills: 0,
    insurancePayments: 0,
    transportationCosts: 0,
    livingExpenses: 0
  };

  const emptyAssets: Assets = {
    cashAndSavings: 0
  };

  const emptyLiabilities: Liabilities = {};

  const emptyPropertyDetails: PropertyDetails = {
    propertyType: '',
    propertyAddress: '',
    propertyCity: '',
    propertyPostalCode: '',
    propertyPrice: 0,
    constructionYear: new Date().getFullYear(),
    livingArea: 0,
    numberOfRooms: 0,
    numberOfBathrooms: 0
  };

  const emptyLoanDetails: LoanDetails = {
    loanAmount: 0,
    downPayment: 0,
    loanTerm: '',
    interestRateType: 'Fixed',
    propertyPurpose: 'Primary Residence'
  };

  const baseClientData: BaseClientData = {
    personal: emptyPersonalDetails,
    employment: emptyEmploymentDetails,
    income: emptyIncomeDetails,
    expenses: emptyExpensesDetails,
    assets: emptyAssets,
    liabilities: emptyLiabilities,
    documents: []
  };

  return {
    metadata: createFormMetadata('immobilien', formName, userId),
    primaryApplicant: {
      ...baseClientData,
      property: emptyPropertyDetails,
      loan: emptyLoanDetails
    },
    consent: createEmptyConsent()
  };
}

/**
 * Maps Immobilien form data to API format with proper field mapping
 * @param formData The form data to map
 * @returns API-compatible form data
 */
export function mapToApiFormat(formData: ImmobilienFormData): any {
  return {
    formType: formData.metadata.formType,
    formName: formData.metadata.formName,
    status: formData.metadata.status,
    userId: formData.metadata.userId,
    
    // Primary applicant data with field mapping
    primaryApplicant: {
      personalDetails: mapPersonalDetailsToApi(formData.primaryApplicant.personal),
      employmentDetails: formData.primaryApplicant.employment,
      incomeDetails: formData.primaryApplicant.income ? mapIncomeDetailsToApi(formData.primaryApplicant.income) : undefined,
      expensesDetails: formData.primaryApplicant.expenses ? mapExpensesDetailsToApi(formData.primaryApplicant.expenses) : undefined,
      assets: formData.primaryApplicant.assets ? mapAssetsToApi(formData.primaryApplicant.assets) : undefined,
      liabilities: formData.primaryApplicant.liabilities,
      documents: formData.primaryApplicant.documents
    },
    
    // Secondary applicant data (if exists) with field mapping
    ...(formData.secondaryApplicant && {
      secondaryApplicant: {
        personalDetails: mapPersonalDetailsToApi(formData.secondaryApplicant.personal),
        employmentDetails: formData.secondaryApplicant.employment,
        incomeDetails: formData.secondaryApplicant.income ? mapIncomeDetailsToApi(formData.secondaryApplicant.income) : undefined,
        expensesDetails: formData.secondaryApplicant.expenses ? mapExpensesDetailsToApi(formData.secondaryApplicant.expenses) : undefined,
        assets: formData.secondaryApplicant.assets ? mapAssetsToApi(formData.secondaryApplicant.assets) : undefined,
        liabilities: formData.secondaryApplicant.liabilities,
        documents: formData.secondaryApplicant.documents
      }
    }),
    
    // Property and loan details
    propertyDetails: formData.primaryApplicant.property,
    loanDetails: formData.primaryApplicant.loan,
    
    // Consent
    consent: formData.consent,
    
    // Timestamps
    submittedAt: formData.metadata.submittedAt,
    updatedAt: formData.metadata.updatedAt || new Date().toISOString()
  };
}

/**
 * Maps API response data to Immobilien form format with proper field mapping
 * @param apiData The API response data
 * @returns Immobilien form data structure
 */
export function mapFromApiFormat(apiData: any): ImmobilienFormData {
  const metadata: FormMetadata = {
    formId: apiData.formId,
    formType: apiData.formType || 'immobilien',
    formName: apiData.formName || 'Immobilien Antrag',
    status: apiData.status || 'Draft',
    submittedAt: apiData.submittedAt,
    updatedAt: apiData.updatedAt,
    userId: apiData.userId
  };

  const primaryApplicant: BaseClientData & { property: PropertyDetails; loan: LoanDetails } = {
    personal: apiData.primaryApplicant?.personalDetails ? 
      mapPersonalDetailsFromApi(apiData.primaryApplicant.personalDetails) : 
      createEmptyPersonalDetails(),
    employment: apiData.primaryApplicant?.employmentDetails,
    income: apiData.primaryApplicant?.incomeDetails ? 
      mapIncomeDetailsFromApi(apiData.primaryApplicant.incomeDetails) : 
      undefined,
    expenses: apiData.primaryApplicant?.expensesDetails ? 
      mapExpensesDetailsFromApi(apiData.primaryApplicant.expensesDetails) : 
      undefined,
    assets: apiData.primaryApplicant?.assets ? 
      mapAssetsFromApi(apiData.primaryApplicant.assets) : 
      undefined,
    liabilities: apiData.primaryApplicant?.liabilities,
    documents: apiData.primaryApplicant?.documents || [],
    property: apiData.propertyDetails || {},
    loan: apiData.loanDetails || {}
  };

  const result: ImmobilienFormData = {
    metadata,
    primaryApplicant,
    consent: apiData.consent || createEmptyConsent()
  };

  // Add secondary applicant if it exists with field mapping
  if (apiData.secondaryApplicant) {
    result.secondaryApplicant = {
      personal: apiData.secondaryApplicant.personalDetails ? 
        mapPersonalDetailsFromApi(apiData.secondaryApplicant.personalDetails) : 
        createEmptyPersonalDetails(),
      employment: apiData.secondaryApplicant.employmentDetails,
      income: apiData.secondaryApplicant.incomeDetails ? 
        mapIncomeDetailsFromApi(apiData.secondaryApplicant.incomeDetails) : 
        undefined,
      expenses: apiData.secondaryApplicant.expensesDetails ? 
        mapExpensesDetailsFromApi(apiData.secondaryApplicant.expensesDetails) : 
        undefined,
      assets: apiData.secondaryApplicant.assets ? 
        mapAssetsFromApi(apiData.secondaryApplicant.assets) : 
        undefined,
      liabilities: apiData.secondaryApplicant.liabilities,
      documents: apiData.secondaryApplicant.documents || [],
      property: apiData.propertyDetails || {},
      loan: apiData.loanDetails || {}
    };
  }

  return result;
}

// Re-export the interfaces for backward compatibility
export type {
  PersonalDetails,
  EmploymentDetails,
  IncomeDetails,
  ExpensesDetails,
  Assets,
  Liabilities,
  PropertyDetails,
  LoanDetails,
  Consent,
  Document,
  FormMetadata,
  ImmobilienFormData
}; 