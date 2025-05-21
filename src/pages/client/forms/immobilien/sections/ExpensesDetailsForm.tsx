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
import { ExpensesDetails } from '../immo-form-data';

interface ExpensesDetailsFormProps {
  data: ExpensesDetails;
  onChange: (data: Partial<ExpensesDetails>) => void;
  title: string;
}

const ExpensesDetailsForm: React.FC<ExpensesDetailsFormProps> = ({ data, onChange, title }) => {
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
            label={t('forms.immobilien.fields.expenses.housingExpenses')}
            name="housingExpenses"
            value={data.housingExpenses || 0}
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
            label={t('forms.immobilien.fields.expenses.utilityBills')}
            name="utilityBills"
            value={data.utilityBills || 0}
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
            label={t('forms.immobilien.fields.expenses.insurancePayments')}
            name="insurancePayments"
            value={data.insurancePayments || 0}
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
            label={t('forms.immobilien.fields.expenses.transportationCosts')}
            name="transportationCosts"
            value={data.transportationCosts || 0}
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
            label={t('forms.immobilien.fields.expenses.livingExpenses')}
            name="livingExpenses"
            value={data.livingExpenses || 0}
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
            label={t('forms.immobilien.fields.expenses.otherExpenses')}
            name="otherExpenses"
            value={data.otherExpenses || 0}
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
            label={t('forms.immobilien.fields.expenses.coldRent')}
            name="coldRent"
            value={data.coldRent || 0}
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
            label={t('forms.immobilien.fields.expenses.electricity')}
            name="electricity"
            value={data.electricity || 0}
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
            label={t('forms.immobilien.fields.expenses.gas')}
            name="gas"
            value={data.gas || 0}
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
            label={t('forms.immobilien.fields.expenses.telecommunication')}
            name="telecommunication"
            value={data.telecommunication || 0}
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
            label={t('forms.immobilien.fields.expenses.accountMaintenanceFee')}
            name="accountMaintenanceFee"
            value={data.accountMaintenanceFee || 0}
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
            label={t('forms.immobilien.fields.expenses.alimony')}
            name="alimony"
            value={data.alimony || 0}
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
            label={t('forms.immobilien.fields.expenses.subscriptions')}
            name="subscriptions"
            value={data.subscriptions || 0}
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
              label={t('forms.immobilien.fields.expenses.personalId')}
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

export default ExpensesDetailsForm; 