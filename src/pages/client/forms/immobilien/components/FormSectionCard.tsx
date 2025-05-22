import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

interface FormSectionCardProps {
  children: ReactNode;
  title: string;
}

/**
 * A reusable card component for form sections with consistent styling
 */
const FormSectionCard: React.FC<FormSectionCardProps> = ({ children, title }) => {
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
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSectionCard; 