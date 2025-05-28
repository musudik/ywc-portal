import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getToken, clearAuthData } from "../../utils/tokenUtils";
import { profileApi } from "../../api/profile";
import { formConfigApi } from "../../api/formConfig";

// Import separated components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StepProgress from "./components/StepProgress";

// Import sections
import DashboardHome from "./sections/DashboardHome";
import ClientManagement from "./sections/ClientManagement";
import ClientForms from "./sections/ClientForms";

// Import utilities
import { transformClientData, filterClients } from "./utils/clientUtils";

// Import existing form components (these would need to be moved to sections as well)
import PersonalDetailsForm from "../client/profile/PersonalDetailsForm";
import EmploymentDetailsForm from "../client/profile/EmploymentDetailsForm";
import IncomeDetailsForm from "../client/profile/IncomeDetailsForm";
import ExpensesDetailsForm from "../client/profile/ExpensesDetailsForm";
import AssetsForm from "../client/profile/AssetsForm";
import LiabilitiesForm from "../client/profile/LiabilitiesForm";
import GoalsAndWishesForm from "../client/profile/GoalsAndWishesForm";
import RiskAppetiteForm from "../client/profile/RiskAppetiteForm";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Theme configuration
  const themeColor = "bg-teal-600";
  const themeColorHover = "hover:bg-teal-700";
  const themeLightBg = "bg-teal-500/10";

  // UI State
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Client Management State
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Client Creation/Editing State
  const [showClientCreation, setShowClientCreation] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPersonalId, setCurrentPersonalId] = useState(null);

  // Forms State
  const [showClientForms, setShowClientForms] = useState(false);
  const [selectedClientForForms, setSelectedClientForForms] = useState(null);
  const [availableForms, setAvailableForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);

  const totalSteps = 8;

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  // Helper function to handle authentication issues
  const handleAuthError = () => {
    console.log('Handling authentication error - clearing stored auth data');
    clearAuthData();
    alert('Your session has expired. Please log in again.');
    logout();
    navigate('/login');
  };

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const token = getToken();
      if (!token) {
        console.error('No valid token available for loading clients');
        setClients([]);
        return;
      }

      console.log('Making API call to load clients...');

      // Use the proper API function instead of hardcoded fetch
      const clientsData = await profileApi.getAllClients();
      console.log("Raw clients data:", clientsData);
      
      const transformedClients = transformClientData(clientsData);
      console.log("Transformed clients:", transformedClients);
      
      setClients(transformedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        console.error('Authentication failed. Token might be invalid or expired.');
        handleAuthError();
        return;
      }
      
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadForms = async () => {
    setLoadingForms(true);
    try {
      const token = getToken();
      if (!token) {
        console.error('No valid token available for loading forms');
        setAvailableForms([]);
        return;
      }

      console.log('Loading form configurations...');
      
      // Use the proper API function instead of hardcoded fetch
      const formsResponse = await formConfigApi.getAllConfigurations({ active: 'true' });
      console.log("Available forms response:", formsResponse);
      
      // Extract the data array from the response
      const formsData = formsResponse.data || [];
      console.log("Available forms data:", formsData);
      
      setAvailableForms(formsData);
    } catch (error) {
      console.error('Error loading forms:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        handleAuthError();
        return;
      }
      
      setAvailableForms([]);
    } finally {
      setLoadingForms(false);
    }
  };

  // Navigation handlers
  const handleMenuClick = (menuId) => {
    setActiveMenuItem(menuId);
    setShowMobileSidebar(false);
    
    // Reset states when switching menus
    setShowClientCreation(false);
    setEditingClient(null);
      setShowClientForms(false);
    setSelectedClientForForms(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Client management handlers
  const handleCreateClient = () => {
    setShowClientCreation(true);
    setEditingClient(null);
    setCurrentStep(0);
    setCurrentPersonalId(null);
    setActiveMenuItem("clients");
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setCurrentPersonalId(client.personalId || client.userId);
    setShowClientCreation(true);
        setCurrentStep(0);
    setActiveMenuItem("clients");
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        console.error('No valid token available for deleting client');
        alert('Authentication required. Please log in again.');
        return;
      }

      console.log(`Deleting client with ID: ${clientId}`);
      
      // Use the proper API function instead of hardcoded fetch
      await profileApi.deletePersonalDetails(clientId);
      
      console.log('Client deleted successfully');
      await loadClients(); // Reload clients list
    } catch (error) {
      console.error('Error deleting client:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        handleAuthError();
        return;
      }
      
      alert('Error deleting client');
    }
  };

  const handleToggleClientStatus = (clientId) => {
    setClients(prevClients => 
      prevClients.map(client => 
      client.id === clientId 
        ? { ...client, status: client.status === 'active' ? 'inactive' : 'active' }
        : client
      )
    );
  };

  const handleShowClientForms = async (client) => {
    setSelectedClientForForms(client);
    setShowClientForms(true);
    setActiveMenuItem("clients");
    
    // Load forms when showing client forms
    await loadForms();
  };

  const handleBackToClients = () => {
    setShowClientForms(false);
    setSelectedClientForForms(null);
    setShowClientCreation(false);
    setEditingClient(null);
    setActiveMenuItem("clients");
  };

  // Step navigation handlers
  const handleNextStep = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
            } else {
      // Final step - save and return to client list
      await loadClients();
      setShowClientCreation(false);
      setEditingClient(null);
      setActiveMenuItem("clients");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  // Render step content
  const renderStepContent = () => {
    const commonProps = {
      personalId: currentPersonalId,
      onNext: handleNextStep,
      onPrevious: handlePreviousStep,
      isEditMode: !!editingClient,
      initialData: editingClient
    };

    switch (currentStep) {
      case 0:
        return (
          <PersonalDetailsForm
            {...commonProps}
            onPersonalIdChange={setCurrentPersonalId}
          />
        );
      case 1:
        return <EmploymentDetailsForm {...commonProps} />;
      case 2:
        return <IncomeDetailsForm {...commonProps} />;
      case 3:
        return <ExpensesDetailsForm {...commonProps} />;
      case 4:
        return <AssetsForm {...commonProps} />;
      case 5:
        return <LiabilitiesForm {...commonProps} />;
      case 6:
        return <GoalsAndWishesForm {...commonProps} />;
      case 7:
        return <RiskAppetiteForm {...commonProps} />;
      default:
        return null;
    }
  };

  // Main render logic
  const renderMainContent = () => {
    if (showClientForms) {
    return (
        <ClientForms
          selectedClient={selectedClientForForms}
          availableForms={availableForms}
          loadingForms={loadingForms}
          onBackToClients={handleBackToClients}
          themeColor={themeColor}
          themeColorHover={themeColorHover}
        />
      );
    }

    if (showClientCreation) {
      return (
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
            <div className="max-w-4xl mx-auto">
              <StepProgress 
                currentStep={currentStep} 
                totalSteps={totalSteps}
                onStepClick={handleStepClick}
              isEditMode={!!editingClient}
              clientName={editingClient ? `${editingClient.firstName} ${editingClient.lastName}` : ""}
              />
            {renderStepContent()}
            </div>
          </main>
    );
  }

    switch (activeMenuItem) {
      case "dashboard":
    return (
          <DashboardHome
            clients={clients}
            loadingClients={loadingClients}
            onCreateClient={handleCreateClient}
            onManageClients={() => setActiveMenuItem("clients")}
            onEditClient={handleEditClient}
            themeColor={themeColor}
            themeColorHover={themeColorHover}
            themeLightBg={themeLightBg}
          />
        );

      case "clients":
                                  return (
          <ClientManagement
            clients={clients}
            loadingClients={loadingClients}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterStatus}
            onCreateClient={handleCreateClient}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            onToggleClientStatus={handleToggleClientStatus}
            onShowClientForms={handleShowClientForms}
            themeColor={themeColor}
            themeColorHover={themeColorHover}
          />
        );

      case "profile":
        return (
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Coach Profile</h1>
              <p className="text-muted-foreground">Profile management coming soon...</p>
            </div>
          </main>
    );

      case "forms":
    return (
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Form Management</h1>
              <p className="text-muted-foreground">Form management coming soon...</p>
            </div>
          </main>
    );

      default:
  return (
          <DashboardHome
            clients={clients}
            loadingClients={loadingClients}
            onCreateClient={handleCreateClient}
            onManageClients={() => setActiveMenuItem("clients")}
            onEditClient={handleEditClient}
            themeColor={themeColor}
            themeColorHover={themeColorHover}
            themeLightBg={themeLightBg}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        activeMenuItem={activeMenuItem}
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        showMobileSidebar={showMobileSidebar}
        clients={clients}
        themeColor={themeColor}
        themeLightBg={themeLightBg}
      />

      {/* Mobile sidebar overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleMobileSidebar={() => setShowMobileSidebar(!showMobileSidebar)}
          showBackButton={showClientCreation || showClientForms}
          backButtonText={showClientForms ? "← Back to Clients" : "← Back to Dashboard"}
          onBackClick={showClientForms ? handleBackToClients : () => {
            setShowClientCreation(false);
            setEditingClient(null);
            setActiveMenuItem("dashboard");
          }}
          themeColor={themeColor}
        />
        
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Dashboard; 