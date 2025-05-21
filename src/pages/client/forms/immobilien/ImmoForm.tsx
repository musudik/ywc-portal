import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Grid, Typography, Stepper, Step, StepLabel, Button, 
  FormControlLabel, Checkbox, CircularProgress, TextField, Alert, Snackbar, LinearProgress } from '@mui/material';
import { ArrowBack, ArrowForward, Save, Send } from '@mui/icons-material';

// Import the form data types and functions
import { 
  ImmobilienFormData, 
  createEmptyImmobilienForm, 
  mapToApiFormat 
} from './immo-form-data';

// Import API functions
import { profileApi } from '../../../../api/profile';
import { createClientForm, updateClientForm, getClientFormById } from '../../../../api/forms/client-forms';

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

const ImmoForm: React.FC<{ formId?: string }> = ({ formId }) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<ImmobilienFormData>(createEmptyImmobilienForm());
  const [singleApplicant, setSingleApplicant] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [secondaryPersonalId, setSecondaryPersonalId] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  // Load form data if formId is provided
  useEffect(() => {
    const loadFormData = async () => {
      setLoading(true);
      try {
        if (formId) {
          // Load existing form
          const response = await getClientFormById(formId);
          if (response.success && response.data) {
            setFormData(response.data.formData);
            setSingleApplicant(!response.data.formData.secondaryApplicant);
          } else {
            throw new Error(response.message || 'Failed to load form data');
          }
        } else {
          // Create new form and load primary applicant data
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
                  newForm.primaryApplicant.employment = {
                    ...newForm.primaryApplicant.employment,
                    ...employmentDetails,
                    personalId: personalDetails.id
                  };
                } catch (e) {
                  console.log('Employment details not found, using defaults');
                }
                
                try {
                  // Load income details
                  const incomeDetails = await profileApi.getIncomeDetails(personalDetails.id);
                  newForm.primaryApplicant.income = {
                    ...newForm.primaryApplicant.income,
                    ...incomeDetails,
                    personalId: personalDetails.id
                  };
                } catch (e) {
                  console.log('Income details not found, using defaults');
                }
                
                try {
                  // Load expenses details
                  const expensesDetails = await profileApi.getExpensesDetails(personalDetails.id);
                  newForm.primaryApplicant.expenses = {
                    ...newForm.primaryApplicant.expenses,
                    ...expensesDetails,
                    personalId: personalDetails.id
                  };
                } catch (e) {
                  console.log('Expenses details not found, using defaults');
                }
                
                try {
                  // Load assets
                  const assets = await profileApi.getAssets(personalDetails.id);
                  newForm.primaryApplicant.assets = {
                    ...newForm.primaryApplicant.assets,
                    ...assets,
                    personalId: personalDetails.id
                  };
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
            console.error('Error loading profile data:', e);
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
  const handleFormChange = (section: string, subsection: string, applicantType: 'primary' | 'secondary', data: any) => {
    const updatedFormData = { ...formData };
    
    if (applicantType === 'primary') {
      updatedFormData.primaryApplicant[section] = {
        ...updatedFormData.primaryApplicant[section],
        ...data
      };
    } else if (applicantType === 'secondary' && updatedFormData.secondaryApplicant) {
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
      
      // Prepare API data
      const apiData = mapToApiFormat(formDataToSubmit);
      
      // Create or update form
      let response;
      if (formId) {
        response = await updateClientForm(formId, apiData);
      } else {
        response = await createClientForm(apiData);
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
      
      // Update status to Submitted
      formDataToSubmit.metadata.status = 'Submitted';
      
      // Prepare API data
      const apiData = mapToApiFormat(formDataToSubmit);
      
      // Create or update form
      let response;
      if (formId) {
        response = await updateClientForm(formId, apiData);
      } else {
        response = await createClientForm(apiData);
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
                data={formData.primaryApplicant.personal}
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
                    country: '',
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
                data={formData.primaryApplicant.employment}
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
                data={formData.primaryApplicant.income}
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
                data={formData.primaryApplicant.expenses}
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
                data={formData.primaryApplicant.assets}
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
                data={formData.primaryApplicant.liabilities}
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
            data={formData.property}
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
            data={formData.loan}
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
            data={formData.consent}
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
            data={formData.documents}
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
    <Box className="immo-form-container" sx={{ width: '100%', mb: 4 }}>
      {/* Progress indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
      
      {/* Form title and control */}
      <Box className="immo-form-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('forms.immobilien.title')}
        </Typography>
        
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
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
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
        >
          {t('forms.immobilien.navigation.back')}
        </Button>
        
        <Box className="immo-form-navigation-right">
          <Button
            variant="outlined"
            onClick={() => saveFormState(true)}
            startIcon={<Save />}
            disabled={saving}
            sx={{ mr: 2 }}
          >
            {saving ? <CircularProgress size={24} /> : t('forms.immobilien.navigation.save')}
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={submitForm}
              startIcon={<Send />}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : t('forms.immobilien.navigation.submit')}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              endIcon={<ArrowForward />}
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
    </Box>
  );
};

export default ImmoForm; 