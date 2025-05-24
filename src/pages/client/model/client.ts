/**
 * Unified Client Data Structure
 * Central source of truth for all client-related interfaces and types
 */

// =====================================
// CORE DATA INTERFACES
// =====================================

// Personal Details Section - Unified and consistent field names
export interface PersonalDetails {
  // System fields
  personalId?: string; // Filled by the system
  coachId?: string;
  applicantType: 'PrimaryApplicant' | 'SecondaryApplicant';
  
  // Personal information - standardized field names
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Standardized from phoneNumber
  dateOfBirth: string; // Standardized from birthDate
  birthPlace?: string;
  
  // Address information
  address: string; // Standardized from streetAddress
  city: string;
  postalCode: string;
  country: string;
  
  // Additional personal details
  maritalStatus: string;
  nationality?: string;
  numberOfDependents?: number;
  identificationNumber?: string;
  housing?: string; // owned, rented, livingWithParents, other
}

// Employment Details Section
export interface EmploymentDetails {
  personalId?: string;  // Reference to the person
  employmentId?: string; // Filled by the system
  employmentType: string; // Employed, SelfEmployed, Unemployed, Retired, Student, Other
  occupation: string;
  employerName: string;
  contractType: string; // permanent, temporary, partTime, fullTime, freelance, other
  contractDuration?: string;
  employedSince: string | Date;
}

// Income Details Section
export interface IncomeDetails {
  personalId?: string;  // Reference to the person
  incomeId?: string; // Filled by the system
  
  // Primary income
  monthlyNetIncome: number;
  annualGrossIncome: number;
  
  // Additional income sources
  additionalIncome?: number;
  additionalIncomeSource?: string;
  rentalIncome?: number;
  investmentIncome?: number;
  
  // Tax and salary information
  taxClass?: string;
  taxId?: string;
  numberOfSalaries?: number;
  
  // Benefits and other income
  childBenefit?: number;
  incomeTradeBusiness?: number;
  incomeSelfEmployedWork?: number;
  incomeSideJob?: number;
 
}

// Expenses Details Section
export interface ExpensesDetails {
  personalId?: string;  // Reference to the person
  expensesId?: string; // Filled by the system
  
  // Housing expenses
  housingExpenses: number;
  coldRent?: number;
  
  // Utilities
  utilityBills: number;
  electricity?: number;
  gas?: number;
  telecommunication?: number;
  
  // Other regular expenses
  insurancePayments: number;
  transportationCosts: number;
  livingExpenses: number;
  accountMaintenanceFee?: number;
  alimony?: number;
  subscriptions?: number;
  otherExpenses?: number;
}

// Assets Section
export interface Assets {
  personalId?: string;  // Reference to the person
  assetId?: string; // Filled by the system
  
  // Liquid assets
  cashAndSavings: number;
  bankDeposits?: number;
  
  // Investments
  investments?: number;
  securities?: number;
  buildingSavings?: number;
  insuranceValues?: number;
  
  // Physical assets
  realEstateProperties?: number;
  vehicles?: number;
  otherAssets?: number;
}

// Liabilities Section
export interface Liabilities {
  personalId?: string;  // Reference to the person
  liabilityId?: string; // Filled by the system
  
  // Loan types
  mortgages?: number;
  carLoans?: number;
  consumerLoans?: number;
  creditCardDebt?: number;
  studentLoans?: number;
  otherLiabilities?: number;
  
  // Loan details
  loanType?: string;
  loanBank?: string;
  loanAmount?: number;
  loanMonthlyRate?: number;
  loanInterest?: number;
}

// =====================================
// FORM-SPECIFIC INTERFACES
// =====================================

// Property Details Section (for real estate forms)
export interface PropertyDetails {
  propertyType: string;
  propertyAddress: string;
  propertyCity: string;
  propertyPostalCode: string;
  propertyPrice: number;
  constructionYear: number;
  livingArea: number;
  landArea?: number;
  numberOfRooms: number;
  numberOfBathrooms: number;
}

