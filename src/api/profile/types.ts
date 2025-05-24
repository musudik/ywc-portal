// Enums
export enum ApplicantType {
  PRIMARY_APPLICANT = 'PrimaryApplicant',
  CO_APPLICANT = 'CoApplicant'
}

export enum EmploymentType {
  EMPLOYED = 'Employed',
  SELF_EMPLOYED = 'SelfEmployed',
  UNEMPLOYED = 'Unemployed',
  RETIRED = 'Retired',
  STUDENT = 'Student',
  OTHER = 'Other'
}

export enum LoanType {
  PersonalLoan = 'PersonalLoan',
  HomeLoan = 'HomeLoan',
  CarLoan = 'CarLoan',
  BusinessLoan = 'BusinessLoan',
  EducationLoan = 'EducationLoan',
  OtherLoan = 'OtherLoan'
};

// Personal Details
export interface PersonalDetailsInput {
  id?: string;
  userId: string;
  coachId: string;
  applicantType: ApplicantType;
  firstName: string;
  lastName: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  birthDate: Date | string;
  birthPlace: string;
  maritalStatus: string;
  nationality: string;
  housing: string;
}

// Employment Details
export interface EmploymentDetailsInput {
  employmentId?: string;
  personalId: string;
  employmentType: EmploymentType;
  occupation: string;
  contractType: string;
  contractDuration: string;
  employerName: string;
  employedSince: Date | string;
}

// Income Details
export interface IncomeDetailsInput {
  incomeId?: string;
  personalId: string;
  grossIncome: number;
  netIncome: number;
  taxClass: string;
  taxId: string;
  numberOfSalaries: number;
  childBenefit: number;
  otherIncome: number;
  incomeTradeBusiness: number;
  incomeSelfEmployedWork: number;
  incomeSideJob: number;
}

// Expenses Details
export interface ExpensesDetailsInput {
  expensesId?: string;
  personalId: string;
  coldRent: number;
  electricity: number;
  livingExpenses: number;
  gas: number;
  telecommunication: number;
  accountMaintenanceFee: number;
  alimony: number;
  subscriptions: number;
  otherExpenses: number;
}

// Asset
export interface AssetInput {
  assetId?: string;
  personalId: string;
  realEstate: number;
  securities: number;
  bankDeposits: number;
  buildingSavings: number;
  insuranceValues: number;
  otherAssets: number;
}

// Liability
export interface LiabilityInput {
  liabilityId?: string;
  personalId: string;
  loanType: LoanType;
  loanBank?: string;
  loanAmount?: number;
  loanMonthlyRate?: number;
  loanInterest?: number;
}

// Goals and Wishes
export interface GoalsAndWishesInput {
  goalsAndWishesId?: string;
  personalId: string;
  retirementPlanning: string;
  capitalFormation: string;
  realEstateGoals: string;
  financing: string;
  protection: string;
  healthcareProvision: string;
  otherGoals: string;
}

// Risk Appetite
export interface RiskAppetiteInput {
  riskAppetiteId?: string;
  personalId: string;
  riskAppetite: string;
  investmentHorizon: string;
  knowledgeExperience: string;
  healthInsurance: string;
  healthInsuranceNumber: string;
  healthInsuranceProof: string;
}

// Profile completion sections
export interface ProfileCompletionSections {
  personalDetails: boolean;
  employment: boolean;
  income: boolean;
  expenses: boolean;
  assets: boolean;
  liabilities: boolean;
  goalsAndWishes: boolean;
  riskAppetite: boolean;
}

// Profile completion response
export interface ProfileCompletionResponse {
  isComplete: boolean;
  sections: ProfileCompletionSections;
  completionPercentage: number;
  personalId?: string;
} 