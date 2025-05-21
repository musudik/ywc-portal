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
import { Assets } from '../immo-form-data';

interface AssetsFormProps {
  data: Assets;
  onChange: (data: Partial<Assets>) => void;
  title: string;
}

const AssetsForm: React.FC<AssetsFormProps> = ({ data, onChange, title }) => {
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
            label={t('forms.immobilien.fields.assets.cashAndSavings')}
            name="cashAndSavings"
            value={data.cashAndSavings || 0}
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
            label={t('forms.immobilien.fields.assets.investments')}
            name="investments"
            value={data.investments || 0}
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
            label={t('forms.immobilien.fields.assets.realEstateProperties')}
            name="realEstateProperties"
            value={data.realEstateProperties || 0}
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
            label={t('forms.immobilien.fields.assets.vehicles')}
            name="vehicles"
            value={data.vehicles || 0}
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
            label={t('forms.immobilien.fields.assets.otherAssets')}
            name="otherAssets"
            value={data.otherAssets || 0}
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
            label={t('forms.immobilien.fields.assets.securities')}
            name="securities"
            value={data.securities || 0}
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
            label={t('forms.immobilien.fields.assets.bankDeposits')}
            name="bankDeposits"
            value={data.bankDeposits || 0}
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
            label={t('forms.immobilien.fields.assets.buildingSavings')}
            name="buildingSavings"
            value={data.buildingSavings || 0}
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
            label={t('forms.immobilien.fields.assets.insuranceValues')}
            name="insuranceValues"
            value={data.insuranceValues || 0}
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
              label={t('forms.immobilien.fields.assets.personalId')}
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

export default AssetsForm; 