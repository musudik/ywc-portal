import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Description, 
  CloudUpload,
  Done,
  PendingActions,
  HourglassEmpty,
  CloudDone,
  Delete
} from '@mui/icons-material';
import { Document } from '../immo-form-data';

interface DocumentsFormProps {
  data: Document[];
  onChange: (data: Document[]) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const handleFileSelect = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const updatedDocs = data.map(doc => {
        if (doc.id === id) {
          // In a real scenario, you would upload the file to a server
          // and get back a URL. Here we just create a fake one
          return {
            ...doc,
            fileUrl: URL.createObjectURL(file),
            name: doc.name,
            uploadDate: new Date().toISOString(),
            status: 'Uploaded' as const
          };
        }
        return doc;
      });
      onChange(updatedDocs);
    }
  };
  
  const handleDeleteFile = (id: string) => () => {
    const updatedDocs = data.map(doc => {
      if (doc.id === id) {
        return {
          ...doc,
          fileUrl: undefined,
          uploadDate: undefined,
          status: 'Pending' as const
        };
      }
      return doc;
    });
    onChange(updatedDocs);
    
    // Reset file input
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]!.value = '';
    }
  };
  
  const getStatusChip = (status?: string) => {
    switch (status) {
      case 'Uploaded':
      case 'Verified':
        return (
          <Chip 
            icon={<CloudDone />} 
            label={t(`forms.immobilien.documents.status.${status.toLowerCase()}`)}
            color="success" 
            size="small" 
          />
        );
      case 'Rejected':
        return (
          <Chip 
            icon={<Delete />} 
            label={t('forms.immobilien.documents.status.rejected')}
            color="error" 
            size="small" 
          />
        );
      case 'Under Review':
        return (
          <Chip 
            icon={<HourglassEmpty />} 
            label={t('forms.immobilien.documents.status.underReview')}
            color="warning" 
            size="small" 
          />
        );
      case 'Pending':
      default:
        return (
          <Chip 
            icon={<PendingActions />} 
            label={t('forms.immobilien.documents.status.pending')}
            color="default" 
            size="small" 
          />
        );
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader title={t('forms.immobilien.sections.documents.title')} />
      <CardContent>
        <Typography paragraph>
          {t('forms.immobilien.documents.instruction')}
        </Typography>
        
        <List>
          {data.map((doc) => (
            <ListItem
              key={doc.id}
              secondaryAction={
                doc.fileUrl ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusChip(doc.status)}
                    <Tooltip title={t('forms.immobilien.documents.delete')}>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={handleDeleteFile(doc.id)}
                        sx={{ ml: 1 }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRefs.current[doc.id]?.click()}
                  >
                    {t('forms.immobilien.documents.upload')}
                  </Button>
                )
              }
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                mb: 2,
                bgcolor: doc.fileUrl ? 'rgba(76, 175, 80, 0.1)' : 'transparent'
              }}
            >
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    {t(`forms.immobilien.documents.types.${doc.id}`)}
                    {doc.required && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        ({t('forms.immobilien.documents.required')})
                      </Typography>
                    )}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.secondary">
                      {doc.description}
                    </Typography>
                    {doc.uploadDate && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        {t('forms.immobilien.documents.uploadedOn', { date: new Date(doc.uploadDate).toLocaleDateString() })}
                      </Typography>
                    )}
                  </React.Fragment>
                }
              />
              <input
                type="file"
                hidden
                ref={el => fileInputRefs.current[doc.id] = el}
                onChange={handleFileSelect(doc.id)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default DocumentsForm; 