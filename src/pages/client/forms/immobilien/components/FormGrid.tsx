import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';

interface FormGridContainerProps {
  children: ReactNode;
  spacing?: number;
}

interface FormGridItemProps {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

export const FormGridContainer: React.FC<FormGridContainerProps> = ({ 
  children, 
  spacing = 2 
}) => {
  return (
    <Grid container spacing={spacing}>
      {children}
    </Grid>
  );
};

export const FormGridItem: React.FC<FormGridItemProps> = ({ 
  children, 
  xs = 12, 
  sm, 
  md, 
  lg 
}) => {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      {children}
    </Grid>
  );
}; 