import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box,
  TextField, 
  MenuItem, 
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { PersonalDetails } from '../immo-form-data';

interface PersonalDetailsFormProps {
  data: PersonalDetails;
  onChange: (data: Partial<PersonalDetails>) => void;
  title: string;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ data, onChange, title }) => {
  const { t } = useTranslation();
  
  // Handle text field change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      onChange({ [name]: value });
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
    <Card variant="outlined" className="immo-card">
      <CardHeader 
        title={
          <Typography variant="h6" className="form-section-title">
            {title}
          </Typography>
        } 
        sx={{
          backgroundColor: 'rgba(29, 185, 84, 0.05)',
          borderBottom: '1px solid rgba(29, 185, 84, 0.2)'
        }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.personal.firstName')}
            name="firstName"
            value={data.firstName || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.personal.lastName')}
            name="lastName"
            value={data.lastName || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.personal.email')}
            type="email"
            name="email"
            value={data.email || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.personal.phoneNumber')}
            name="phoneNumber"
            value={data.phoneNumber || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.personal.dateOfBirth')}
            type="date"
            name="dateOfBirth"
            value={data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''}
            onChange={handleTextChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="marital-status-label">
              {t('forms.immobilien.fields.personal.maritalStatus')}
            </InputLabel>
            <Select
              labelId="marital-status-label"
              name="maritalStatus"
              value={data.maritalStatus || ''}
              onChange={handleSelectChange}
              label={t('forms.immobilien.fields.personal.maritalStatus')}
            >
              <MenuItem value="single">{t('forms.immobilien.options.maritalStatus.single')}</MenuItem>
              <MenuItem value="married">{t('forms.immobilien.options.maritalStatus.married')}</MenuItem>
              <MenuItem value="divorced">{t('forms.immobilien.options.maritalStatus.divorced')}</MenuItem>
              <MenuItem value="widowed">{t('forms.immobilien.options.maritalStatus.widowed')}</MenuItem>
              <MenuItem value="separated">{t('forms.immobilien.options.maritalStatus.separated')}</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.personal.address')}
            name="address"
            value={data.address || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.personal.city')}
            name="city"
            value={data.city || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.personal.postalCode')}
            name="postalCode"
            value={data.postalCode || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="country-label">
              {t('forms.immobilien.fields.personal.country')}
            </InputLabel>
            <Select
              labelId="country-label"
              name="country"
              value={data.country || 'Germany'}
              onChange={handleSelectChange}
              label={t('forms.immobilien.fields.personal.country')}
            >
              <MenuItem value="Germany">{t('forms.immobilien.options.country.germany')}</MenuItem>
              <MenuItem value="Austria">{t('forms.immobilien.options.country.austria')}</MenuItem>
              <MenuItem value="Switzerland">{t('forms.immobilien.options.country.switzerland')}</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            required
            type="number"
            label={t('forms.immobilien.fields.personal.numberOfDependents')}
            name="numberOfDependents"
            value={data.numberOfDependents || 0}
            onChange={handleTextChange}
            margin="normal"
            InputProps={{ inputProps: { min: 0 } }}
          />
          
          <TextField
            fullWidth
            label={t('forms.immobilien.fields.personal.nationality')}
            name="nationality"
            value={data.nationality || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label={t('forms.immobilien.fields.personal.birthPlace')}
            name="birthPlace"
            value={data.birthPlace || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label={t('forms.immobilien.fields.personal.identificationNumber')}
            name="identificationNumber"
            value={data.identificationNumber || ''}
            onChange={handleTextChange}
            margin="normal"
          />
          
          {data.coachId && (
            <TextField
              fullWidth
              label={t('forms.immobilien.fields.personal.coachId')}
              name="coachId"
              value={data.coachId}
              disabled
              margin="normal"
            />
          )}
          
          {data.personalId && (
            <TextField
              fullWidth
              label={t('forms.immobilien.fields.personal.personalId')}
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

export default PersonalDetailsForm; 