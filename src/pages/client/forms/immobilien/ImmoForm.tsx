import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Grid, Typography, Stepper, Step, StepLabel, Button, 
  FormControlLabel, Checkbox, CircularProgress, TextField, Alert, Snackbar, LinearProgress } from '@mui/material';
import { ArrowBack, ArrowForward, Save, Send } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAuth } from "../../../../contexts/AuthContext";

// Import FormLayout
import FormLayout from '../../../../components/layouts/FormLayout';
import { ImmobilienFormData } from '../../model/client';
import { createEmptyImmobilienForm, mapToApiFormat  } from './immo-form-data';

// Import mapping functions from the centralized model
import {
  mapPersonalDetailsFromApi,
  mapIncomeDetailsFromApi,
  mapExpensesDetailsFromApi,
  mapAssetsFromApi
} from '../../model/client';

// Import API functions
import { profileApi } from '../../../../api/profile';
import { createClientForm, updateClientForm, getClientFormById, getAllClientForms, getLatestClientFormByType } from '../../../../api/forms/client-forms';

// Import form sections
import PersonalDetailsForm from './sections/PersonalDetailsForm';
import EmploymentDetailsForm from './sections/EmploymentDetailsForm';
import IncomeDetailsForm from './sections/IncomeDetailsForm';
import ExpensesDetailsForm from './sections/ExpensesDetailsForm';
import AssetsForm from './sections/AssetsForm';
import LiabilitiesForm from './sections/LiabilitiesForm';
import PropertyDetailsForm from './sections/PropertyDetailsForm';
import LoanDetailsForm from './sections/LoanDetailsForm';
import ConsentForm from './sections/ConsentForm';
import DocumentsForm from './sections/DocumentsForm';

// Import custom styles
import './style.css';

// Step definitions
const steps = [
  'personal',
  'employment',
  'income',
  'expenses',
  'assets',
  'liabilities',
  'property',
  'loan',
  'consent',
  'documents'
];