// Loan Details Section (for loan/mortgage forms)
export interface LoanDetails {
  loanAmount: number;
  downPayment: number;
  loanTerm: string; // in years
  interestRateType: 'Fixed' | 'Variable' | 'Mixed';
  fixedRatePeriod?: string; // in years
  propertyPurpose: 'Primary Residence' | 'Secondary/Vacation Home' | 'Investment Property';
}

// Goals and Wishes (for profile forms)
export interface GoalsAndWishes {
  personalId?: string;
  goalsId?: string;
  shortTermGoals?: string;
  longTermGoals?: string;
  financialGoals?: string;
  investmentGoals?: string;
  retirementPlans?: string;
  insuranceNeeds?: string;
  otherWishes?: string;
}

// Risk Appetite (for profile forms)
export interface RiskAppetite {
  personalId?: string;
  riskId?: string;
  riskTolerance: 'Low' | 'Medium' | 'High';
  investmentExperience: 'Beginner' | 'Intermediate' | 'Advanced';
  riskCapacity?: string;
  timeHorizon?: string;
  liquidityNeeds?: string;
}

// =====================================
// SHARED INTERFACES
// =====================================

// Consent Section - Common for all forms
export interface Consent {
  signature: string;
  signatureImageURL?: string;
  date: string;
  place: string;
  agreed: boolean;
  consentType?: string;
  consentText?: string;
  location?: string;
}

// Documents Section
export interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  fileUrl?: string;
  uploadDate?: string;
  status?: 'Pending' | 'Uploaded' | 'Verified' | 'Rejected';
}

// Form Metadata
export interface FormMetadata {
  formId?: string; // Generated by system
  formType: string;
  formName: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  submittedAt?: string;
  updatedAt?: string;
  userId?: string;
}

// =====================================
// BASE FORM STRUCTURES
// =====================================

// Base client data that most forms will use
export interface BaseClientData {
  personal: PersonalDetails;
  employment?: EmploymentDetails;
  income?: IncomeDetails;
  expenses?: ExpensesDetails;
  assets?: Assets;
  liabilities?: Liabilities;
  documents: Document[];
}

// Base form structure that all forms extend
export interface BaseFormData {
  metadata: FormMetadata;
  consent: Consent;
}

// =====================================
// SPECIFIC FORM DATA STRUCTURES
// =====================================

// Immobilien Form Data Structure
export interface ImmobilienFormData extends BaseFormData {
  primaryApplicant: BaseClientData & {
    property: PropertyDetails;
    loan: LoanDetails;
  };
  secondaryApplicant?: BaseClientData & {
    property: PropertyDetails;
    loan: LoanDetails;
  };
}

// Profile Form Data Structure (complete client profile)
export interface ProfileFormData extends BaseFormData {
  client: BaseClientData & {
    goalsAndWishes?: GoalsAndWishes;
    riskAppetite?: RiskAppetite;
  };
}

// Health Insurance Form Data Structure
export interface HealthInsuranceFormData extends BaseFormData {
  client: {
    personal: PersonalDetails;
    employment?: EmploymentDetails;
    documents: Document[];
  };
}

// KFZ Form Data Structure
export interface KfzFormData extends BaseFormData {
  client: {
    personal: PersonalDetails;
    employment: EmploymentDetails;
    income: IncomeDetails;
    documents: Document[];
  };
}

// Utility Form Data Structure (Electricity, Gas, etc.)
export interface UtilityFormData extends BaseFormData {
  client: {
    personal: PersonalDetails;
    documents: Document[];
  };
}

// Sanuspay Form Data Structure
export interface SanuspayFormData extends BaseFormData {
  client: {
    personal: PersonalDetails;
    documents: Document[];
  };
}

// =====================================
// UTILITY TYPES AND FUNCTIONS
// =====================================

// Union type for all form types
export type FormType = 'immobilien' | 'privateHealthInsurance' | 'stateHealthInsurance' | 'kfz' | 'electricity' | 'gas' | 'sanuspay' | 'profile';

