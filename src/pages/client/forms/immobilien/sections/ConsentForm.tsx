import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Button
} from '@mui/material';
import SignaturePad from 'react-signature-canvas';
import { Consent } from '../immo-form-data';

interface ConsentFormProps {
  data: Consent;
  onChange: (data: Partial<Consent>) => void;
}

const ConsentForm: React.FC<ConsentFormProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const signatureRef = useRef<SignaturePad>(null);
  const [signatureURL, setSignatureURL] = useState<string>(data.signatureImageURL || '');
  
  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'agreed') {
      onChange({ [name]: checked });
    } else {
      onChange({ [name]: value });
    }
  };
  
  // Handle signature change
  const handleSignatureEnd = () => {
    if (signatureRef.current) {
      const dataURL = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
      setSignatureURL(dataURL);
      onChange({ 
        signatureImageURL: dataURL,
        signature: data.signature || 'Digital Signature' 
      });
    }
  };
  
  // Clear signature pad
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureURL('');
      onChange({ signatureImageURL: '' });
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader title={t('forms.immobilien.sections.consent.title')} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('forms.immobilien.consent.title')}
            </Typography>
            <Typography paragraph>
              {t('forms.immobilien.consent.paragraph1')}
            </Typography>
            <Typography paragraph>
              {t('forms.immobilien.consent.paragraph2')}
            </Typography>
            <Typography paragraph>
              {t('forms.immobilien.consent.paragraph3')}
            </Typography>
            <Typography>
              {t('forms.immobilien.consent.paragraph4')}
            </Typography>
          </Paper>
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.consent.signature')}
            name="signature"
            value={data.signature || ''}
            onChange={handleChange}
            margin="normal"
            helperText={t('forms.immobilien.fields.consent.signatureHelp')}
          />
          
          <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('forms.immobilien.fields.consent.digitalSignature', 'Digital Signature')}
            </Typography>
            
            <Box 
              sx={{ 
                border: '1px dashed #aaa', 
                borderRadius: 1, 
                height: 200, 
                mb: 1,
                bgcolor: '#f9f9f9',
                '& canvas': {
                  width: '100%',
                  height: '100%'
                }
              }}
            >
              <SignaturePad
                ref={signatureRef}
                onEnd={handleSignatureEnd}
                canvasProps={{
                  style: { width: '100%', height: '100%' }
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={clearSignature}
                sx={{ mt: 1 }}
              >
                {t('forms.immobilien.fields.consent.clearSignature', 'Clear Signature')}
              </Button>
            </Box>
            
            {signatureURL && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {t('forms.immobilien.fields.consent.previewSignature', 'Signature Preview')}
                </Typography>
                <Box 
                  component="img" 
                  src={signatureURL} 
                  alt="Signature" 
                  sx={{ 
                    maxWidth: '100%', 
                    maxHeight: 100, 
                    border: '1px solid #eee', 
                    borderRadius: 1,
                    display: 'block',
                    mt: 1
                  }} 
                />
              </Box>
            )}
          </Box>
          
          <TextField
            fullWidth
            required
            label={t('forms.immobilien.fields.consent.place')}
            name="place"
            value={data.place || ''}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            type="date"
            label={t('forms.immobilien.fields.consent.date')}
            name="date"
            value={data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.agreed || false}
                  onChange={handleChange}
                  name="agreed"
                  color="primary"
                  required
                />
              }
              label={t('forms.immobilien.fields.consent.agreed')}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConsentForm; 