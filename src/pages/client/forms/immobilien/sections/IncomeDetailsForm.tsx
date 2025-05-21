import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  TextField,
  InputAdornment
} from '@mui/material';
import { IncomeDetails } from '../immo-form-data';

interface IncomeDetailsFormProps {
  data: IncomeDetails;
  onChange: (data: Partial<IncomeDetails>) => void;
  title: string;
}

const IncomeDetailsForm: React.FC<IncomeDetailsFormProps> = ({ data, onChange, title }) => {
  const { t } = useTranslation();
  
  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert numeric values
    const parsedValue = e.target.type === 'number' ? parseFloat(value) || 0 : value;
    onChange({ [name]: parsedValue });
  };

  return (
    <Card variant="outlined">
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            required
            type="number"
            label={t('forms.immobilien.fields.income.monthlyNetIncome')}
            name="monthlyNetIncome"
            value={data.monthlyNetIncome || 0}
            onChange={handleChange}
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
            label={t('forms.immobilien.fields.income.annualGrossIncome')}
            name="annualGrossIncome"
            value={data.annualGrossIncome || 0}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.income.additionalIncome')}
            name="additionalIncome"
            value={data.additionalIncome || 0}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            label={t('forms.immobilien.fields.income.additionalIncomeSource')}
            name="additionalIncomeSource"
            value={data.additionalIncomeSource || ''}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.income.rentalIncome')}
            name="rentalIncome"
            value={data.rentalIncome || 0}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.income.investmentIncome')}
            name="investmentIncome"
            value={data.investmentIncome || 0}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            label={t('forms.immobilien.fields.income.taxClass')}
            name="taxClass"
            value={data.taxClass || ''}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label={t('forms.immobilien.fields.income.taxId')}
            name="taxId"
            value={data.taxId || ''}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.income.numberOfSalaries')}
            name="numberOfSalaries"
            value={data.numberOfSalaries || 12}
            onChange={handleChange}
            margin="normal"
            InputProps={{ inputProps: { min: 1, max: 14 } }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.income.childBenefit')}
            name="childBenefit"
            value={data.childBenefit || 0}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.income.incomeTradeBusiness')}
            name="incomeTradeBusiness"
            value={data.incomeTradeBusiness || 0}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.income.incomeSelfEmployedWork')}
            name="incomeSelfEmployedWork"
            value={data.incomeSelfEmployedWork || 0}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.income.incomeSideJob')}
            name="incomeSideJob"
            value={data.incomeSideJob || 0}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          {data.personalId && (
            <TextField
              fullWidth
              label={t('forms.immobilien.fields.income.personalId')}
              name="personalId"
              value={data.personalId}
              disabled
              margin="normal"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IncomeDetailsForm; 