// Union type for all form data structures
export type AnyFormData = ImmobilienFormData | ProfileFormData | HealthInsuranceFormData | KfzFormData | UtilityFormData | SanuspayFormData;

// Utility type to extract client data from any form
export type ExtractClientData<T> = T extends { client: infer U } ? U : 
                                   T extends { primaryApplicant: infer V } ? V : never;

// =====================================
// HELPER FUNCTIONS
// =====================================

/**
 * Creates a default PersonalDetails object with empty values
 */
export function createEmptyPersonalDetails(): PersonalDetails {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Germany',
    maritalStatus: '',
    applicantType: 'PrimaryApplicant'
  };
}

/**
 * Creates a default FormMetadata object
 */
export function createFormMetadata(formType: FormType, formName: string, userId?: string): FormMetadata {
  return {
    formType,
    formName,
    status: 'Draft',
    updatedAt: new Date().toISOString(),
    userId
  };
}

/**
 * Creates a default Consent object
 */
export function createEmptyConsent(): Consent {
  return {
    signature: '',
    date: new Date().toISOString().split('T')[0],
    place: '',
    agreed: false
  };
}

/**
 * Validates required fields in PersonalDetails
 */
export function validatePersonalDetails(data: PersonalDetails): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.firstName.trim()) errors.push('First name is required');
  if (!data.lastName.trim()) errors.push('Last name is required');
  if (!data.email.trim()) errors.push('Email is required');
  if (!data.phone.trim()) errors.push('Phone is required');
  if (!data.dateOfBirth.trim()) errors.push('Date of birth is required');
  if (!data.address.trim()) errors.push('Address is required');
  if (!data.city.trim()) errors.push('City is required');
  if (!data.postalCode.trim()) errors.push('Postal code is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// =====================================
// FIELD MAPPING FUNCTIONS
// =====================================

/**
 * Maps unified PersonalDetails to API format (legacy field names)
 * This maintains backward compatibility with existing APIs
 */
export function mapPersonalDetailsToApi(data: PersonalDetails): any {
  return {
    ...data,
    streetAddress: data.address, // Map address -> streetAddress for API
    phoneNumber: data.phone,      // Map phone -> phoneNumber for API
    birthDate: data.dateOfBirth   // Map dateOfBirth -> birthDate for API
  };
}

/**
 * Maps API response to unified PersonalDetails format
 * This converts legacy field names to standardized ones
 */
export function mapPersonalDetailsFromApi(apiData: any): PersonalDetails {
  return {
    ...apiData,
    address: apiData.streetAddress || apiData.address, // Map streetAddress -> address
    phone: apiData.phoneNumber || apiData.phone,       // Map phoneNumber -> phone
    dateOfBirth: apiData.birthDate || apiData.dateOfBirth // Map birthDate -> dateOfBirth
  };
}

/**
 * Maps unified IncomeDetails to API format
 */
export function mapIncomeDetailsToApi(data: IncomeDetails): any {
  return {
    personalId: data.personalId,
    incomeId: data.incomeId,
    grossIncome: data.annualGrossIncome,
    netIncome: data.monthlyNetIncome,
    otherIncome: data.additionalIncome || 0,
    taxClass: data.taxClass || '',
    taxId: data.taxId || '',
    numberOfSalaries: data.numberOfSalaries || 12,
    childBenefit: data.childBenefit || 0,
    incomeTradeBusiness: data.incomeTradeBusiness || 0,
    incomeSelfEmployedWork: data.incomeSelfEmployedWork || 0,
    incomeSideJob: data.incomeSideJob || 0
    // Note: API doesn't support rentalIncome, investmentIncome, additionalIncomeSource
  };
}

/**
 * Maps API response to unified IncomeDetails format
 */
export function mapIncomeDetailsFromApi(apiData: any): IncomeDetails {
  return {
    personalId: apiData.personalId,
    incomeId: apiData.incomeId,
    monthlyNetIncome: apiData.netIncome || 0,
    annualGrossIncome: apiData.grossIncome || 0,
    additionalIncome: apiData.otherIncome || 0,
    additionalIncomeSource: '', // Not supported by API
    rentalIncome: 0, // Not supported by API
    investmentIncome: 0, // Not supported by API
    taxClass: apiData.taxClass || '',
    taxId: apiData.taxId || '',
    numberOfSalaries: apiData.numberOfSalaries || 12,
    childBenefit: apiData.childBenefit || 0,
    incomeTradeBusiness: apiData.incomeTradeBusiness || 0,
    incomeSelfEmployedWork: apiData.incomeSelfEmployedWork || 0,
    incomeSideJob: apiData.incomeSideJob || 0
  };
}

/**
 * Maps unified ExpensesDetails to API format
 */
export function mapExpensesDetailsToApi(data: ExpensesDetails): any {
  return {
    personalId: data.personalId,
    expensesId: data.expensesId,
    coldRent: data.housingExpenses || data.coldRent || 0,
    electricity: data.electricity || Math.round((data.utilityBills || 0) * 0.4),
    gas: data.gas || Math.round((data.utilityBills || 0) * 0.3),
    telecommunication: data.telecommunication || Math.round((data.utilityBills || 0) * 0.3),
    livingExpenses: data.livingExpenses || 0,
    accountMaintenanceFee: data.accountMaintenanceFee || 0,
    alimony: data.alimony || 0,
    subscriptions: data.subscriptions || 0,
    otherExpenses: data.otherExpenses || 0
    // Note: API doesn't support insurancePayments, transportationCosts
  };
}

/**
 * Maps API response to unified ExpensesDetails format
 */
export function mapExpensesDetailsFromApi(apiData: any): ExpensesDetails {
  return {
    personalId: apiData.personalId,
    expensesId: apiData.expensesId,
    housingExpenses: apiData.coldRent || 0,
    coldRent: apiData.coldRent || 0,
    utilityBills: (apiData.electricity || 0) + (apiData.gas || 0) + (apiData.telecommunication || 0),
    electricity: apiData.electricity || 0,
    gas: apiData.gas || 0,
    telecommunication: apiData.telecommunication || 0,
    insurancePayments: 0, // Not supported by API
    transportationCosts: 0, // Not supported by API
    livingExpenses: apiData.livingExpenses || 0,
    accountMaintenanceFee: apiData.accountMaintenanceFee || 0,
    alimony: apiData.alimony || 0,
    subscriptions: apiData.subscriptions || 0,
    otherExpenses: apiData.otherExpenses || 0
  };
}

/**
 * Maps unified Assets to API format
 */
export function mapAssetsToApi(data: Assets): any {
  return {
    personalId: data.personalId,
    assetId: data.assetId,
    realEstate: data.realEstateProperties || 0,
    securities: data.securities || 0,
    bankDeposits: data.cashAndSavings || data.bankDeposits || 0,
    buildingSavings: data.buildingSavings || 0,
    insuranceValues: data.insuranceValues || 0,
    otherAssets: data.otherAssets || 0
    // Note: API doesn't support investments, vehicles
  };
}

/**
 * Maps API response to unified Assets format
 */
export function mapAssetsFromApi(apiData: any): Assets {
  return {
    personalId: apiData.personalId,
    assetId: apiData.assetId,
    cashAndSavings: apiData.bankDeposits || 0,
    bankDeposits: apiData.bankDeposits || 0,
    investments: 0, // Not supported by API
    securities: apiData.securities || 0,
    buildingSavings: apiData.buildingSavings || 0,
    insuranceValues: apiData.insuranceValues || 0,
    realEstateProperties: apiData.realEstate || 0,
    vehicles: 0, // Not supported by API
    otherAssets: apiData.otherAssets || 0
  };
}

// =====================================
// LEGACY COMPATIBILITY
// =====================================

// Legacy interface names for backward compatibility
export type PrivateHealthInsuranceFormData = HealthInsuranceFormData;
export type StateHealthInsuranceFormData = HealthInsuranceFormData;
export type ElectricityFormData = UtilityFormData;
export type GasFormData = UtilityFormData; 