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
import { PropertyDetails } from '../immo-form-data';

interface PropertyDetailsFormProps {
  data: PropertyDetails;
  onChange: (data: Partial<PropertyDetails>) => void;
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({ data, onChange }) => {
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

  return (
    <Card variant="outlined">
      <CardHeader title={t('forms.immobilien.sections.propertyDetails.title')} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="property-type-label">
              {t('forms.immobilien.fields.property.propertyType')}
            </InputLabel>
            <Select
              labelId="property-type-label"
              name="propertyType"
              value={data.propertyType || ''}
              onChange={handleSelectChange}
              label={t('forms.immobilien.fields.property.propertyType')}
              required
            >
              <MenuItem value="singleFamilyHouse">{t('forms.immobilien.options.propertyType.singleFamilyHouse')}</MenuItem>
              <MenuItem value="apartment">{t('forms.immobilien.options.propertyType.apartment')}</MenuItem>
              <MenuItem value="townhouse">{t('forms.immobilien.options.propertyType.townhouse')}</MenuItem>
              <MenuItem value="duplex">{t('forms.immobilien.options.propertyType.duplex')}</MenuItem>
              <MenuItem value="multifamilyHouse">{t('forms.immobilien.options.propertyType.multifamilyHouse')}</MenuItem>
              <MenuItem value="vacationHome">{t('forms.immobilien.options.propertyType.vacationHome')}</MenuItem>
              <MenuItem value="land">{t('forms.immobilien.options.propertyType.land')}</MenuItem>
              <MenuItem value="commercial">{t('forms.immobilien.options.propertyType.commercial')}</MenuItem>
              <MenuItem value="other">{t('forms.immobilien.options.propertyType.other')}</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.property.propertyAddress')}
            name="propertyAddress"
            value={data.propertyAddress || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.property.propertyCity')}
            name="propertyCity"
            value={data.propertyCity || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.property.propertyPostalCode')}
            name="propertyPostalCode"
            value={data.propertyPostalCode || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            type="number"
            label={t('forms.immobilien.fields.property.propertyPrice')}
            name="propertyPrice"
            value={data.propertyPrice || 0}
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
            label={t('forms.immobilien.fields.property.constructionYear')}
            name="constructionYear"
            value={data.constructionYear || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              inputProps: { min: 1800, max: new Date().getFullYear() + 5 }
            }}
          />
          
          <TextField
            fullWidth
            required
            type="number"
            label={t('forms.immobilien.fields.property.livingArea')}
            name="livingArea"
            value={data.livingArea || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              endAdornment: <InputAdornment position="end">m²</InputAdornment>,
              inputProps: { min: 0 }
            }}
          />
          
          {data.propertyType === 'land' || data.propertyType === 'singleFamilyHouse' ? (
            <TextField
              fullWidth
              type="number"
              label={t('forms.immobilien.fields.property.landArea')}
              name="landArea"
              value={data.landArea || 0}
              onChange={handleTextChange}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                inputProps: { min: 0 }
              }}
            />
          ) : null}
          
          <TextField
            fullWidth
            required
            type="number"
            label={t('forms.immobilien.fields.property.numberOfRooms')}
            name="numberOfRooms"
            value={data.numberOfRooms || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              inputProps: { min: 0, step: 0.5 }
            }}
          />
          
          <TextField
            fullWidth
            required
            type="number"
            label={t('forms.immobilien.fields.property.numberOfBathrooms')}
            name="numberOfBathrooms"
            value={data.numberOfBathrooms || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{
              inputProps: { min: 0, step: 0.5 }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsForm; 