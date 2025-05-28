import PDFExport from '../../../components/ui/PDFExport';
import { profileApi } from '../../../api/profile';

// Fetch complete client data for PDF export
const fetchCompleteClientData = async (clientData) => {
  try {
    console.log('Fetching complete client data for PDF:', clientData);
    
    // Start with the basic client data
    let completeData = { ...clientData };
    
    // Get the client's user ID - try different possible field names
    const userId = clientData.userId || clientData.id || clientData.personalId;
    
    if (!userId) {
      console.warn('No user ID found in client data, using basic data only');
      return completeData;
    }
    
    try {
      // Fetch additional profile sections using the business API endpoints
      console.log(`Fetching profile sections for userId: ${userId}`);
      
      // Get the authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        return completeData;
      }
      
      // Create headers for API calls
      const apiHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Use the business API endpoints instead of client-data endpoints
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // Fetch all profile sections in parallel using the business endpoints
      const [
        employmentResponse,
        incomeResponse,
        expensesResponse,
        assetsResponse,
        liabilitiesResponse,
        goalsResponse,
        riskResponse
      ] = await Promise.allSettled([
        fetch(`${baseUrl}/api/business/employment-details/${userId}`, {
          method: 'GET',
          headers: apiHeaders
        }),
        fetch(`${baseUrl}/api/business/income-details/${userId}`, {
          method: 'GET',
          headers: apiHeaders
        }),
        fetch(`${baseUrl}/api/business/expenses-details/${userId}`, {
          method: 'GET',
          headers: apiHeaders
        }),
        fetch(`${baseUrl}/api/business/assets/${userId}`, {
          method: 'GET',
          headers: apiHeaders
        }),
        fetch(`${baseUrl}/api/business/liabilities/${userId}`, {
          method: 'GET',
          headers: apiHeaders
        }),
        fetch(`${baseUrl}/api/business/goals-and-wishes/${userId}`, {
          method: 'GET',
          headers: apiHeaders
        }),
        fetch(`${baseUrl}/api/business/risk-appetite/${userId}`, {
          method: 'GET',
          headers: apiHeaders
        })
      ]);
      
      // Process the responses
      const processResponse = async (response, sectionName) => {
        if (response.status === 'fulfilled' && response.value.ok) {
          try {
            const data = await response.value.json();
            console.log(`✓ ${sectionName} data fetched:`, data);
            return data;
          } catch (error) {
            console.warn(`Error parsing ${sectionName} response:`, error);
            return null;
          }
        } else {
          console.warn(`Failed to fetch ${sectionName}:`, response.reason || response.value?.statusText);
          return null;
        }
      };
      
      // Parse all responses
      const [
        employmentData,
        incomeData,
        expensesData,
        assetsData,
        liabilitiesData,
        goalsData,
        riskData
      ] = await Promise.all([
        processResponse(employmentResponse, 'employment'),
        processResponse(incomeResponse, 'income'),
        processResponse(expensesResponse, 'expenses'),
        processResponse(assetsResponse, 'assets'),
        processResponse(liabilitiesResponse, 'liabilities'),
        processResponse(goalsResponse, 'goals'),
        processResponse(riskResponse, 'risk')
      ]);
      
      // Merge the data into the complete client data structure
      if (employmentData) {
        completeData.employmentDetails = Array.isArray(employmentData) ? employmentData : [employmentData];
      }
      
      if (incomeData) {
        completeData.incomeDetails = Array.isArray(incomeData) ? incomeData : [incomeData];
      }
      
      if (expensesData) {
        completeData.expensesDetails = Array.isArray(expensesData) ? expensesData : [expensesData];
      }
      
      if (assetsData) {
        completeData.assets = Array.isArray(assetsData) ? assetsData : [assetsData];
      }
      
      if (liabilitiesData) {
        completeData.liabilities = Array.isArray(liabilitiesData) ? liabilitiesData : [liabilitiesData];
      }
      
      if (goalsData) {
        completeData.goalsAndWishes = goalsData;
      }
      
      if (riskData) {
        completeData.riskAppetite = riskData;
      }
      
      console.log('✅ Complete client data assembled:', completeData);
      
    } catch (apiError) {
      console.error('Error fetching additional profile data:', apiError);
      // Continue with basic data if API calls fail
    }
    
    return completeData;
    
  } catch (error) {
    console.error('Error in fetchCompleteClientData:', error);
    return clientData; // Return original data as fallback
  }
};

// Export form as PDF using the new PDFExport component
export const exportFormAsPDF = async (formData, clientData, signature = null, formRef = null) => {
  try {
    console.log('Exporting PDF with data:', { formData, clientData, signature });
    
    // Fetch complete client data including all profile sections
    const completeClientData = await fetchCompleteClientData(clientData);
    
    // Determine application type based on client data
    const applicationType = 'single'; // Default to single for now
    
    // Use the new PDFExport component with complete data
    const result = await PDFExport.exportPDF(
      formData,
      completeClientData,
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
    
    // Fetch complete client data including all profile sections
    const completeClientData = await fetchCompleteClientData(clientData);
    
    // Determine application type based on client data
    const applicationType = 'single'; // Default to single for now
    
    // Use the new PDFExport component with complete data
    const result = await PDFExport.previewPDF(
      formData,
      completeClientData,
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
    
    // Fetch complete data for both clients
    const completePrimaryClient = await fetchCompleteClientData(primaryClient);
    const completeSecondaryClient = secondaryClient ? await fetchCompleteClientData(secondaryClient) : null;
    
    const result = await PDFExport.exportPDF(
      formData,
      completePrimaryClient,
      completeSecondaryClient,
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