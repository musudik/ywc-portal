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
  SelectChangeEvent
} from '@mui/material';
import { EmploymentDetails } from '../immo-form-data';

interface EmploymentDetailsFormProps {
  data: EmploymentDetails;
  onChange: (data: Partial<EmploymentDetails>) => void;
  title: string;
}

const EmploymentDetailsForm: React.FC<EmploymentDetailsFormProps> = ({ data, onChange, title }) => {
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
    <Card variant="outlined">
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="employment-type-label">
              {t('forms.immobilien.fields.employment.employmentType')}
            </InputLabel>
            <Select
              labelId="employment-type-label"
              name="employmentType"
              value={data.employmentType || ''}
              onChange={handleSelectChange}
              label={t('forms.immobilien.fields.employment.employmentType')}
              required
            >
              <MenuItem value="employed">{t('forms.immobilien.options.employmentType.employed')}</MenuItem>
              <MenuItem value="selfEmployed">{t('forms.immobilien.options.employmentType.selfEmployed')}</MenuItem>
              <MenuItem value="unemployed">{t('forms.immobilien.options.employmentType.unemployed')}</MenuItem>
              <MenuItem value="retired">{t('forms.immobilien.options.employmentType.retired')}</MenuItem>
              <MenuItem value="student">{t('forms.immobilien.options.employmentType.student')}</MenuItem>
              <MenuItem value="other">{t('forms.immobilien.options.employmentType.other')}</MenuItem>
            </Select>
          </FormControl>
          
          {data.employmentType !== 'unemployed' && data.employmentType !== 'retired' && data.employmentType !== 'student' && (
            <>
              <TextField
                fullWidth
                required
                label={t('forms.immobilien.fields.employment.occupation')}
                name="occupation"
                value={data.occupation || ''}
                onChange={handleTextChange}
                margin="normal"
              />
              
              {data.employmentType !== 'selfEmployed' && (
                <TextField
                  fullWidth
                  required
                  label={t('forms.immobilien.fields.employment.employerName')}
                  name="employerName"
                  value={data.employerName || ''}
                  onChange={handleTextChange}
                  margin="normal"
                />
              )}
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="contract-type-label">
                  {t('forms.immobilien.fields.employment.contractType')}
                </InputLabel>
                <Select
                  labelId="contract-type-label"
                  name="contractType"
                  value={data.contractType || ''}
                  onChange={handleSelectChange}
                  label={t('forms.immobilien.fields.employment.contractType')}
                  required
                >
                  <MenuItem value="permanent">{t('forms.immobilien.options.contractType.permanent')}</MenuItem>
                  <MenuItem value="temporary">{t('forms.immobilien.options.contractType.temporary')}</MenuItem>
                  <MenuItem value="partTime">{t('forms.immobilien.options.contractType.partTime')}</MenuItem>
                  <MenuItem value="fullTime">{t('forms.immobilien.options.contractType.fullTime')}</MenuItem>
                  <MenuItem value="freelance">{t('forms.immobilien.options.contractType.freelance')}</MenuItem>
                  <MenuItem value="other">{t('forms.immobilien.options.contractType.other')}</MenuItem>
                </Select>
              </FormControl>
              
              {data.contractType === 'temporary' && (
                <TextField
                  fullWidth
                  label={t('forms.immobilien.fields.employment.contractDuration')}
                  name="contractDuration"
                  value={data.contractDuration || ''}
                  onChange={handleTextChange}
                  margin="normal"
                />
              )}
              
              <TextField
                fullWidth
                required
                label={t('forms.immobilien.fields.employment.employedSince')}
                type="date"
                name="employedSince"
                value={typeof data.employedSince === 'string' 
                  ? data.employedSince.split('T')[0] 
                  : data.employedSince instanceof Date 
                    ? data.employedSince.toISOString().split('T')[0]
                    : ''}
                onChange={handleTextChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}
          
          {data.personalId && (
            <TextField
              fullWidth
              label={t('forms.immobilien.fields.employment.personalId')}
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

export default EmploymentDetailsForm; 