// Define an interface for form metadata
interface FormMetadata {
  formId?: string;
  id?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

// Format all dates in form data to YYYY-MM-DD format
const formatDates = (data: any): any => {
  // Create a deep copy of the data
  const formattedData = JSON.parse(JSON.stringify(data));
  
  // Handle primary applicant dates
  if (formattedData.primaryApplicant?.personal?.dateOfBirth) {
    formattedData.primaryApplicant.personal.dateOfBirth = 
      formattedData.primaryApplicant.personal.dateOfBirth.split('T')[0];
  }
  
  if (formattedData.primaryApplicant?.employment?.employedSince) {
    formattedData.primaryApplicant.employment.employedSince = 
      typeof formattedData.primaryApplicant.employment.employedSince === 'string'
        ? formattedData.primaryApplicant.employment.employedSince.split('T')[0]
        : formattedData.primaryApplicant.employment.employedSince.toISOString().split('T')[0];
  }
  
  // Handle secondary applicant dates if exists
  if (formattedData.secondaryApplicant?.personal?.dateOfBirth) {
    formattedData.secondaryApplicant.personal.dateOfBirth = 
      formattedData.secondaryApplicant.personal.dateOfBirth.split('T')[0];
  }
  
  if (formattedData.secondaryApplicant?.employment?.employedSince) {
    formattedData.secondaryApplicant.employment.employedSince = 
      typeof formattedData.secondaryApplicant.employment.employedSince === 'string'
        ? formattedData.secondaryApplicant.employment.employedSince.split('T')[0]
        : formattedData.secondaryApplicant.employment.employedSince.toISOString().split('T')[0];
  }
  
  // Format consent date
  if (formattedData.consent?.date) {
    formattedData.consent.date = formattedData.consent.date.split('T')[0];
  }
  
  return formattedData;
};

const ImmoForm: React.FC = () => {
  const { user } = useAuth();
  const { id: formId } = useParams<{ id: string }>();
  const { id: id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<ImmobilienFormData>(createEmptyImmobilienForm());
  const [formMetadata, setFormMetadata] = useState<FormMetadata>({});
  const [singleApplicant, setSingleApplicant] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [secondaryPersonalId, setSecondaryPersonalId] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

    // Load form data if formId is provided
    useEffect(() => {
      const loadFormData = async () => {
        setLoading(true);
        console.log('Loading form - formId from URL:', formId);

        try {
          if (formId) {
            // Load existing form by its specific ID
            console.log('Loading existing form with ID:', formId);
            
            const response = await getClientFormById(formId);
            
            if (response.success && response.data) {
              console.log('Loaded form data from database:', response.data);
              
              // Handle different response structures - form data might be directly in response.data 
              // or nested in response.data.formData
              let formDataContent;
              
              if (response.data.formData) {
                // If the form data is nested in a formData property
                formDataContent = response.data.formData;
                console.log('Form data found in response.data.formData');
              } else {
                // If the form data is directly in the response
                formDataContent = response.data;
                console.log('Using form data directly from response.data');
              }
              
              // Store the form metadata separately to use when updating
              const metadata: FormMetadata = {
                formId: response.data.formId || response.data.id,
                userId: response.data.userId,
                createdAt: response.data.createdAt,
                updatedAt: response.data.updatedAt,
                status: response.data.status || 'Draft'
              };
              
              console.log('Form metadata:', metadata);
              setFormMetadata(metadata);
              
              // Set the form data
              setFormData(formDataContent);
              
              // Update single applicant status based on the presence of a secondary applicant
              setSingleApplicant(!formDataContent.secondaryApplicant);
            } else {
              throw new Error(response.message || 'Failed to load form data');
            }
          } else {
            // No specific form ID provided, try to load the latest Immobilien form for this user
            console.log('No form ID provided, checking for existing Immobilien forms');
            
            try {
              const allFormsResponse = await getAllClientForms();
              if (allFormsResponse.success && Array.isArray(allFormsResponse.data)) {
                // Find the latest Immobilien form for this user
                const immobilienForms = allFormsResponse.data.filter(form => form.formType === 'Immobilien');
                
                if (immobilienForms.length > 0) {
                  // Sort by updatedAt or createdAt to get the latest
                  const latestForm = immobilienForms.sort((a, b) => {
                    const dateA = new Date(a.updatedAt || a.createdAt || 0);
                    const dateB = new Date(b.updatedAt || b.createdAt || 0);
                    return dateB.getTime() - dateA.getTime();
                  })[0];
                  
                  console.log('Found existing Immobilien form, loading:', latestForm);
                  
                  // Set form metadata
                  const metadata: FormMetadata = {
                    formId: latestForm.formId || latestForm.id,
                    userId: latestForm.userId,
                    createdAt: latestForm.createdAt,
                    updatedAt: latestForm.updatedAt,
                    status: latestForm.status || 'Draft'
                  };
                  setFormMetadata(metadata);
                  
                  // Load form data
                  const formDataContent = latestForm.formData || latestForm;
                  setFormData(formDataContent);
                  setSingleApplicant(!formDataContent.secondaryApplicant);
                  
                  setLoading(false);
                  return;
                }
              }
            } catch (error) {
              console.log('No existing forms found, creating new form');
            }
            
            // Create new form with empty data and prepopulate from profile
            console.log('Creating new form and loading profile data for prepopulation');
            const newForm = createEmptyImmobilienForm();
            
            try {
              // Load personal details
              const personalDetails = await profileApi.getPersonalDetails();
              if (personalDetails) {
                newForm.primaryApplicant.personal = {
                  ...newForm.primaryApplicant.personal,
                  ...personalDetails,
                  applicantType: 'PrimaryApplicant',
                  personalId: personalDetails.id
                };
                
                // If we have personal ID, load other sections
                if (personalDetails.id) {
                  try {
                    // Load employment details
                    const employmentDetails = await profileApi.getEmploymentDetails(personalDetails.id);
                    if (employmentDetails) {
                      newForm.primaryApplicant.employment = {
                        ...newForm.primaryApplicant.employment,
                        ...employmentDetails,
                        personalId: personalDetails.id
                      };
                    }
                  } catch (e) {
                    console.log('Employment details not found, using defaults');
                  }
                  
                  try {
                    // Load income details using mapping function
                    const incomeDetails = await profileApi.getIncomeDetails(personalDetails.id);
                    if (incomeDetails) {
                      const mappedIncome = mapIncomeDetailsFromApi(incomeDetails);
                      newForm.primaryApplicant.income = {
                        ...newForm.primaryApplicant.income,
                        ...mappedIncome,
                        personalId: personalDetails.id
                      };
                    }
                  } catch (e) {
                    console.log('Income details not found, using defaults');
                  }
                  
                  try {
                    // Load expenses details using mapping function
                    const expensesDetails = await profileApi.getExpensesDetails(personalDetails.id);
                    if (expensesDetails) {
                      const mappedExpenses = mapExpensesDetailsFromApi(expensesDetails);
                      newForm.primaryApplicant.expenses = {
                        ...newForm.primaryApplicant.expenses,
                        ...mappedExpenses,
                        personalId: personalDetails.id
                      };
                    }
                  } catch (e) {
                    console.log('Expenses details not found, using defaults');
                  }
                  
                  try {
                    // Load assets using mapping function
                    const assets = await profileApi.getAssets(personalDetails.id);
                    if (assets) {
                      const mappedAssets = mapAssetsFromApi(assets);
                      newForm.primaryApplicant.assets = {
                        ...newForm.primaryApplicant.assets,
                        ...mappedAssets,
                        personalId: personalDetails.id
                      };
                    }
                  } catch (e) {
                    console.log('Assets not found, using defaults');
                  }
                  
                  try {
                    // Load liabilities
                    const liabilities = await profileApi.getLiabilities(personalDetails.id);
                    if (liabilities && liabilities.length > 0) {
                      newForm.primaryApplicant.liabilities = liabilities[0];
                    }
                  } catch (e) {
                    console.log('Liabilities not found, using defaults');
                  }
                }
              }
            } catch (e) {
              console.error('Error loading profile data for prepopulation:', e);
            }
            
            setFormData(newForm);
          }
        } catch (error) {
          console.error('Error loading form:', error);
          setError(t('forms.immobilien.errors.loadingFailed'));
        } finally {
          setLoading(false);
        }
      };
      
      loadFormData();
    }, [formId, t]);

  // Calculate progress
  useEffect(() => {
    // Calculate percentage based on completed sections
    const totalSteps = steps.length;
    const completedPercentage = ((activeStep + 1) / totalSteps) * 100;
    setProgress(completedPercentage);
  }, [activeStep]);

  // Load secondary applicant data
  const loadSecondaryApplicant = async () => {
    if (!secondaryPersonalId) {
      setError(t('forms.immobilien.errors.missingPersonalId'));
      return;
    }

    setLoading(true);
    try {
      // If we already have a formId, we should first check if the form already has a secondary applicant
      if (formId && formData.secondaryApplicant?.personal?.personalId === secondaryPersonalId) {
        // The secondary applicant is already loaded
        setSingleApplicant(false);
        setSuccess(t('forms.immobilien.success.secondaryApplicantAlreadyLoaded'));
        setLoading(false);
        return;
      }
      
      // Load personal details
      const personalDetails = await profileApi.getPersonalDetails(secondaryPersonalId);
      
      if (!personalDetails) {
        throw new Error('No personal details found');
      }
      
      // Create or update secondary applicant
      const updatedFormData = { ...formData };
      
      if (!updatedFormData.secondaryApplicant) {
        updatedFormData.secondaryApplicant = {
          personal: {
            ...createEmptyImmobilienForm().primaryApplicant.personal,
            applicantType: 'SecondaryApplicant',
            personalId: secondaryPersonalId
          },
          employment: {
            ...createEmptyImmobilienForm().primaryApplicant.employment,
            personalId: secondaryPersonalId
          },
          income: {
            ...createEmptyImmobilienForm().primaryApplicant.income,
            personalId: secondaryPersonalId
          },
          expenses: {
            ...createEmptyImmobilienForm().primaryApplicant.expenses,
            personalId: secondaryPersonalId
          },
          assets: {
            ...createEmptyImmobilienForm().primaryApplicant.assets,
            personalId: secondaryPersonalId
          },
          liabilities: {}
        };
      }
      
      // Update personal details
      updatedFormData.secondaryApplicant.personal = {
        ...updatedFormData.secondaryApplicant.personal,
        ...personalDetails,
        applicantType: 'SecondaryApplicant',
        personalId: secondaryPersonalId
      };
      
      // Try to load other sections
      try {
        const employmentDetails = await profileApi.getEmploymentDetails(secondaryPersonalId);
        updatedFormData.secondaryApplicant.employment = {
          ...updatedFormData.secondaryApplicant.employment,
          ...employmentDetails,
          personalId: secondaryPersonalId
        };
      } catch (e) {
        console.log('Secondary employment details not found, using defaults');
      }
      
      try {
        const incomeDetails = await profileApi.getIncomeDetails(secondaryPersonalId);
        updatedFormData.secondaryApplicant.income = {
          ...updatedFormData.secondaryApplicant.income,
          ...incomeDetails,
          personalId: secondaryPersonalId
        };
      } catch (e) {
        console.log('Secondary income details not found, using defaults');
      }
      
      try {
        const expensesDetails = await profileApi.getExpensesDetails(secondaryPersonalId);
        updatedFormData.secondaryApplicant.expenses = {
          ...updatedFormData.secondaryApplicant.expenses,
          ...expensesDetails,
          personalId: secondaryPersonalId
        };
      } catch (e) {
        console.log('Secondary expenses details not found, using defaults');
      }
      
      try {
        const assets = await profileApi.getAssets(secondaryPersonalId);
        updatedFormData.secondaryApplicant.assets = {
          ...updatedFormData.secondaryApplicant.assets,
          ...assets,
          personalId: secondaryPersonalId
        };
      } catch (e) {
        console.log('Secondary assets not found, using defaults');
      }
      
      try {
        const liabilities = await profileApi.getLiabilities(secondaryPersonalId);
        if (liabilities && liabilities.length > 0) {
          updatedFormData.secondaryApplicant.liabilities = liabilities[0];
        }
      } catch (e) {
        console.log('Secondary liabilities not found, using defaults');
      }
      
      // Save the updated form if we have a formId
      if (id) {
        const validationResult = validateFormData(updatedFormData, true);
        if (validationResult.isValid) {
          const sanitizedData = sanitizeFormData(updatedFormData);
          const apiData = mapToApiFormat(sanitizedData);
          
          const response = await updateClientForm(id, apiData);
          if (!response.success) {
            console.warn('Failed to update form with secondary applicant data');
          }
        }
      }
      
      setFormData(updatedFormData);
      setSingleApplicant(false);
      setSuccess(t('forms.immobilien.success.secondaryApplicantLoaded'));
    } catch (error) {
      console.error('Error loading secondary applicant:', error);
      setError(t('forms.immobilien.errors.loadingSecondaryFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Handle single applicant toggle
  const handleSingleApplicantToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSingleApplicant(event.target.checked);
    
    // If toggling to include a secondary applicant and none exists, create an empty one
    if (!event.target.checked && !formData.secondaryApplicant) {
      const updatedFormData = { ...formData };
      updatedFormData.secondaryApplicant = {
        personal: {
          ...createEmptyImmobilienForm().primaryApplicant.personal,
          applicantType: 'SecondaryApplicant'
        },
        employment: createEmptyImmobilienForm().primaryApplicant.employment,
        income: createEmptyImmobilienForm().primaryApplicant.income,
        expenses: createEmptyImmobilienForm().primaryApplicant.expenses,
        assets: createEmptyImmobilienForm().primaryApplicant.assets,
        liabilities: {}
      };
      setFormData(updatedFormData);
    }
  };

  // Handle next step
  const handleNext = () => {
    // Save current step data
    saveFormState(false);
    
    // Move to next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    // Save current step data
    saveFormState(false);
    
    // Move to previous step
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Update form data when fields change
  const handleFormChange = (section: string, subsection: string, applicantType: 'primaryApplicant' | 'secondaryApplicant', data: any) => {
    const updatedFormData = { ...formData };
    
    if (applicantType === 'primaryApplicant') {
      updatedFormData.primaryApplicant[section] = {
        ...updatedFormData.primaryApplicant[section],
        ...data
      };
    } else if (applicantType === 'secondaryApplicant' && updatedFormData.secondaryApplicant) {
      updatedFormData.secondaryApplicant[section] = {
        ...updatedFormData.secondaryApplicant[section],
        ...data
      };
    }
    
    setFormData(updatedFormData);
  };

  // Save form state to backend
  const saveFormState = async (showFeedback: boolean = true) => {
    setSaving(true);
    try {
      // Format all dates to YYYY-MM-DD format
      const formattedData = formatDates(formData);
      
      // If single applicant, remove secondary applicant data
      let formDataToSubmit = { ...formattedData };
      if (singleApplicant) {
        delete formDataToSubmit.secondaryApplicant;
      }
      
      // Ensure metadata exists
      if (!formDataToSubmit.metadata) {
        formDataToSubmit.metadata = {
          formType: 'Immobilien',
          formName: 'Immobilien Antrag',
          status: 'Draft',
          updatedAt: new Date().toISOString()
        };
        console.log('Created missing metadata field in formData');
      }
      
      // For drafts, use a more lenient validation
      const validationResult = validateFormData(formDataToSubmit, true);
      if (!validationResult.isValid) {
        console.error('Form validation failed:', validationResult.message);
        throw new Error(`Invalid form data: ${validationResult.message}`);
      }
      
      // Clean the data to remove any unnecessary fields
      let sanitizedData;
      try {
        sanitizedData = sanitizeFormData(formDataToSubmit);
      } catch (sanitizeError) {
        console.error('Error during form data sanitization:', sanitizeError);
        console.log('Form data that caused the error:', JSON.stringify(formDataToSubmit, null, 2));
        throw sanitizeError;
      }
      
      // Prepare API data with metadata
      const apiData = mapToApiFormat(sanitizedData);
      
      // When updating an existing form, we shouldn't include formId in the request body
      // as it's already in the URL path
      if (formId) {
        // Remove formId from apiData to avoid confusion
        delete apiData.formId;
        console.log(`Updating form with ID ${formId}, removed formId from request body`);
      } 
      else if (formMetadata.formId) {
        // For new forms where we have metadata but no URL formId yet
        apiData.formId = formMetadata.formId;
        console.log(`Using formId ${formMetadata.formId} from metadata for new form`);
      }
      
      // Include userId in all requests
      if (formMetadata.userId) {
        apiData.userId = formMetadata.userId;
        console.log(`Including userId ${formMetadata.userId} in request`);
      } else if (user?.id) {
        apiData.userId = user.id;
        console.log(`Including current user ID ${user.id} in request`);
      }
      
      // Create or update form
      let response;
      if (formId || formMetadata.formId) {
        // Update existing form using the correct form ID
        const actualFormId = formId || formMetadata.formId;
        console.log(`Updating existing form with ID: ${actualFormId}`);
        response = await updateClientForm(actualFormId, apiData);
      } else {
        // Create new form
        console.log('Creating new form');
        response = await createClientForm(apiData);
      }
      
      // If this is a new form, store the newly created form ID
      if (response.success && response.data) {
        const newFormId = response.data.id || response.data.formId;
        if (newFormId) {
          console.log(`New form created with ID: ${newFormId}`);
          setFormMetadata({
            ...formMetadata,
            formId: newFormId,
            userId: response.data.userId,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            status: response.data.status
          });
          window.history.replaceState(null, '', `/client/forms/immobilien/${newFormId}`);
        }
      }
      
      if (response.success) {
        if (showFeedback) {
          setSuccess(t('forms.immobilien.success.formSaved'));
        }
      } else {
        throw new Error(response.message || 'Failed to save form');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      setError(t('forms.immobilien.errors.savingFailed'));
    } finally {
      setSaving(false);
    }
  };

  // Submit the final form
  const submitForm = async () => {
    try {
      setSaving(true);
      
      // Format all dates to YYYY-MM-DD format
      const formattedData = formatDates(formData);
      
      // If single applicant, remove secondary applicant data
      let formDataToSubmit = { ...formattedData };
      if (singleApplicant) {
        delete formDataToSubmit.secondaryApplicant;
      }
      
      // Ensure metadata exists
      if (!formDataToSubmit.metadata) {
        formDataToSubmit.metadata = {
          formType: 'Immobilien',
          formName: 'Immobilien Antrag',
          status: 'Draft',
          updatedAt: new Date().toISOString()
        };
        console.log('Created missing metadata field in formData for submission');
      }
      
      // For submission, use strict validation
      const validationResult = validateFormData(formDataToSubmit, false);
      if (!validationResult.isValid) {
        console.error('Form validation failed during submission:', validationResult.message);
        throw new Error(`Invalid form data: ${validationResult.message}`);
      }
      
      // Clean the data to remove any unnecessary fields
      let sanitizedData;
      try {
        sanitizedData = sanitizeFormData(formDataToSubmit);
      } catch (sanitizeError) {
        console.error('Error during form data sanitization during submission:', sanitizeError);
        console.log('Form data that caused the error during submission:', JSON.stringify(formDataToSubmit, null, 2));
        throw sanitizeError;
      }
      
      // Update status to Submitted
      sanitizedData.metadata.status = 'Submitted';
      
      // Prepare API data with metadata
      const apiData = mapToApiFormat(sanitizedData);
      
      // When updating an existing form, we shouldn't include formId in the request body
      // as it's already in the URL path
      if (formId) {
        // Remove formId from apiData to avoid confusion
        delete apiData.formId;
        console.log(`Submitting form with ID ${formId}, removed formId from request body`);
      } 
      else if (formMetadata.formId) {
        // For new forms where we have metadata but no URL formId yet
        apiData.formId = formMetadata.formId;
        console.log(`Using formId ${formMetadata.formId} from metadata for submission`);
      }
      
      // Include userId in all requests
      if (formMetadata.userId) {
        apiData.userId = formMetadata.userId;
        console.log(`Including userId ${formMetadata.userId} in submission request`);
      }
      
      apiData.status = 'Submitted';
      
      // Create or update form
      let response;
      if (formId || formMetadata.formId) {
        // Update existing form using the correct form ID
        const actualFormId = formId || formMetadata.formId;
        console.log(`Updating existing form with ID: ${actualFormId}`);
        response = await updateClientForm(actualFormId, apiData);
      } else {
        // Create new form
        console.log('Creating new form');
        response = await createClientForm(apiData);
      }
      
      // If this is a new form, store the newly created form ID
      if (response.success && response.data) {
        const newFormId = response.data.id || response.data.formId;
        if (newFormId) {
          console.log(`New form submitted with ID: ${newFormId}`);
          setFormMetadata({
            ...formMetadata,
            formId: newFormId,
            userId: response.data.userId,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            status: response.data.status
          });
          window.history.replaceState(null, '', `/client/forms/immobilien/${newFormId}`);
        }
      }
      
      if (response.success) {
        setSuccess(t('forms.immobilien.success.formSubmitted'));
      } else {
        throw new Error(response.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(t('forms.immobilien.errors.submissionFailed'));
    } finally {
      setSaving(false);
    }
  };

  // Validate form data
  const validateFormData = (data: ImmobilienFormData, isDraft: boolean = false) => {
    // Always validate primary applicant basic info
    if (!data.primaryApplicant?.personal?.firstName) {
      return { isValid: false, message: 'Primary applicant first name is required' };
    }
    
    if (!data.primaryApplicant?.personal?.lastName) {
      return { isValid: false, message: 'Primary applicant last name is required' };
    }
    
    if (!data.primaryApplicant?.personal?.email) {
      return { isValid: false, message: 'Primary applicant email is required' };
    }
    
    // Basic validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.primaryApplicant.personal.email)) {
      return { isValid: false, message: 'Primary applicant email format is invalid' };
    }
    
    // Only check property and loan details if not a draft or if we're on/past those sections
    if (!isDraft) {
      // Check for required property details
      if (data.property) {
        if (!data.property.propertyAddress) {
          return { isValid: false, message: 'Property address is required' };
        }
        
        if (!data.property.propertyCity) {
          return { isValid: false, message: 'Property city is required' };
        }
      } else {
        return { isValid: false, message: 'Property details are required' };
      }
      
      // Check for loan details
      if (data.loan) {
        if (data.loan.loanAmount <= 0) {
          return { isValid: false, message: 'Loan amount must be greater than 0' };
        }
      } else {
        return { isValid: false, message: 'Loan details are required' };
      }
      
      // Check consent
      if (!data.consent?.agreed) {
        return { isValid: false, message: 'Consent must be agreed to' };
      }
    }
    
    return { isValid: true, message: '' };
  };

  // Sanitize form data to remove unwanted fields
  const sanitizeFormData = (formData: ImmobilienFormData): ImmobilienFormData => {
    const cleanedData = JSON.parse(JSON.stringify(formData));
    
    // Clean primary applicant data
    if (cleanedData.primaryApplicant) {
      // Remove any prototype methods/properties by recreating objects
      cleanedData.primaryApplicant.personal = {
        firstName: formData.primaryApplicant.personal.firstName || '',
        lastName: formData.primaryApplicant.personal.lastName || '',
        email: formData.primaryApplicant.personal.email || '',
        phoneNumber: formData.primaryApplicant.personal.phoneNumber || '',
        dateOfBirth: formData.primaryApplicant.personal.dateOfBirth || '',
        address: formData.primaryApplicant.personal.address || '',
        city: formData.primaryApplicant.personal.city || '',
        postalCode: formData.primaryApplicant.personal.postalCode || '',
        country: formData.primaryApplicant.personal.country || 'Germany',
        maritalStatus: formData.primaryApplicant.personal.maritalStatus || '',
        numberOfDependents: formData.primaryApplicant.personal.numberOfDependents || 0,
        nationality: formData.primaryApplicant.personal.nationality,
        birthPlace: formData.primaryApplicant.personal.birthPlace,
        identificationNumber: formData.primaryApplicant.personal.identificationNumber,
        coachId: formData.primaryApplicant.personal.coachId,
        applicantType: 'PrimaryApplicant',
        personalId: formData.primaryApplicant.personal.personalId
      };
      
      // Clean employment details
      cleanedData.primaryApplicant.employment = {
        employmentType: formData.primaryApplicant.employment.employmentType || '',
        occupation: formData.primaryApplicant.employment.occupation || '',
        employerName: formData.primaryApplicant.employment.employerName || '',
        contractType: formData.primaryApplicant.employment.contractType || '',
        contractDuration: formData.primaryApplicant.employment.contractDuration,
        employedSince: formData.primaryApplicant.employment.employedSince || '',
        personalId: formData.primaryApplicant.employment.personalId,
        employmentId: formData.primaryApplicant.employment.employmentId
      };
      
      // Clean income details - only include defined fields
      cleanedData.primaryApplicant.income = {
        monthlyNetIncome: Number(formData.primaryApplicant.income.monthlyNetIncome) || 0,
        annualGrossIncome: Number(formData.primaryApplicant.income.annualGrossIncome) || 0,
        personalId: formData.primaryApplicant.income.personalId,
        grossIncome: Number(formData.primaryApplicant.income.grossIncome) || 0,
        netIncome: Number(formData.primaryApplicant.income.netIncome) || 0,
        taxClass: formData.primaryApplicant.income.taxClass || '',
        taxId: formData.primaryApplicant.income.taxId || '',
        numberOfSalaries: Number(formData.primaryApplicant.income.numberOfSalaries) || 0,
        childBenefit: Number(formData.primaryApplicant.income.childBenefit) || 0,
        otherIncome: Number(formData.primaryApplicant.income.otherIncome) || 0,
        incomeTradeBusiness: Number(formData.primaryApplicant.income.incomeTradeBusiness) || 0,
        incomeSelfEmployedWork: Number(formData.primaryApplicant.income.incomeSelfEmployedWork) || 0,
        incomeSideJob: Number(formData.primaryApplicant.income.incomeSideJob) || 0,
        additionalIncomeSource: formData.primaryApplicant.income.additionalIncomeSource || '',
        rentalIncome: Number(formData.primaryApplicant.income.rentalIncome) || 0,
        investmentIncome: Number(formData.primaryApplicant.income.investmentIncome) || 0,
      };
      
      // Clean expenses details
      cleanedData.primaryApplicant.expenses = {
        housingExpenses: Number(formData.primaryApplicant.expenses.housingExpenses) || 0,
        utilityBills: Number(formData.primaryApplicant.expenses.utilityBills) || 0,
        insurancePayments: Number(formData.primaryApplicant.expenses.insurancePayments) || 0,
        transportationCosts: Number(formData.primaryApplicant.expenses.transportationCosts) || 0,
        livingExpenses: Number(formData.primaryApplicant.expenses.livingExpenses) || 0,
        personalId: formData.primaryApplicant.expenses.personalId
      };
      
      // Clean assets
      cleanedData.primaryApplicant.assets = {
        cashAndSavings: Number(formData.primaryApplicant.assets.cashAndSavings) || 0,
        personalId: formData.primaryApplicant.assets.personalId
      };
      
      // Add optional asset fields only if they exist and are not zero
      if (formData.primaryApplicant.assets.investments) {
        cleanedData.primaryApplicant.assets.investments = Number(formData.primaryApplicant.assets.investments);
      }
      
      // Clean liabilities - only include if we have data
      if (Object.keys(formData.primaryApplicant.liabilities).length > 0) {
        cleanedData.primaryApplicant.liabilities = {
          personalId: formData.primaryApplicant.liabilities.personalId
        };
        
        // Add optional liability fields only if they exist and are not zero
        if (formData.primaryApplicant.liabilities.mortgages) {
          cleanedData.primaryApplicant.liabilities.mortgages = Number(formData.primaryApplicant.liabilities.mortgages);
        }
        
        if (formData.primaryApplicant.liabilities.carLoans) {
          cleanedData.primaryApplicant.liabilities.carLoans = Number(formData.primaryApplicant.liabilities.carLoans);
        }
      }
    }
    
    // Similar cleaning for secondary applicant if it exists
    if (cleanedData.secondaryApplicant) {
      // Similar structure as primary applicant cleaning
      cleanedData.secondaryApplicant.personal = {
        firstName: formData.secondaryApplicant?.personal?.firstName || '',
        lastName: formData.secondaryApplicant?.personal?.lastName || '',
        email: formData.secondaryApplicant?.personal?.email || '',
        phoneNumber: formData.secondaryApplicant?.personal?.phoneNumber || '',
        dateOfBirth: formData.secondaryApplicant?.personal?.dateOfBirth || '',
        address: formData.secondaryApplicant?.personal?.address || '',
        city: formData.secondaryApplicant?.personal?.city || '',
        postalCode: formData.secondaryApplicant?.personal?.postalCode || '',
        country: formData.secondaryApplicant?.personal?.country || 'Germany',
        maritalStatus: formData.secondaryApplicant?.personal?.maritalStatus || '',
        numberOfDependents: formData.secondaryApplicant?.personal?.numberOfDependents || 0,
        nationality: formData.secondaryApplicant?.personal?.nationality,
        birthPlace: formData.secondaryApplicant?.personal?.birthPlace,
        identificationNumber: formData.secondaryApplicant?.personal?.identificationNumber,
        coachId: formData.secondaryApplicant?.personal?.coachId,
        applicantType: 'SecondaryApplicant',
        personalId: formData.secondaryApplicant?.personal?.personalId
      };
      
      // Clean other sections for secondary applicant (similar to primary)
      // Employment
      cleanedData.secondaryApplicant.employment = {
        employmentType: formData.secondaryApplicant?.employment?.employmentType || '',
        occupation: formData.secondaryApplicant?.employment?.occupation || '',
        employerName: formData.secondaryApplicant?.employment?.employerName || '',
        contractType: formData.secondaryApplicant?.employment?.contractType || '',
        contractDuration: formData.secondaryApplicant?.employment?.contractDuration,
        employedSince: formData.secondaryApplicant?.employment?.employedSince || '',
        personalId: formData.secondaryApplicant?.employment?.personalId,
        employmentId: formData.secondaryApplicant?.employment?.employmentId
      };
      
      // Income
      cleanedData.secondaryApplicant.income = {
        monthlyNetIncome: Number(formData.secondaryApplicant?.income?.monthlyNetIncome) || 0,
        annualGrossIncome: Number(formData.secondaryApplicant?.income?.annualGrossIncome) || 0,
        personalId: formData.secondaryApplicant?.income?.personalId
      };
      
      // Expenses
      cleanedData.secondaryApplicant.expenses = {
        housingExpenses: Number(formData.secondaryApplicant?.expenses?.housingExpenses) || 0,
        utilityBills: Number(formData.secondaryApplicant?.expenses?.utilityBills) || 0,
        insurancePayments: Number(formData.secondaryApplicant?.expenses?.insurancePayments) || 0,
        transportationCosts: Number(formData.secondaryApplicant?.expenses?.transportationCosts) || 0,
        livingExpenses: Number(formData.secondaryApplicant?.expenses?.livingExpenses) || 0,
        personalId: formData.secondaryApplicant?.expenses?.personalId
      };
      
      // Assets
      cleanedData.secondaryApplicant.assets = {
        cashAndSavings: Number(formData.secondaryApplicant?.assets?.cashAndSavings) || 0,
        personalId: formData.secondaryApplicant?.assets?.personalId
      };
      
      // Liabilities - only include if we have data
      if (formData.secondaryApplicant?.liabilities && Object.keys(formData.secondaryApplicant.liabilities).length > 0) {
        cleanedData.secondaryApplicant.liabilities = {
          personalId: formData.secondaryApplicant?.liabilities?.personalId
        };
        
        if (formData.secondaryApplicant?.liabilities?.mortgages) {
          cleanedData.secondaryApplicant.liabilities.mortgages = Number(formData.secondaryApplicant?.liabilities?.mortgages);
        }
      }
    }
    
    // Clean property data
    if (cleanedData.property) {
      cleanedData.property = {
        propertyType: formData.property.propertyType || '',
        propertyAddress: formData.property.propertyAddress || '',
        propertyCity: formData.property.propertyCity || '',
        propertyPostalCode: formData.property.propertyPostalCode || '',
        propertyPrice: Number(formData.property.propertyPrice) || 0,
        constructionYear: Number(formData.property.constructionYear) || 0,
        livingArea: Number(formData.property.livingArea) || 0,
        landArea: formData.property.landArea ? Number(formData.property.landArea) : undefined,
        numberOfRooms: Number(formData.property.numberOfRooms) || 0,
        numberOfBathrooms: Number(formData.property.numberOfBathrooms) || 0
      };
    }
    
    // Clean loan data
    if (cleanedData.loan) {
      cleanedData.loan = {
        loanAmount: Number(formData.loan.loanAmount) || 0,
        downPayment: Number(formData.loan.downPayment) || 0,
        loanTerm: formData.loan.loanTerm || '',
        interestRateType: formData.loan.interestRateType || 'Fixed',
        fixedRatePeriod: formData.loan.fixedRatePeriod,
        propertyPurpose: formData.loan.propertyPurpose || 'Primary Residence'
      };
    }
    
    // Clean consent data
    if (cleanedData.consent) {
      cleanedData.consent = {
        signature: formData.consent.signature || '',
        signatureImageURL: formData.consent.signatureImageURL || '',
        date: formData.consent.date || '',
        place: formData.consent.place || '',
        agreed: Boolean(formData.consent.agreed),
        consentType: formData.consent.consentType,
        consentText: formData.consent.consentText,
        location: formData.consent.location
      };
    }
    
    // Handle documents array - preserve only the necessary fields
    if (cleanedData.documents && Array.isArray(cleanedData.documents)) {
      cleanedData.documents = formData.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        required: Boolean(doc.required),
        fileUrl: doc.fileUrl,
        uploadDate: doc.uploadDate,
        status: doc.status || 'Pending'
      }));
    }
    
    // Clean metadata
    cleanedData.metadata = {
      formType: formData.metadata?.formType || 'Immobilien',
      formName: formData.metadata?.formName || 'Immobilien Antrag',
      status: formData.metadata?.status || 'Draft',
      formId: formData.metadata?.formId,
      submittedAt: formData.metadata?.submittedAt,
      updatedAt: new Date().toISOString(),
      userId: formData.metadata?.userId
    };
    
    return cleanedData;
  };

  // Close error alert
  const handleCloseError = () => {
    setError(null);
  };

  // Close success alert
  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  // Get current step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Personal Details
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4
          }}>
            <Box sx={{ 
              flex: '1 1 100%', 
              maxWidth: { xs: '100%', md: singleApplicant ? '100%' : '48%' }
            }}>
              <PersonalDetailsForm
                data={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  phoneNumber: '',
                  dateOfBirth: '',
                  address: '',
                  city: '',
                  postalCode: '',
                  country: 'Germany',
                  maritalStatus: '',
                  numberOfDependents: 0,
                  applicantType: 'PrimaryApplicant',
                  ...(formData.primaryApplicant?.personal || {})
                }}
                onChange={(data) => handleFormChange('personal', '', 'primary', data)}
                title={t('forms.immobilien.sections.personalDetails.primaryTitle')}
              />
            </Box>
            {!singleApplicant && (
              <Box sx={{ 
                flex: '1 1 100%', 
                maxWidth: { xs: '100%', md: '48%' } 
              }}>
                <PersonalDetailsForm
                  data={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    dateOfBirth: '',
                    address: '',
                    city: '',
                    postalCode: '',
                    country: 'Germany',
                    maritalStatus: '',
                    numberOfDependents: 0,
                    applicantType: 'SecondaryApplicant',
                    ...(formData.secondaryApplicant?.personal || {})
                  }}
                  onChange={(data) => handleFormChange('personal', '', 'secondary', data)}
                  title={t('forms.immobilien.sections.personalDetails.secondaryTitle')}
                />
              </Box>
            )}
          </Box>
        );
      case 1: // Employment Details
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4
          }}>
            <Box sx={{ 
              flex: '1 1 100%', 
              maxWidth: { xs: '100%', md: singleApplicant ? '100%' : '48%' }
            }}>
              <EmploymentDetailsForm
                data={{
                  employmentType: 'employed',
                  occupation: '',
                  employerName: '',
                  contractType: '',
                  employedSince: '',
                  ...(formData.primaryApplicant?.employment || {})
                }}
                onChange={(data) => handleFormChange('employment', '', 'primary', data)}
                title={t('forms.immobilien.sections.employmentDetails.primaryTitle')}
              />
            </Box>
            {!singleApplicant && (
              <Box sx={{ 
                flex: '1 1 100%', 
                maxWidth: { xs: '100%', md: '48%' } 
              }}>
                <EmploymentDetailsForm
                  data={{
                    employmentType: 'employed',
                    occupation: '',
                    employerName: '',
                    contractType: '',
                    employedSince: '',
                    ...(formData.secondaryApplicant?.employment || {})
                  }}
                  onChange={(data) => handleFormChange('employment', '', 'secondary', data)}
                  title={t('forms.immobilien.sections.employmentDetails.secondaryTitle')}
                />
              </Box>
            )}
          </Box>
        );
      case 2: // Income Details
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4
          }}>
            <Box sx={{ 
              flex: '1 1 100%', 
              maxWidth: { xs: '100%', md: singleApplicant ? '100%' : '48%' }
            }}>
              <IncomeDetailsForm
                data={{
                  monthlyNetIncome: 0,
                  annualGrossIncome: 0,
                  ...(formData.primaryApplicant?.income || {})
                }}
                onChange={(data) => handleFormChange('income', '', 'primary', data)}
                title={t('forms.immobilien.sections.incomeDetails.primaryTitle')}
              />
            </Box>
            {!singleApplicant && (
              <Box sx={{ 
                flex: '1 1 100%', 
                maxWidth: { xs: '100%', md: '48%' } 
              }}>
                <IncomeDetailsForm
                  data={{
                    monthlyNetIncome: 0,
                    annualGrossIncome: 0,
                    ...(formData.secondaryApplicant?.income || {})
                  }}
                  onChange={(data) => handleFormChange('income', '', 'secondary', data)}
                  title={t('forms.immobilien.sections.incomeDetails.secondaryTitle')}
                />
              </Box>
            )}
          </Box>
        );
      case 3: // Expenses Details
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4
          }}>
            <Box sx={{ 
              flex: '1 1 100%', 
              maxWidth: { xs: '100%', md: singleApplicant ? '100%' : '48%' }
            }}>
              <ExpensesDetailsForm
                data={{
                  housingExpenses: 0,
                  utilityBills: 0,
                  insurancePayments: 0,
                  transportationCosts: 0,
                  livingExpenses: 0,
                  ...(formData.primaryApplicant?.expenses || {})
                }}
                onChange={(data) => handleFormChange('expenses', '', 'primary', data)}
                title={t('forms.immobilien.sections.expensesDetails.primaryTitle')}
              />
            </Box>
            {!singleApplicant && (
              <Box sx={{ 
                flex: '1 1 100%', 
                maxWidth: { xs: '100%', md: '48%' } 
              }}>
                <ExpensesDetailsForm
                  data={{
                    housingExpenses: 0,
                    utilityBills: 0,
                    insurancePayments: 0,
                    transportationCosts: 0,
                    livingExpenses: 0,
                    ...(formData.secondaryApplicant?.expenses || {})
                  }}
                  onChange={(data) => handleFormChange('expenses', '', 'secondary', data)}
                  title={t('forms.immobilien.sections.expensesDetails.secondaryTitle')}
                />
              </Box>
            )}
          </Box>
        );
      case 4: // Assets
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4
          }}>
            <Box sx={{ 
              flex: '1 1 100%', 
              maxWidth: { xs: '100%', md: singleApplicant ? '100%' : '48%' }
            }}>
              <AssetsForm
                data={{
                  cashAndSavings: 0,
                  ...(formData.primaryApplicant?.assets || {})
                }}
                onChange={(data) => handleFormChange('assets', '', 'primary', data)}
                title={t('forms.immobilien.sections.assets.primaryTitle')}
              />
            </Box>
            {!singleApplicant && (
              <Box sx={{ 
                flex: '1 1 100%', 
                maxWidth: { xs: '100%', md: '48%' } 
              }}>
                <AssetsForm
                  data={{
                    cashAndSavings: 0,
                    ...(formData.secondaryApplicant?.assets || {})
                  }}
                  onChange={(data) => handleFormChange('assets', '', 'secondary', data)}
                  title={t('forms.immobilien.sections.assets.secondaryTitle')}
                />
              </Box>
            )}
          </Box>
        );
      case 5: // Liabilities
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4
          }}>
            <Box sx={{ 
              flex: '1 1 100%', 
              maxWidth: { xs: '100%', md: singleApplicant ? '100%' : '48%' }
            }}>
              <LiabilitiesForm
                data={formData.primaryApplicant?.liabilities || {}}
                onChange={(data) => handleFormChange('liabilities', '', 'primary', data)}
                title={t('forms.immobilien.sections.liabilities.primaryTitle')}
              />
            </Box>
            {!singleApplicant && (
              <Box sx={{ 
                flex: '1 1 100%', 
                maxWidth: { xs: '100%', md: '48%' } 
              }}>
                <LiabilitiesForm
                  data={formData.secondaryApplicant?.liabilities || {}}
                  onChange={(data) => handleFormChange('liabilities', '', 'secondary', data)}
                  title={t('forms.immobilien.sections.liabilities.secondaryTitle')}
                />
              </Box>
            )}
          </Box>
        );
      case 6: // Property Details
        return (
          <PropertyDetailsForm
            data={formData.property || {}}
            onChange={(data) => {
              setFormData({
                ...formData,
                property: {
                  ...formData.property,
                  ...data
                }
              });
            }}
          />
        );
      case 7: // Loan Details
        return (
          <LoanDetailsForm
            data={formData.loan || {}}
            onChange={(data) => {
              setFormData({
                ...formData,
                loan: {
                  ...formData.loan,
                  ...data
                }
              });
            }}
          />
        );
      case 8: // Consent
        return (
          <ConsentForm
            data={formData.consent || {}}
            onChange={(data) => {
              setFormData({
                ...formData,
                consent: {
                  ...formData.consent,
                  ...data
                }
              });
            }}
          />
        );
      case 9: // Documents
        return (
          <DocumentsForm
            data={formData.documents || []}
            onChange={(data) => {
              setFormData({
                ...formData,
                documents: data
              });
            }}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormLayout title={t('forms.immobilien.title')}>
      {/* Progress indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 5,
              backgroundColor: 'rgba(29, 185, 84, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1DB954'
              }
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
      
      {/* Form control */}
      <Box className="immo-form-header" sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        <Box>
          <FormControlLabel
            control={
              <Checkbox 
                checked={singleApplicant} 
                onChange={handleSingleApplicantToggle}
                name="singleApplicant"
              />
            }
            label={t('forms.immobilien.singleApplicant')}
          />
          
          {!singleApplicant && (
            <Box className="immo-secondary-controls" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <TextField
                label={t('forms.immobilien.secondaryPersonalId')}
                value={secondaryPersonalId}
                onChange={(e) => setSecondaryPersonalId(e.target.value)}
                size="small"
                sx={{ mr: 1 }}
              />
              <Button 
                variant="outlined" 
                onClick={loadSecondaryApplicant}
                disabled={loading || !secondaryPersonalId}
              >
                {t('forms.immobilien.loadSecondary')}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Stepper */}
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        sx={{ 
          mb: 4,
          '& .MuiStepIcon-root.MuiStepIcon-active': {
            color: '#1DB954',
          },
          '& .MuiStepIcon-root.MuiStepIcon-completed': {
            color: '#1DB954',
          },
          '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
            marginTop: 1
          },
          '& .MuiStepConnector-line': {
            borderTopWidth: 3
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: '#1DB954'
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: '#1DB954'
          }
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{t(`forms.immobilien.steps.${label}`)}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Form content */}
      <Card className="immo-card" variant="outlined" sx={{ mb: 3 }}>
        <CardContent className="immo-form-section">
          {getStepContent(activeStep)}
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <Box className="immo-form-navigation">
        <Button
          variant="outlined"
          onClick={handleBack}
          startIcon={<ArrowBack />}
          disabled={activeStep === 0}
          sx={{ borderColor: '#1DB954', color: '#1DB954', '&:hover': { borderColor: '#16953F', backgroundColor: 'rgba(29, 185, 84, 0.1)' } }}
        >
          {t('forms.immobilien.navigation.back')}
        </Button>
        
        <Box className="immo-form-navigation-right">
          <Button
            variant="outlined"
            onClick={() => saveFormState(true)}
            startIcon={<Save />}
            disabled={saving}
            sx={{ mr: 2, borderColor: '#1DB954', color: '#1DB954', '&:hover': { borderColor: '#16953F', backgroundColor: 'rgba(29, 185, 84, 0.1)' } }}
          >
            {saving ? <CircularProgress size={24} color="success" /> : t('forms.immobilien.navigation.save')}
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="success"
              onClick={submitForm}
              startIcon={<Send />}
              disabled={saving}
              sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#16953F' } }}
            >
              {saving ? <CircularProgress size={24} /> : t('forms.immobilien.navigation.submit')}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleNext}
              endIcon={<ArrowForward />}
              sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#16953F' } }}
            >
              {t('forms.immobilien.navigation.next')}
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Errors and success messages */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </FormLayout>
  );
};

export default ImmoForm; 