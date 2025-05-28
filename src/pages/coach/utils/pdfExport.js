import PDFExport from '../../../components/ui/PDFExport';

// Export form as PDF using the new PDFExport component
export const exportFormAsPDF = async (formData, clientData, signature = null, formRef = null) => {
  try {
    console.log('Exporting PDF with data:', { formData, clientData, signature });
    
    // Determine application type based on client data
    const applicationType = 'single'; // Default to single for now
    
    // Use the new PDFExport component
    const result = await PDFExport.exportPDF(
      formData,
      clientData,
      null, // secondaryClientData - can be added later for dual applicant support
      signature,
      applicationType
    );
    
    if (result.success) {
      console.log('PDF exported successfully:', result.filename);
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

// Preview form as PDF
export const previewFormAsPDF = async (formData, clientData, signature = null) => {
  try {
    console.log('Previewing PDF with data:', { formData, clientData, signature });
    
    // Determine application type based on client data
    const applicationType = 'single'; // Default to single for now
    
    // Use the new PDFExport component
    const result = await PDFExport.previewPDF(
      formData,
      clientData,
      null, // secondaryClientData - can be added later for dual applicant support
      signature,
      applicationType
    );
    
    if (result.success) {
      console.log('PDF preview opened successfully');
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error previewing PDF:', error);
    throw error;
  }
};

// Email form (placeholder for future implementation)
export const emailForm = async (formData, clientData) => {
  try {
    console.log('Email form functionality - to be implemented');
    
    // For now, just generate the PDF and show a message
    const result = await exportFormAsPDF(formData, clientData);
    
    if (result.success) {
      alert(`PDF generated: ${result.filename}\n\nEmail functionality will be implemented in a future update.`);
    }
    
    return { success: true, message: 'PDF generated for email' };
  } catch (error) {
    console.error('Error preparing form for email:', error);
    throw error;
  }
};

// Export with dual applicant support
export const exportDualApplicantPDF = async (formData, primaryClient, secondaryClient, signature = null) => {
  try {
    console.log('Exporting dual applicant PDF:', { formData, primaryClient, secondaryClient, signature });
    
    const result = await PDFExport.exportPDF(
      formData,
      primaryClient,
      secondaryClient,
      signature,
      'dual'
    );
    
    if (result.success) {
      console.log('Dual applicant PDF exported successfully:', result.filename);
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error exporting dual applicant PDF:', error);
    throw error;
  }
};

export default {
  exportFormAsPDF,
  previewFormAsPDF,
  emailForm,
  exportDualApplicantPDF
}; 