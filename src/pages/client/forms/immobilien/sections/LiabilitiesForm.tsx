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
  SelectChangeEvent
} from '@mui/material';
import { Liabilities } from '../immo-form-data';

interface LiabilitiesFormProps {
  data: Liabilities;
  onChange: (data: Partial<Liabilities>) => void;
  title: string;
}

const LiabilitiesForm: React.FC<LiabilitiesFormProps> = ({ data, onChange, title }) => {
  const { t } = useTranslation();
  
  // Handle text field change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      // Convert numeric values
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

  return (
    <Card variant="outlined">
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="loan-type-label">
              {t('forms.immobilien.fields.liabilities.loanType')}
            </InputLabel>
            <Select
              labelId="loan-type-label"
              name="loanType"
              value={data.loanType || ''}
              onChange={handleSelectChange}
              label={t('forms.immobilien.fields.liabilities.loanType')}
            >
              <MenuItem value="mortgage">{t('forms.immobilien.options.loanType.mortgage')}</MenuItem>
              <MenuItem value="consumer">{t('forms.immobilien.options.loanType.consumer')}</MenuItem>
              <MenuItem value="car">{t('forms.immobilien.options.loanType.car')}</MenuItem>
              <MenuItem value="student">{t('forms.immobilien.options.loanType.student')}</MenuItem>
              <MenuItem value="creditCard">{t('forms.immobilien.options.loanType.creditCard')}</MenuItem>
              <MenuItem value="other">{t('forms.immobilien.options.loanType.other')}</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label={t('forms.immobilien.fields.liabilities.loanBank')}
            name="loanBank"
            value={data.loanBank || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.liabilities.loanAmount')}
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
            type="number"
            label={t('forms.immobilien.fields.liabilities.loanMonthlyRate')}
            name="loanMonthlyRate"
            value={data.loanMonthlyRate || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.liabilities.loanInterest')}
            name="loanInterest"
            value={data.loanInterest || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              inputProps: { min: 0, max: 100, step: 0.1 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.liabilities.mortgages')}
            name="mortgages"
            value={data.mortgages || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.liabilities.carLoans')}
            name="carLoans"
            value={data.carLoans || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.liabilities.consumerLoans')}
            name="consumerLoans"
            value={data.consumerLoans || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.liabilities.creditCardDebt')}
            name="creditCardDebt"
            value={data.creditCardDebt || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.liabilities.studentLoans')}
            name="studentLoans"
            value={data.studentLoans || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          <TextField
            fullWidth
            type="number"
            label={t('forms.immobilien.fields.liabilities.otherLiabilities')}
            name="otherLiabilities"
            value={data.otherLiabilities || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          {data.personalId && (
            <TextField
              fullWidth
              label={t('forms.immobilien.fields.liabilities.personalId')}
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

export default LiabilitiesForm; 