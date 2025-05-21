import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  SelectChangeEvent
} from '@mui/material';
import { LoanDetails } from '../immo-form-data';

interface LoanDetailsFormProps {
  data: LoanDetails;
  onChange: (data: Partial<LoanDetails>) => void;
}

const LoanDetailsForm: React.FC<LoanDetailsFormProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  
  // Handle text field change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      // Convert numeric values for number fields
      if (e.target.type === 'number') {
        onChange({ [name]: parseFloat(value) || 0 });
      } else {
        onChange({ [name]: value });
      }
    }
  };
  
  // Handle select field change
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      onChange({ [name]: value });
    }
  };
  
  // Handle radio field change
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      onChange({ [name]: value });
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader title={t('forms.immobilien.sections.loanDetails.title')} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            required
            type="number"
            label={t('forms.immobilien.fields.loan.loanAmount')}
            name="loanAmount"
            value={data.loanAmount || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            required
            type="number"
            label={t('forms.immobilien.fields.loan.downPayment')}
            name="downPayment"
            value={data.downPayment || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="loan-term-label">
              {t('forms.immobilien.fields.loan.loanTerm')}
            </InputLabel>
            <Select
              labelId="loan-term-label"
              name="loanTerm"
              value={data.loanTerm || '30'}
              onChange={handleSelectChange}
              label={t('forms.immobilien.fields.loan.loanTerm')}
              required
            >
              <MenuItem value="5">{t('forms.immobilien.options.loanTerm.5years')}</MenuItem>
              <MenuItem value="10">{t('forms.immobilien.options.loanTerm.10years')}</MenuItem>
              <MenuItem value="15">{t('forms.immobilien.options.loanTerm.15years')}</MenuItem>
              <MenuItem value="20">{t('forms.immobilien.options.loanTerm.20years')}</MenuItem>
              <MenuItem value="25">{t('forms.immobilien.options.loanTerm.25years')}</MenuItem>
              <MenuItem value="30">{t('forms.immobilien.options.loanTerm.30years')}</MenuItem>
              <MenuItem value="35">{t('forms.immobilien.options.loanTerm.35years')}</MenuItem>
              <MenuItem value="40">{t('forms.immobilien.options.loanTerm.40years')}</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl component="fieldset" margin="normal">
            <InputLabel id="interest-type-label" sx={{ position: 'static', transform: 'none', mb: 1 }}>
              {t('forms.immobilien.fields.loan.interestRateType')}
            </InputLabel>
            <RadioGroup
              aria-labelledby="interest-type-label"
              name="interestRateType"
              value={data.interestRateType || 'Fixed'}
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel 
                value="Fixed" 
                control={<Radio />} 
                label={t('forms.immobilien.options.interestRateType.fixed')} 
              />
              <FormControlLabel 
                value="Variable" 
                control={<Radio />} 
                label={t('forms.immobilien.options.interestRateType.variable')} 
              />
              <FormControlLabel 
                value="Mixed" 
                control={<Radio />} 
                label={t('forms.immobilien.options.interestRateType.mixed')} 
              />
            </RadioGroup>
          </FormControl>
          
          {(data.interestRateType === 'Fixed' || data.interestRateType === 'Mixed') && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="fixed-rate-period-label">
                {t('forms.immobilien.fields.loan.fixedRatePeriod')}
              </InputLabel>
              <Select
                labelId="fixed-rate-period-label"
                name="fixedRatePeriod"
                value={data.fixedRatePeriod || '10'}
                onChange={handleSelectChange}
                label={t('forms.immobilien.fields.loan.fixedRatePeriod')}
              >
                <MenuItem value="1">{t('forms.immobilien.options.fixedRatePeriod.1year')}</MenuItem>
                <MenuItem value="2">{t('forms.immobilien.options.fixedRatePeriod.2years')}</MenuItem>
                <MenuItem value="3">{t('forms.immobilien.options.fixedRatePeriod.3years')}</MenuItem>
                <MenuItem value="5">{t('forms.immobilien.options.fixedRatePeriod.5years')}</MenuItem>
                <MenuItem value="7">{t('forms.immobilien.options.fixedRatePeriod.7years')}</MenuItem>
                <MenuItem value="10">{t('forms.immobilien.options.fixedRatePeriod.10years')}</MenuItem>
                <MenuItem value="15">{t('forms.immobilien.options.fixedRatePeriod.15years')}</MenuItem>
                <MenuItem value="20">{t('forms.immobilien.options.fixedRatePeriod.20years')}</MenuItem>
                <MenuItem value="25">{t('forms.immobilien.options.fixedRatePeriod.25years')}</MenuItem>
                <MenuItem value="30">{t('forms.immobilien.options.fixedRatePeriod.30years')}</MenuItem>
              </Select>
            </FormControl>
          )}
          
          <FormControl component="fieldset" margin="normal">
            <InputLabel id="property-purpose-label" sx={{ position: 'static', transform: 'none', mb: 1 }}>
              {t('forms.immobilien.fields.loan.propertyPurpose')}
            </InputLabel>
            <RadioGroup
              aria-labelledby="property-purpose-label"
              name="propertyPurpose"
              value={data.propertyPurpose || 'Primary Residence'}
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel 
                value="Primary Residence" 
                control={<Radio />} 
                label={t('forms.immobilien.options.propertyPurpose.primaryResidence')} 
              />
              <FormControlLabel 
                value="Secondary/Vacation Home" 
                control={<Radio />} 
                label={t('forms.immobilien.options.propertyPurpose.secondaryHome')} 
              />
              <FormControlLabel 
                value="Investment Property" 
                control={<Radio />} 
                label={t('forms.immobilien.options.propertyPurpose.investment')} 
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoanDetailsForm; 