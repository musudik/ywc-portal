import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";
import { useTheme } from "../../components/ui/ThemeProvider";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/ui/Logo";
import { profileApi } from "../../api";
import { formConfigApi } from "../../api/formConfig";

// Import profile form components for client creation
import PersonalDetailsForm from "../client/profile/PersonalDetailsForm";
import EmploymentDetailsForm from "../client/profile/EmploymentDetailsForm";
import IncomeDetailsForm from "../client/profile/IncomeDetailsForm";
import ExpensesDetailsForm from "../client/profile/ExpensesDetailsForm";
import AssetsForm from "../client/profile/AssetsForm";
import LiabilitiesForm from "../client/profile/LiabilitiesForm";
import GoalsAndWishesForm from "../client/profile/GoalsAndWishesForm";
import RiskAppetiteForm from "../client/profile/RiskAppetiteForm";

// Icon components
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ThemeIcon = () => {
  const { theme } = useTheme();
  return theme === 'dark' ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
};

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ClientsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FormsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

// Add a new icon for collapse/expand sidebar
const CollapseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const FormIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);

// Step progress component for client creation
const StepProgress = ({ currentStep, totalSteps, onStepClick, isEditMode = false, clientName = "" }) => {
  const { t } = useTranslation();
  const steps = [
    { key: 'personal', label: 'Personal Details' },
    { key: 'employment', label: 'Employment' },
    { key: 'income', label: 'Income' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'assets', label: 'Assets' },
    { key: 'liabilities', label: 'Liabilities' },
    { key: 'goals', label: 'Goals & Wishes' },
    { key: 'risk', label: 'Risk Profile' }
  ];

  const percentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {isEditMode ? `Edit Client Profile${clientName ? ` - ${clientName}` : ""}` : "Client Profile Setup"}
          </h2>
          {isEditMode && (
            <p className="text-sm text-muted-foreground mt-1">
              Update client information across all profile sections
            </p>
          )}
        </div>
        <span className="text-sm px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium">
          Step {currentStep + 1} of {totalSteps} ({percentage}% Complete)
        </span>
      </div>
      <div className="flex w-full h-2 bg-gray-200 dark:bg-black rounded-full overflow-hidden mb-6">
        <div
          className="bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <button 
              key={step.key} 
              onClick={() => onStepClick(index)}
              className={`
                py-3 px-2 rounded-md text-center transition-all duration-200 flex flex-col items-center justify-center
                ${isCurrent 
                  ? 'bg-blue-600 text-white' 
                  : isCompleted 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-black dark:text-gray-300'
                } cursor-pointer
              `}
            >
              <span className="text-sm font-medium">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

function CoachDashboard() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Client management states
  const [showClientManagement, setShowClientManagement] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showClientForms, setShowClientForms] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [availableForms, setAvailableForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [loadingClientData, setLoadingClientData] = useState(false);

  // Client form data states
  const [personalDetails, setPersonalDetails] = useState(null);
  const [employmentDetails, setEmploymentDetails] = useState(null);
  const [incomeDetails, setIncomeDetails] = useState(null);
  const [expensesDetails, setExpensesDetails] = useState(null);
  const [assetsDetails, setAssetsDetails] = useState(null);
  const [liabilitiesDetails, setLiabilitiesDetails] = useState(null);
  const [goalsAndWishesDetails, setGoalsAndWishesDetails] = useState(null);
  const [riskAppetiteDetails, setRiskAppetiteDetails] = useState(null);
  
  // Track the actual personalId after first step completion
  const [currentPersonalId, setCurrentPersonalId] = useState(null);

  // Client data from API
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  
  // Dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalForms: 0,
    completedForms: 0,
    pendingForms: 0,
    recentActivities: []
  });

  // Coach theme color - Teal/Cyan (unique color for coaches)
  const themeColor = "bg-teal-600";
  const themeColorHover = "hover:bg-teal-700";
  const themeLightBg = "bg-teal-500/10";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <HomeIcon /> },
    { id: "profile", label: "Profile", icon: <ProfileIcon /> },
    { id: "clients", label: "Manage Clients", icon: <ClientsIcon /> },
    { id: "forms", label: "Manage Forms", icon: <FormsIcon /> }
  ];

  const totalSteps = 8;

  // Fetch clients from API
  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      console.log("Fetching clients for coach...");
      const clientsData = await profileApi.getAllClients();
      console.log("Clients data received:", clientsData);
      
      // Transform the API data to match the expected client format
      const transformedClients = clientsData.map((client, index) => {
        const profileCompletion = calculateProfileCompletion(client);
        const formsCompleted = Math.round((profileCompletion / 100) * 8); // Calculate completed forms based on percentage
        
        return {
          id: client.userId || client.id || index + 1,
          firstName: client.firstName || "Unknown",
          lastName: client.lastName || "Client",
          email: client.email || "no-email@example.com",
          phone: client.phone || "N/A",
          status: "active", // Default to active, could be enhanced with actual status
          profileCompletion: profileCompletion,
          lastActivity: client.updatedAt ? new Date(client.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          joinDate: client.createdAt ? new Date(client.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          formsCompleted: formsCompleted, // Calculated based on actual completion
          totalForms: 8, // Total number of profile sections
          userId: client.userId || client.id,
          personalId: client.userId || client.id
        };
      });
      
      setClients(transformedClients);
      console.log("Transformed clients:", transformedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      // Keep empty array on error
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  // Calculate profile completion percentage based on available data
  const calculateProfileCompletion = (client) => {
    let completedSections = 0;
    const totalSections = 8;
    
    console.log("Calculating profile completion for client:", client);
    
    // 1. Personal Details - Check if basic personal details are complete
    const hasPersonalDetails = client.firstName && client.lastName && client.email && client.phone && 
                              client.streetAddress && client.city && client.postalCode && client.birthDate;
    if (hasPersonalDetails) {
      completedSections++;
      console.log("✓ Personal Details completed");
    } else {
      console.log("✗ Personal Details incomplete");
    }
    
    // 2. Employment Details - Check if employment information exists and has meaningful data
    const hasEmploymentDetails = client.employmentDetails && 
                                Array.isArray(client.employmentDetails) && 
                                client.employmentDetails.length > 0 &&
                                client.employmentDetails.some(emp => emp.employmentType || emp.employerName || emp.occupation);
    if (hasEmploymentDetails) {
      completedSections++;
      console.log("✓ Employment Details completed");
    } else {
      console.log("✗ Employment Details incomplete");
    }
    
    // 3. Income Details - Check if income information exists and has meaningful data
    const hasIncomeDetails = client.incomeDetails && 
                            Array.isArray(client.incomeDetails) && 
                            client.incomeDetails.length > 0 &&
                            client.incomeDetails.some(inc => inc.grossIncome || inc.netIncome);
    if (hasIncomeDetails) {
      completedSections++;
      console.log("✓ Income Details completed");
    } else {
      console.log("✗ Income Details incomplete");
    }
    
    // 4. Expenses Details - Check if expenses information exists and has meaningful data
    const hasExpensesDetails = client.expensesDetails && 
                              Array.isArray(client.expensesDetails) && 
                              client.expensesDetails.length > 0 &&
                              client.expensesDetails.some(exp => exp.coldRent || exp.electricity || exp.livingExpenses);
    if (hasExpensesDetails) {
      completedSections++;
      console.log("✓ Expenses Details completed");
    } else {
      console.log("✗ Expenses Details incomplete");
    }
    
    // 5. Assets - Check if assets information exists and has meaningful data
    const hasAssets = client.assets && 
                     Array.isArray(client.assets) && 
                     client.assets.length > 0 &&
                     client.assets.some(asset => 
                       asset.realEstate > 0 || asset.securities > 0 || asset.bankDeposits > 0 || 
                       asset.buildingSavings > 0 || asset.insuranceValues > 0 || asset.otherAssets > 0
                     );
    if (hasAssets) {
      completedSections++;
      console.log("✓ Assets completed");
    } else {
      console.log("✗ Assets incomplete");
    }
    
    // 6. Liabilities - Check if liabilities information exists and has meaningful data
    const hasLiabilities = client.liabilities && 
                          Array.isArray(client.liabilities) && 
                          client.liabilities.length > 0 &&
                          client.liabilities.some(liability => liability.loanType || liability.loanAmount || liability.loanBank);
    if (hasLiabilities) {
      completedSections++;
      console.log("✓ Liabilities completed");
    } else {
      console.log("✗ Liabilities incomplete");
    }
    
    // 7. Goals and Wishes - Check if goals and wishes information exists and has meaningful data
    const hasGoalsAndWishes = client.goalsAndWishes && 
                             (client.goalsAndWishes.retirementPlanning || 
                              client.goalsAndWishes.capitalFormation || 
                              client.goalsAndWishes.realEstateGoals ||
                              client.goalsAndWishes.financing ||
                              client.goalsAndWishes.protection ||
                              client.goalsAndWishes.healthcareProvision ||
                              client.goalsAndWishes.otherGoals);
    if (hasGoalsAndWishes) {
      completedSections++;
      console.log("✓ Goals and Wishes completed");
    } else {
      console.log("✗ Goals and Wishes incomplete");
    }
    
    // 8. Risk Appetite - Check if risk appetite information exists and has meaningful data
    const hasRiskAppetite = client.riskAppetite && 
                           (client.riskAppetite.riskAppetite || 
                            client.riskAppetite.investmentHorizon || 
                            client.riskAppetite.knowledgeExperience ||
                            client.riskAppetite.healthInsurance);
    if (hasRiskAppetite) {
      completedSections++;
      console.log("✓ Risk Appetite completed");
    } else {
      console.log("✗ Risk Appetite incomplete");
    }
    
    const completionPercentage = Math.round((completedSections / totalSections) * 100);
    console.log(`Profile completion: ${completedSections}/${totalSections} sections = ${completionPercentage}%`);
    return completionPercentage;
  };

  // Fetch clients when component mounts or when showing client management
  useEffect(() => {
    if (showClientManagement) {
      fetchClients();
    }
  }, [showClientManagement]);

  // Fetch clients on component mount for dashboard statistics
  useEffect(() => {
    fetchClients();
  }, []);

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (menuId) => {
    setActiveMenuItem(menuId);
    setShowMobileSidebar(false);
    
    if (menuId === "clients") {
      setShowClientManagement(true);
    } else {
      setShowClientManagement(false);
      setShowCreateClient(false);
      setShowClientForms(false);
      setSelectedForm(null);
      setSelectedClient(null);
    }
  };

  const handleCreateClient = () => {
    setIsEditMode(false);
    setSelectedClient(null);
    setShowCreateClient(true);
    setCurrentStep(0);
    // Reset all form data
    setPersonalDetails(null);
    setEmploymentDetails(null);
    setIncomeDetails(null);
    setExpensesDetails(null);
    setAssetsDetails(null);
    setLiabilitiesDetails(null);
    setGoalsAndWishesDetails(null);
    setRiskAppetiteDetails(null);
    setCurrentPersonalId(null);
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleNextStep = async (formData) => {
    try {
      // Save current step data to state
      switch (currentStep) {
        case 0:
          setPersonalDetails(formData);
          // For the first step, save personal details immediately to get the userId
          if (formData) {
            console.log("Saving personal details immediately:", formData);
            let savedPersonalDetails;
            
            if (isEditMode && currentPersonalId) {
              // Update existing personal details
              console.log("Updating existing personal details for userId:", currentPersonalId);
              savedPersonalDetails = await profileApi.updatePersonalDetails({
                ...formData,
                id: currentPersonalId
              });
            } else {
              // Create new personal details
              savedPersonalDetails = await profileApi.savePersonalDetails(formData);
            }
            
            console.log("Personal details saved:", savedPersonalDetails);
            
            // Update the personalId for subsequent forms
            const clientUserId = savedPersonalDetails.userId || savedPersonalDetails.id;
            setCurrentPersonalId(clientUserId);
            
            // Update the saved personal details with the response
            setPersonalDetails(savedPersonalDetails);
          }
          break;
        case 1:
          setEmploymentDetails(formData);
          // Save employment details if we have a personalId
          if (formData && currentPersonalId) {
            console.log("Saving employment details:", formData);
            try {
              await profileApi.saveEmploymentDetails({
                ...formData,
                personalId: currentPersonalId
              });
              console.log("Employment details saved successfully");
            } catch (err) {
              console.error("Error saving employment details:", err);
            }
          }
          break;
        case 2:
          setIncomeDetails(formData);
          // Save income details if we have a personalId
          if (formData && currentPersonalId) {
            console.log("Saving income details:", formData);
            try {
              await profileApi.saveIncomeDetails({
                ...formData,
                personalId: currentPersonalId
              });
              console.log("Income details saved successfully");
            } catch (err) {
              console.error("Error saving income details:", err);
            }
          }
          break;
        case 3:
          setExpensesDetails(formData);
          // Save expenses details if we have a personalId
          if (formData && currentPersonalId) {
            console.log("Saving expenses details:", formData);
            try {
              await profileApi.saveExpensesDetails({
                ...formData,
                personalId: currentPersonalId
              });
              console.log("Expenses details saved successfully");
            } catch (err) {
              console.error("Error saving expenses details:", err);
            }
          }
          break;
        case 4:
          setAssetsDetails(formData);
          // Save assets details if we have a personalId
          if (formData && currentPersonalId) {
            console.log("Saving assets details:", formData);
            try {
              await profileApi.saveAssets({
                ...formData,
                personalId: currentPersonalId
              });
              console.log("Assets details saved successfully");
            } catch (err) {
              console.error("Error saving assets details:", err);
            }
          }
          break;
        case 5:
          setLiabilitiesDetails(formData);
          // Save liabilities details if we have a personalId and liabilities data
          if (formData && Array.isArray(formData) && formData.length > 0 && currentPersonalId) {
            console.log("Saving liabilities details:", formData);
            try {
              // Save each liability individually, filtering out temporary IDs
              const savePromises = formData.map(liability => {
                // Remove temporary ID and other auto-generated fields before saving
                const { liabilityId, id, createdAt, updatedAt, ...cleanLiability } = liability;
                
                // Ensure we have a clean liability object with only the required fields
                const liabilityToSave = {
                  personalId: currentPersonalId,
                  loanType: cleanLiability.loanType,
                  loanBank: cleanLiability.loanBank,
                  loanAmount: cleanLiability.loanAmount,
                  loanMonthlyRate: cleanLiability.loanMonthlyRate,
                  loanInterest: cleanLiability.loanInterest
                };
                
                console.log("Saving individual liability:", liabilityToSave);
                
                return profileApi.saveLiability(liabilityToSave).catch(err => {
                  console.error("Error saving individual liability:", err);
                  return null;
                });
              });
              
              await Promise.all(savePromises);
              console.log("All liabilities saved successfully");
            } catch (err) {
              console.error("Error saving liabilities details:", err);
            }
          }
          break;
        case 6:
          setGoalsAndWishesDetails(formData);
          // Save goals and wishes details if we have a personalId
          if (formData && currentPersonalId) {
            console.log("Saving goals and wishes details:", formData);
            try {
              await profileApi.saveGoalsAndWishes({
                ...formData,
                personalId: currentPersonalId
              });
              console.log("Goals and wishes details saved successfully");
            } catch (err) {
              console.error("Error saving goals and wishes details:", err);
            }
          }
          break;
        case 7:
          setRiskAppetiteDetails(formData);
          // Save risk appetite details if we have a personalId
          if (formData && currentPersonalId) {
            console.log("Saving risk appetite details:", formData);
            try {
              await profileApi.saveRiskAppetite({
                ...formData,
                personalId: currentPersonalId
              });
              console.log("Risk appetite details saved successfully");
            } catch (err) {
              console.error("Error saving risk appetite details:", err);
            }
          }
          break;
      }

      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step - client profile is complete
        setShowCreateClient(false);
        setCurrentStep(0);
        
        // Reset form data
        setPersonalDetails(null);
        setEmploymentDetails(null);
        setIncomeDetails(null);
        setExpensesDetails(null);
        setAssetsDetails(null);
        setLiabilitiesDetails(null);
        setGoalsAndWishesDetails(null);
        setRiskAppetiteDetails(null);
        setCurrentPersonalId(null);
        setIsEditMode(false);
        setSelectedClient(null);
        
        // Refresh the clients list to show the updated client
        await fetchClients();
        
        // Show success message
        const message = isEditMode ? "Client profile updated successfully!" : "Client profile completed successfully!";
        alert(message);
      }
    } catch (error) {
      console.error("Error in handleNextStep:", error);
      alert("Error saving data. Please try again.");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveClient = async () => {
    try {
      // Save personal details first (this will generate a new userId for the client)
      console.log("Saving personal details:", personalDetails);
      const savedPersonalDetails = await profileApi.savePersonalDetails(personalDetails);
      console.log("Personal details saved:", savedPersonalDetails);
      
      // Get the userId from the saved personal details
      const clientUserId = savedPersonalDetails.userId || savedPersonalDetails.id;
      console.log("Client userId:", clientUserId);
      
      // Save other form data if available
      const savePromises = [];
      
      if (employmentDetails && clientUserId) {
        console.log("Saving employment details:", employmentDetails);
        savePromises.push(
          profileApi.saveEmploymentDetails({
            ...employmentDetails,
            personalId: clientUserId
          }).catch(err => {
            console.error("Error saving employment details:", err);
            return null;
          })
        );
      }
      
      if (incomeDetails && clientUserId) {
        console.log("Saving income details:", incomeDetails);
        savePromises.push(
          profileApi.saveIncomeDetails({
            ...incomeDetails,
            personalId: clientUserId
          }).catch(err => {
            console.error("Error saving income details:", err);
            return null;
          })
        );
      }
      
      if (expensesDetails && clientUserId) {
        console.log("Saving expenses details:", expensesDetails);
        savePromises.push(
          profileApi.saveExpensesDetails({
            ...expensesDetails,
            personalId: clientUserId
          }).catch(err => {
            console.error("Error saving expenses details:", err);
            return null;
          })
        );
      }
      
      if (assetsDetails && clientUserId) {
        console.log("Saving assets details:", assetsDetails);
        savePromises.push(
          profileApi.saveAssets({
            ...assetsDetails,
            personalId: clientUserId
          }).catch(err => {
            console.error("Error saving assets details:", err);
            return null;
          })
        );
      }
      
      if (liabilitiesDetails && clientUserId) {
        console.log("Saving liabilities details:", liabilitiesDetails);
        // For liabilities, we need to save each liability individually
        let liabilitiesToSave = [];
        
        // Handle different data structures
        if (Array.isArray(liabilitiesDetails)) {
          liabilitiesToSave = liabilitiesDetails;
        } else if (liabilitiesDetails.liabilities && Array.isArray(liabilitiesDetails.liabilities)) {
          liabilitiesToSave = liabilitiesDetails.liabilities;
        }
        
        if (liabilitiesToSave.length > 0) {
          liabilitiesToSave.forEach(liability => {
            // Remove temporary ID and other auto-generated fields before saving
            const { liabilityId, id, createdAt, updatedAt, ...cleanLiability } = liability;
            
            // Ensure we have a clean liability object with only the required fields
            const liabilityToSave = {
              personalId: clientUserId,
              loanType: cleanLiability.loanType,
              loanBank: cleanLiability.loanBank,
              loanAmount: cleanLiability.loanAmount,
              loanMonthlyRate: cleanLiability.loanMonthlyRate,
              loanInterest: cleanLiability.loanInterest
            };
            
            console.log("Saving individual liability in handleSaveClient:", liabilityToSave);
            
            savePromises.push(
              profileApi.saveLiability(liabilityToSave).catch(err => {
                console.error("Error saving liability:", err);
                return null;
              })
            );
          });
        }
      }
      
      if (goalsAndWishesDetails && clientUserId) {
        console.log("Saving goals and wishes details:", goalsAndWishesDetails);
        savePromises.push(
          profileApi.saveGoalsAndWishes({
            ...goalsAndWishesDetails,
            personalId: clientUserId
          }).catch(err => {
            console.error("Error saving goals and wishes details:", err);
            return null;
          })
        );
      }
      
      if (riskAppetiteDetails && clientUserId) {
        console.log("Saving risk appetite details:", riskAppetiteDetails);
        savePromises.push(
          profileApi.saveRiskAppetite({
            ...riskAppetiteDetails,
            personalId: clientUserId
          }).catch(err => {
            console.error("Error saving risk appetite details:", err);
            return null;
          })
        );
      }
      
      // Wait for all saves to complete
      if (savePromises.length > 0) {
        console.log(`Saving ${savePromises.length} additional form sections...`);
        const results = await Promise.all(savePromises);
        console.log("Additional form sections saved:", results);
      }
      
      setShowCreateClient(false);
      setCurrentStep(0);
      
      // Reset form data
      setPersonalDetails(null);
      setEmploymentDetails(null);
      setIncomeDetails(null);
      setExpensesDetails(null);
      setAssetsDetails(null);
      setLiabilitiesDetails(null);
      setGoalsAndWishesDetails(null);
      setRiskAppetiteDetails(null);
      setCurrentPersonalId(null);
      
      // Refresh the clients list to show the new client
      await fetchClients();
      
      // Show success message
      alert("Client created successfully with all profile data!");
    } catch (error) {
      console.error("Error creating client:", error);
      alert("Failed to create client. Please try again.");
    }
  };

  const handleEditClient = async (client) => {
    try {
      console.log("Editing client:", client);
      setSelectedClient(client);
      setIsEditMode(true);
      setCurrentPersonalId(client.userId || client.personalId || client.id);
      
      // Fetch complete client data from backend
      console.log("Fetching complete client data for userId:", client.userId || client.personalId || client.id);
      
      // Fetch personal details (this includes all related data)
      const fullClientData = await profileApi.getPersonalDetails(client.userId || client.personalId || client.id);
      console.log("Full client data received:", fullClientData);
      
      if (fullClientData) {
        // Set personal details
        setPersonalDetails(fullClientData);
        
        // Set employment details
        if (fullClientData.employmentDetails && fullClientData.employmentDetails.length > 0) {
          setEmploymentDetails(fullClientData.employmentDetails[0]); // Take the first employment record
        } else {
          setEmploymentDetails(null);
        }
        
        // Set income details
        if (fullClientData.incomeDetails && fullClientData.incomeDetails.length > 0) {
          setIncomeDetails(fullClientData.incomeDetails[0]); // Take the first income record
        } else {
          setIncomeDetails(null);
        }
        
        // Set expenses details
        if (fullClientData.expensesDetails && fullClientData.expensesDetails.length > 0) {
          setExpensesDetails(fullClientData.expensesDetails[0]); // Take the first expenses record
        } else {
          setExpensesDetails(null);
        }
        
        // Set assets details
        if (fullClientData.assets && fullClientData.assets.length > 0) {
          setAssetsDetails(fullClientData.assets[0]); // Take the first asset record
        } else {
          setAssetsDetails(null);
        }
        
        // Set liabilities details
        if (fullClientData.liabilities && fullClientData.liabilities.length > 0) {
          setLiabilitiesDetails(fullClientData.liabilities); // Liabilities is an array
        } else {
          setLiabilitiesDetails(null);
        }
        
        // Set goals and wishes details
        if (fullClientData.goalsAndWishes) {
          setGoalsAndWishesDetails(fullClientData.goalsAndWishes);
        } else {
          setGoalsAndWishesDetails(null);
        }
        
        // Set risk appetite details
        if (fullClientData.riskAppetite) {
          setRiskAppetiteDetails(fullClientData.riskAppetite);
        } else {
          setRiskAppetiteDetails(null);
        }
        
        console.log("Client data loaded into forms successfully");
      } else {
        console.warn("No client data found, starting with empty forms");
        // Reset all form data if no data found
        setPersonalDetails(null);
        setEmploymentDetails(null);
        setIncomeDetails(null);
        setExpensesDetails(null);
        setAssetsDetails(null);
        setLiabilitiesDetails(null);
        setGoalsAndWishesDetails(null);
        setRiskAppetiteDetails(null);
      }
      
      setShowCreateClient(true);
      setCurrentStep(0);
    } catch (error) {
      console.error("Error loading client data for editing:", error);
      alert("Failed to load client data. Please try again.");
    }
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const handleToggleClientStatus = (clientId) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, status: client.status === 'active' ? 'inactive' : 'active' }
        : client
    ));
  };

  const fetchAvailableForms = async () => {
    setLoadingForms(true);
    try {
      console.log("Fetching available forms...");
      const formsData = await formConfigApi.getAllConfigurations({ active: true });
      console.log("Available forms:", formsData);
      
      // Handle both array and paginated response
      const forms = Array.isArray(formsData) ? formsData : (formsData.data || []);
      setAvailableForms(forms);
    } catch (error) {
      console.error("Error fetching available forms:", error);
      setAvailableForms([]);
    } finally {
      setLoadingForms(false);
    }
  };

  const handleShowClientForms = async (client) => {
    console.log("Showing forms for client:", client);
    setLoadingClientData(true);
    
    try {
      const clientId = client.userId || client.personalId || client.id;
      console.log("Fetching complete client data for userId:", clientId);
      
      // Fetch all client data sections separately
      const [
        personalDetails,
        employmentDetails,
        incomeDetails,
        expensesDetails,
        assets,
        liabilities,
        goalsAndWishes,
        riskAppetite
      ] = await Promise.allSettled([
        profileApi.getPersonalDetails(clientId),
        profileApi.getEmploymentDetails(clientId).catch(() => null),
        profileApi.getIncomeDetails(clientId).catch(() => null),
        profileApi.getExpensesDetails(clientId).catch(() => null),
        profileApi.getAssets(clientId).catch(() => null),
        profileApi.getLiabilities(clientId).catch(() => []),
        profileApi.getGoalsAndWishes(clientId).catch(() => null),
        profileApi.getRiskAppetite(clientId).catch(() => null)
      ]);
      
      // Extract the values from the settled promises
      const completeClient = {
        ...client,
        ...(personalDetails.status === 'fulfilled' ? personalDetails.value : {}),
        employmentDetails: employmentDetails.status === 'fulfilled' && employmentDetails.value ? [employmentDetails.value] : [],
        incomeDetails: incomeDetails.status === 'fulfilled' && incomeDetails.value ? [incomeDetails.value] : [],
        expensesDetails: expensesDetails.status === 'fulfilled' && expensesDetails.value ? [expensesDetails.value] : [],
        assets: assets.status === 'fulfilled' && assets.value ? [assets.value] : [],
        liabilities: liabilities.status === 'fulfilled' ? liabilities.value : [],
        goalsAndWishes: goalsAndWishes.status === 'fulfilled' ? goalsAndWishes.value : null,
        riskAppetite: riskAppetite.status === 'fulfilled' ? riskAppetite.value : null
      };
      
      console.log("Complete client data after fetching all sections:", completeClient);
      
      setSelectedClient(completeClient);
      setShowClientForms(true);
      setShowClientManagement(false);
      await fetchAvailableForms();
    } catch (error) {
      console.error("Error fetching complete client data:", error);
      // Fallback to basic client data if fetch fails
      console.log("Using fallback client data:", client);
      setSelectedClient(client);
      setShowClientForms(true);
      setShowClientManagement(false);
      await fetchAvailableForms();
    } finally {
      setLoadingClientData(false);
    }
  };

  const handleBackToClientManagement = () => {
    setShowClientForms(false);
    setShowClientManagement(true);
    setSelectedClient(null);
    setSelectedForm(null);
  };

  const handleSelectForm = (form) => {
    console.log("Selected form:", form);
    setSelectedForm(form);
  };

  const handleBackToFormsList = () => {
    setSelectedForm(null);
  };

  // Helper function to get field label from field name
  const getFieldLabel = (fieldName) => {
    const labelMapping = {
      // Personal Details
      'coachId': 'Coach ID',
      'applicantType': 'Applicant Type',
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'streetAddress': 'Street Address',
      'postalCode': 'Postal Code',
      'city': 'City',
      'phone': 'Phone Number',
      'email': 'Email Address',
      'birthDate': 'Date of Birth',
      'birthPlace': 'Place of Birth',
      'maritalStatus': 'Marital Status',
      'nationality': 'Nationality',
      'housing': 'Housing Situation',
      
      // Employment Details
      'employmentType': 'Employment Type',
      'occupation': 'Occupation',
      'contractType': 'Contract Type',
      'contractDuration': 'Contract Duration',
      'employerName': 'Employer Name',
      'employedSince': 'Employed Since',
      
      // Income Details
      'grossIncome': 'Gross Income',
      'netIncome': 'Net Income',
      'taxClass': 'Tax Class',
      'taxId': 'Tax ID',
      'numberOfSalaries': 'Number of Salaries',
      'childBenefit': 'Child Benefit',
      'otherIncome': 'Other Income',
      'incomeTradeBusiness': 'Income from Trade/Business',
      'incomeSelfEmployedWork': 'Income from Self-Employed Work',
      'incomeSideJob': 'Income from Side Job',
      
      // Expenses Details
      'coldRent': 'Cold Rent',
      'electricity': 'Electricity',
      'livingExpenses': 'Living Expenses',
      'gas': 'Gas',
      'telecommunication': 'Telecommunication',
      'accountMaintenanceFee': 'Account Maintenance Fee',
      'alimony': 'Alimony',
      'subscriptions': 'Subscriptions',
      'otherExpenses': 'Other Expenses',
      
      // Assets
      'realEstate': 'Real Estate',
      'securities': 'Securities',
      'bankDeposits': 'Bank Deposits',
      'buildingSavings': 'Building Savings',
      'insuranceValues': 'Insurance Values',
      'otherAssets': 'Other Assets',
      
      // Liabilities
      'loanType': 'Loan Type',
      'loanBank': 'Loan Bank',
      'loanAmount': 'Loan Amount',
      'loanMonthlyRate': 'Monthly Payment',
      'loanInterest': 'Interest Rate'
    };
    
    return labelMapping[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Helper function to get field type from field name
  const getFieldType = (fieldName) => {
    const typeMapping = {
      // Email fields
      'email': 'email',
      
      // Date fields
      'birthDate': 'date',
      'employedSince': 'date',
      
      // Number fields
      'grossIncome': 'number',
      'netIncome': 'number',
      'taxClass': 'number',
      'numberOfSalaries': 'number',
      'childBenefit': 'number',
      'otherIncome': 'number',
      'incomeTradeBusiness': 'number',
      'incomeSelfEmployedWork': 'number',
      'incomeSideJob': 'number',
      'coldRent': 'number',
      'electricity': 'number',
      'livingExpenses': 'number',
      'gas': 'number',
      'telecommunication': 'number',
      'accountMaintenanceFee': 'number',
      'alimony': 'number',
      'subscriptions': 'number',
      'otherExpenses': 'number',
      'realEstate': 'number',
      'securities': 'number',
      'bankDeposits': 'number',
      'buildingSavings': 'number',
      'insuranceValues': 'number',
      'otherAssets': 'number',
      'loanAmount': 'number',
      'loanMonthlyRate': 'number',
      'loanInterest': 'number',
      
      // Select fields
      'applicantType': 'select',
      'maritalStatus': 'select',
      'housing': 'select',
      'employmentType': 'select',
      'contractType': 'select',
      'loanType': 'select'
    };
    
    return typeMapping[fieldName] || 'text';
  };

  // Helper function to get field options for select fields
  const getFieldOptions = (fieldName) => {
    const optionsMapping = {
      'applicantType': [
        { value: 'individual', label: 'Individual' },
        { value: 'couple', label: 'Couple' },
        { value: 'family', label: 'Family' }
      ],
      'maritalStatus': [
        { value: 'single', label: 'Single' },
        { value: 'married', label: 'Married' },
        { value: 'divorced', label: 'Divorced' },
        { value: 'widowed', label: 'Widowed' }
      ],
      'housing': [
        { value: 'rent', label: 'Rent' },
        { value: 'own', label: 'Own' },
        { value: 'family', label: 'Living with Family' }
      ],
      'employmentType': [
        { value: 'full-time', label: 'Full-time' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'self-employed', label: 'Self-employed' },
        { value: 'unemployed', label: 'Unemployed' },
        { value: 'retired', label: 'Retired' }
      ],
      'contractType': [
        { value: 'permanent', label: 'Permanent' },
        { value: 'temporary', label: 'Temporary' },
        { value: 'freelance', label: 'Freelance' }
      ],
      'loanType': [
        { value: 'mortgage', label: 'Mortgage' },
        { value: 'personal', label: 'Personal Loan' },
        { value: 'auto', label: 'Auto Loan' },
        { value: 'credit-card', label: 'Credit Card' },
        { value: 'other', label: 'Other' }
      ]
    };
    
    return optionsMapping[fieldName] || [];
  };

  // Function to get client field value based on field name mapping
  const getClientFieldValue = (fieldName) => {
    if (!selectedClient || !fieldName) {
      console.log("No selectedClient or fieldName:", { selectedClient: !!selectedClient, fieldName });
      return '';
    }
    
    console.log(`Getting value for field: ${fieldName}`);
    
    // Create a comprehensive mapping of field names to client data
    const fieldMapping = {
      // Personal Details - Direct fields
      'coachId': selectedClient.coachId || user?.id || '',
      'firstName': selectedClient.firstName,
      'first_name': selectedClient.firstName,
      'lastname': selectedClient.lastName,
      'lastName': selectedClient.lastName,
      'last_name': selectedClient.lastName,
      'email': selectedClient.email,
      'phone': selectedClient.phone,
      'phoneNumber': selectedClient.phone,
      'phone_number': selectedClient.phone,
      'birthDate': selectedClient.birthDate ? selectedClient.birthDate.split('T')[0] : '',
      'birth_date': selectedClient.birthDate ? selectedClient.birthDate.split('T')[0] : '',
      'dateOfBirth': selectedClient.birthDate ? selectedClient.birthDate.split('T')[0] : '',
      'dob': selectedClient.birthDate ? selectedClient.birthDate.split('T')[0] : '',
      'streetAddress': selectedClient.streetAddress,
      'street_address': selectedClient.streetAddress,
      'address': selectedClient.streetAddress,
      'city': selectedClient.city,
      'postalCode': selectedClient.postalCode,
      'postal_code': selectedClient.postalCode,
      'zipCode': selectedClient.postalCode,
      'zip_code': selectedClient.postalCode,
      'country': selectedClient.country,
      'birthPlace': selectedClient.birthPlace,
      'birth_place': selectedClient.birthPlace,
      'maritalStatus': selectedClient.maritalStatus,
      'marital_status': selectedClient.maritalStatus,
      'nationality': selectedClient.nationality,
      'housing': selectedClient.housing,
      
      // Employment Details - From first employment record
      'employmentType': selectedClient.employmentDetails?.[0]?.employmentType,
      'employment_type': selectedClient.employmentDetails?.[0]?.employmentType,
      'employerName': selectedClient.employmentDetails?.[0]?.employerName,
      'employer_name': selectedClient.employmentDetails?.[0]?.employerName,
      'employer': selectedClient.employmentDetails?.[0]?.employerName,
      'company': selectedClient.employmentDetails?.[0]?.employerName,
      'companyName': selectedClient.employmentDetails?.[0]?.employerName,
      'occupation': selectedClient.employmentDetails?.[0]?.occupation,
      'job': selectedClient.employmentDetails?.[0]?.occupation,
      'position': selectedClient.employmentDetails?.[0]?.occupation,
      'contractType': selectedClient.employmentDetails?.[0]?.contractType,
      'contract_type': selectedClient.employmentDetails?.[0]?.contractType,
      'contractDuration': selectedClient.employmentDetails?.[0]?.contractDuration,
      'contract_duration': selectedClient.employmentDetails?.[0]?.contractDuration,
      'employedSince': selectedClient.employmentDetails?.[0]?.employedSince ? selectedClient.employmentDetails[0].employedSince.split('T')[0] : '',
      'employed_since': selectedClient.employmentDetails?.[0]?.employedSince ? selectedClient.employmentDetails[0].employedSince.split('T')[0] : '',
      'workStartDate': selectedClient.employmentDetails?.[0]?.employedSince ? selectedClient.employmentDetails[0].employedSince.split('T')[0] : '',
      
      // Income Details - From first income record
      'grossIncome': selectedClient.incomeDetails?.[0]?.grossIncome,
      'gross_income': selectedClient.incomeDetails?.[0]?.grossIncome,
      'netIncome': selectedClient.incomeDetails?.[0]?.netIncome,
      'net_income': selectedClient.incomeDetails?.[0]?.netIncome,
      'taxClass': selectedClient.incomeDetails?.[0]?.taxClass,
      'tax_class': selectedClient.incomeDetails?.[0]?.taxClass,
      'taxId': selectedClient.incomeDetails?.[0]?.taxId,
      'tax_id': selectedClient.incomeDetails?.[0]?.taxId,
      'numberOfSalaries': selectedClient.incomeDetails?.[0]?.numberOfSalaries,
      'number_of_salaries': selectedClient.incomeDetails?.[0]?.numberOfSalaries,
      'childBenefit': selectedClient.incomeDetails?.[0]?.childBenefit,
      'child_benefit': selectedClient.incomeDetails?.[0]?.childBenefit,
      'otherIncome': selectedClient.incomeDetails?.[0]?.otherIncome,
      'other_income': selectedClient.incomeDetails?.[0]?.otherIncome,
      'additionalIncome': selectedClient.incomeDetails?.[0]?.otherIncome,
      'additional_income': selectedClient.incomeDetails?.[0]?.otherIncome,
      
      // Expenses Details - From first expense record
      'coldRent': selectedClient.expensesDetails?.[0]?.coldRent,
      'cold_rent': selectedClient.expensesDetails?.[0]?.coldRent,
      'rent': selectedClient.expensesDetails?.[0]?.coldRent,
      'electricity': selectedClient.expensesDetails?.[0]?.electricity,
      'livingExpenses': selectedClient.expensesDetails?.[0]?.livingExpenses,
      'living_expenses': selectedClient.expensesDetails?.[0]?.livingExpenses,
      'gas': selectedClient.expensesDetails?.[0]?.gas,
      'telecommunication': selectedClient.expensesDetails?.[0]?.telecommunication,
      'accountMaintenanceFee': selectedClient.expensesDetails?.[0]?.accountMaintenanceFee,
      'account_maintenance_fee': selectedClient.expensesDetails?.[0]?.accountMaintenanceFee,
      'alimony': selectedClient.expensesDetails?.[0]?.alimony,
      'subscriptions': selectedClient.expensesDetails?.[0]?.subscriptions,
      'otherExpenses': selectedClient.expensesDetails?.[0]?.otherExpenses,
      'other_expenses': selectedClient.expensesDetails?.[0]?.otherExpenses,
      
      // Assets - From first asset record
      'realEstate': selectedClient.assets?.[0]?.realEstate,
      'real_estate': selectedClient.assets?.[0]?.realEstate,
      'securities': selectedClient.assets?.[0]?.securities,
      'bankDeposits': selectedClient.assets?.[0]?.bankDeposits,
      'bank_deposits': selectedClient.assets?.[0]?.bankDeposits,
      'buildingSavings': selectedClient.assets?.[0]?.buildingSavings,
      'building_savings': selectedClient.assets?.[0]?.buildingSavings,
      'insuranceValues': selectedClient.assets?.[0]?.insuranceValues,
      'insurance_values': selectedClient.assets?.[0]?.insuranceValues,
      'otherAssets': selectedClient.assets?.[0]?.otherAssets,
      'other_assets': selectedClient.assets?.[0]?.otherAssets,
      
      // Goals and Wishes
      'retirementPlanning': selectedClient.goalsAndWishes?.retirementPlanning,
      'retirement_planning': selectedClient.goalsAndWishes?.retirementPlanning,
      'capitalFormation': selectedClient.goalsAndWishes?.capitalFormation,
      'capital_formation': selectedClient.goalsAndWishes?.capitalFormation,
      'realEstateGoals': selectedClient.goalsAndWishes?.realEstateGoals,
      'real_estate_goals': selectedClient.goalsAndWishes?.realEstateGoals,
      'financing': selectedClient.goalsAndWishes?.financing,
      'protection': selectedClient.goalsAndWishes?.protection,
      'healthcareProvision': selectedClient.goalsAndWishes?.healthcareProvision,
      'healthcare_provision': selectedClient.goalsAndWishes?.healthcareProvision,
      'otherGoals': selectedClient.goalsAndWishes?.otherGoals,
      'other_goals': selectedClient.goalsAndWishes?.otherGoals,
      
      // Risk Appetite
      'riskAppetite': selectedClient.riskAppetite?.riskAppetite,
      'risk_appetite': selectedClient.riskAppetite?.riskAppetite,
      'investmentHorizon': selectedClient.riskAppetite?.investmentHorizon,
      'investment_horizon': selectedClient.riskAppetite?.investmentHorizon,
      'knowledgeExperience': selectedClient.riskAppetite?.knowledgeExperience,
      'knowledge_experience': selectedClient.riskAppetite?.knowledgeExperience,
      'healthInsurance': selectedClient.riskAppetite?.healthInsurance,
      'health_insurance': selectedClient.riskAppetite?.healthInsurance,
      'healthInsuranceNumber': selectedClient.riskAppetite?.healthInsuranceNumber,
      'health_insurance_number': selectedClient.riskAppetite?.healthInsuranceNumber,
      'healthInsuranceProof': selectedClient.riskAppetite?.healthInsuranceProof,
      'health_insurance_proof': selectedClient.riskAppetite?.healthInsuranceProof,
    };
    
    // Try exact match first
    if (fieldMapping.hasOwnProperty(fieldName)) {
      const value = fieldMapping[fieldName];
      const finalValue = value !== null && value !== undefined ? String(value) : '';
      console.log(`Exact match found for ${fieldName}:`, value, '-> final value:', finalValue);
      return finalValue;
    }
    
    // Try case-insensitive match
    const lowerFieldName = fieldName.toLowerCase();
    for (const [key, value] of Object.entries(fieldMapping)) {
      if (key.toLowerCase() === lowerFieldName) {
        return value !== null && value !== undefined ? String(value) : '';
      }
    }
    
    // Try partial matches for common patterns
    if (lowerFieldName.includes('name')) {
      if (lowerFieldName.includes('first')) {
        return selectedClient.firstName || '';
      }
      if (lowerFieldName.includes('last')) {
        return selectedClient.lastName || '';
      }
      if (lowerFieldName.includes('full')) {
        const fullName = `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim();
        return fullName;
      }
      if (lowerFieldName.includes('employer') || lowerFieldName.includes('company')) {
        const employerName = selectedClient.employmentDetails?.[0]?.employerName;
        return employerName || '';
      }
    }
    
    if (lowerFieldName.includes('address')) {
      return selectedClient.streetAddress || '';
    }
    
    if (lowerFieldName.includes('postal') || lowerFieldName.includes('zip')) {
      return selectedClient.postalCode || '';
    }
    
    if (lowerFieldName.includes('birth') || lowerFieldName.includes('dob')) {
      const birthDate = selectedClient.birthDate ? selectedClient.birthDate.split('T')[0] : '';
      return birthDate;
    }
    
    if (lowerFieldName.includes('income')) {
      if (lowerFieldName.includes('gross')) {
        const grossIncome = selectedClient.incomeDetails?.[0]?.grossIncome;
        return grossIncome ? String(grossIncome) : '';
      }
      if (lowerFieldName.includes('net')) {
        const netIncome = selectedClient.incomeDetails?.[0]?.netIncome;
        return netIncome ? String(netIncome) : '';
      }
    }
    
    // Return empty string if no match found
    console.log(`No value found for field: ${fieldName}`);
    return '';
  };

  const renderStepForm = () => {
    const commonProps = {
      onNext: handleNextStep,
      onPrevious: handlePreviousStep,
      isFirstStep: currentStep === 0,
      isLastStep: currentStep === totalSteps - 1,
    };

    // Use the actual personalId if available, otherwise use a placeholder
    const personalId = currentPersonalId || (isEditMode ? selectedClient?.userId || selectedClient?.personalId || selectedClient?.id : "new-client");

    switch (currentStep) {
      case 0:
        return (
          <PersonalDetailsForm
            {...commonProps}
            initialData={personalDetails ? {
              ...personalDetails,
              coachId: user?.id || personalDetails.coachId
            } : {
              coachId: user?.id || ""
            }}
            createNewClient={!isEditMode} // Only create new client if not in edit mode
            skipApiSave={true} // We handle saving in handleNextStep
          />
        );
      case 1:
        return (
          <EmploymentDetailsForm
            {...commonProps}
            initialData={employmentDetails}
            personalId={personalId}
            skipApiFetch={true} // We pre-load data in edit mode, skip fetching
            skipApiSave={true}  // We handle saving in handleNextStep
          />
        );
      case 2:
        return (
          <IncomeDetailsForm
            {...commonProps}
            initialData={incomeDetails}
            personalId={personalId}
            skipApiFetch={true} // We pre-load data in edit mode, skip fetching
            skipApiSave={true}  // We handle saving in handleNextStep
          />
        );
      case 3:
        return (
          <ExpensesDetailsForm
            {...commonProps}
            initialData={expensesDetails}
            personalId={personalId}
            skipApiFetch={true} // We pre-load data in edit mode, skip fetching
            skipApiSave={true}  // We handle saving in handleNextStep
          />
        );
      case 4:
        return (
          <AssetsForm
            {...commonProps}
            initialData={assetsDetails}
            personalId={personalId}
            skipApiFetch={true} // We pre-load data in edit mode, skip fetching
            skipApiSave={true}  // We handle saving in handleNextStep
          />
        );
      case 5:
        return (
          <LiabilitiesForm
            {...commonProps}
            initialData={liabilitiesDetails}
            personalId={personalId}
            skipApiFetch={true} // We pre-load data in edit mode, skip fetching
            skipApiSave={true}  // We handle saving in handleNextStep
          />
        );
      case 6:
        return (
          <GoalsAndWishesForm
            {...commonProps}
            initialData={goalsAndWishesDetails}
            personalId={personalId}
            skipApiFetch={true} // We pre-load data in edit mode, skip fetching
            skipApiSave={true}  // We handle saving in handleNextStep
          />
        );
      case 7:
        return (
          <RiskAppetiteForm
            {...commonProps}
            initialData={riskAppetiteDetails}
            personalId={personalId}
            skipApiFetch={true} // We pre-load data in edit mode, skip fetching
            skipApiSave={true}  // We handle saving in handleNextStep
          />
        );
      default:
        return null;
    }
  };

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = !searchTerm || 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // If showing create client form
  if (showCreateClient) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'md:w-20' : 'md:w-64'} bg-card border-r border-border transition-all duration-300`}>
          <div className="flex flex-col h-full">
            <div className={`${themeColor} p-4 flex items-center justify-between`}>
              {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">Coach</h1>}
              <button 
                onClick={toggleSidebar} 
                className="text-white p-1 rounded-md hover:bg-black/10"
              >
                {sidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-card border-b border-border">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateClient(false);
                    setIsEditMode(false);
                    setSelectedClient(null);
                  }}
                  className="text-sm"
                >
                  ← Back to Clients
                </Button>
                <div className="flex items-center gap-2">
                  <Logo />
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
            <div className="max-w-4xl mx-auto">
              <StepProgress 
                currentStep={currentStep} 
                totalSteps={totalSteps}
                onStepClick={handleStepClick}
                isEditMode={isEditMode}
                clientName={selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : ""}
              />
              {renderStepForm()}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If showing client forms
  if (showClientForms) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'md:w-20' : 'md:w-64'} bg-card border-r border-border transition-all duration-300`}>
          <div className="flex flex-col h-full">
            <div className={`${themeColor} p-4 flex items-center justify-between`}>
              {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">Coach</h1>}
              <button 
                onClick={toggleSidebar} 
                className="text-white p-1 rounded-md hover:bg-black/10"
              >
                {sidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-card border-b border-border">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={selectedForm ? handleBackToFormsList : handleBackToClientManagement}
                  className="text-sm"
                >
                  ← {selectedForm ? 'Back to Forms' : 'Back to Clients'}
                </Button>
                <div className="flex items-center gap-2">
                  <Logo />
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
            <div className="max-w-7xl mx-auto">
              {selectedForm ? (
                // Form Renderer View
                <Card className="shadow-sm">
                  <CardHeader className="bg-background border-b">
                    <CardTitle className="text-2xl font-bold">
                      {selectedForm.name} - {selectedClient?.firstName} {selectedClient?.lastName}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {selectedForm.description || 'Complete this form with client information'}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4 mb-6">
                      <p className="text-teal-800 dark:text-teal-200 text-sm">
                        <strong>Note:</strong> This form will be populated with {selectedClient?.firstName}'s profile data where applicable.
                      </p>
                    </div>
                    
                    {loadingClientData && (
                      <div className="text-center py-8 mb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading client data...</p>
                      </div>
                    )}
                    
                    {/* Form sections will be rendered here */}
                    {!loadingClientData && (
                    <div className="space-y-6">
                      {console.log("Rendering form with selectedClient:", selectedClient)}
                      {console.log("Form sections:", selectedForm.sections)}
                      {selectedForm.sections && selectedForm.sections.map((section, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-black dark:bg-black shadow-sm">
                          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 bg-black">
                            {section.sectionType || `Section ${index + 1}`}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {section.showFields && section.showFields.map((fieldName, fieldIndex) => {
                              const fieldValue = getClientFieldValue(fieldName);
                              const fieldLabel = getFieldLabel(fieldName);
                              const fieldType = getFieldType(fieldName);
                              console.log(`Field ${fieldName}: value="${fieldValue}", label="${fieldLabel}", type="${fieldType}"`);
                              
                                                              return (
                                  <div key={fieldIndex} className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {fieldLabel}
                                      <span className="text-red-500 ml-1">*</span>
                                    </label>
                                                                      {fieldType === 'email' && (
                                      <input
                                        type="email"
                                        name={fieldName}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-black dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                        placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                                        defaultValue={fieldValue}
                                      />
                                    )}
                                                                      {fieldType === 'date' && (
                                      <input
                                        type="date"
                                        name={fieldName}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-black dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                        defaultValue={fieldValue}
                                      />
                                    )}
                                                                      {fieldType === 'number' && (
                                      <input
                                        type="number"
                                        name={fieldName}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-black dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                        placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                                        defaultValue={fieldValue}
                                        step="0.01"
                                      />
                                    )}
                                                                      {fieldType === 'select' && (
                                      <select 
                                        name={fieldName}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-black dark:bg-black text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                        defaultValue={fieldValue}
                                      >
                                                                              <option value="" className="text-gray-500">Select {fieldLabel}</option>
                                        {getFieldOptions(fieldName).map((option, optIndex) => (
                                          <option 
                                            key={optIndex} 
                                            value={option.value}
                                            className="text-gray-900 dark:text-gray-100"
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                    </select>
                                  )}
                                                                      {fieldType === 'text' && (
                                      <input
                                        type="text"
                                        name={fieldName}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-black dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                        placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                                        defaultValue={fieldValue}
                                      />
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      
                      {/* Consent Form Section */}
                      {selectedForm.consentForm && selectedForm.consentForm.enabled && (
                        <div className="border border-teal-200 dark:border-teal-700 rounded-lg p-6 bg-teal-50 dark:bg-teal-900/20 shadow-sm">
                          <h3 className="text-lg font-semibold mb-6 text-teal-800 dark:text-teal-200 border-b border-teal-200 dark:border-teal-700 pb-2">Consent & Agreement</h3>
                          <div className="space-y-4">
                            {selectedForm.consentForm.introText && (
                              <p className="text-sm text-teal-700 dark:text-teal-300 mb-4">
                                {selectedForm.consentForm.introText}
                              </p>
                            )}
                            {selectedForm.consentForm.sections && selectedForm.consentForm.sections.map((section, index) => (
                              <div key={index} className="bg-black dark:bg-gray-800 p-4 rounded-lg border border-teal-200 dark:border-teal-700 shadow-sm">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{section.title}</h4>
                                {section.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{section.description}</p>
                                )}
                                <div className="flex items-start space-x-3">
                                  <input
                                    type="checkbox"
                                    id={`consent-${section.id}`}
                                    name={`consent-${section.id}`}
                                    className="mt-1 rounded border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500 bg-black"
                                    required={section.required}
                                  />
                                  <label htmlFor={`consent-${section.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                                    {section.text || section.defaultText}
                                    {section.required && <span className="text-red-500 ml-1">*</span>}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    )}
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        variant="outline" 
                        onClick={handleBackToFormsList}
                        className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button className={`${themeColor} ${themeColorHover} text-white px-6 py-2 font-medium shadow-sm`}>
                        Submit Form
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Forms List View
                <Card className="shadow-sm">
                  <CardHeader className="bg-background border-b">
                    <CardTitle className="text-2xl font-bold">
                      Available Forms for {selectedClient?.firstName} {selectedClient?.lastName}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Select a form to complete with client information
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingForms ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading available forms...</p>
                      </div>
                    ) : availableForms.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <div className="text-4xl mb-4">📋</div>
                        <p className="text-lg font-medium mb-2">No forms available</p>
                        <p className="text-sm">
                          No active forms have been configured by administrators yet.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {availableForms.map((form) => (
                          <div key={form.id} className="p-6 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                  {form.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {form.description || 'No description available'}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    {form.formType}
                                  </span>
                                  <span>Version {form.version}</span>
                                  <span>{form.sections?.length || 0} sections</span>
                                  <span>
                                    Created {new Date(form.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleSelectForm(form)}
                                className={`${themeColor} ${themeColorHover} text-white ml-4`}
                              >
                                <FormIcon className="w-4 h-4 mr-2" />
                                Open Form
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // If showing client management
  if (showClientManagement) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'md:w-20' : 'md:w-64'} bg-card border-r border-border transition-all duration-300`}>
          <div className="flex flex-col h-full">
            <div className={`${themeColor} p-4 flex items-center justify-between`}>
              {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">Coach</h1>}
              <button 
                onClick={toggleSidebar} 
                className="text-white p-1 rounded-md hover:bg-black/10"
              >
                {sidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
              </button>
            </div>
            <div className="p-4 flex-1">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-colors w-full text-left ${
                      activeMenuItem === item.id
                        ? `${themeColor} text-white`
                        : `text-foreground hover:${themeLightBg}`
                    }`}
                  >
                    <span>{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-card border-b border-border">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <Logo />
                </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <LanguageSwitcher />
                <button 
                  className="rounded-full bg-secondary/50 p-2"
                  onClick={toggleTheme}
                >
                  <ThemeIcon />
                </button>
                <button className="rounded-full bg-secondary/50 p-2 relative">
                  <NotificationIcon />
                  <span className={`absolute top-0 right-0 ${themeColor} text-white rounded-full text-xs w-4 h-4 flex items-center justify-center`}>2</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
            <div className="max-w-7xl mx-auto">
              {/* Client Management Header */}
              <Card className="shadow-sm mb-6">
                <CardHeader className="bg-background border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-2xl font-bold">
                      Client Management ({filteredClients.length})
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48"
                      />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <Button 
                        onClick={handleCreateClient}
                        className={`${themeColor} ${themeColorHover} text-white`}
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Client
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingClients ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading clients...</p>
                    </div>
                  ) : filteredClients.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-lg font-medium mb-2">No clients found</p>
                      <p className="text-sm">
                        {clients.length === 0 
                          ? "Create your first client to get started"
                          : "Try adjusting your search or filter criteria"
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredClients.map((client) => (
                        <div key={client.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <img 
                                src={`https://randomuser.me/api/portraits/${client.id % 2 === 0 ? 'women' : 'men'}/${20 + client.id}.jpg`} 
                                alt={`${client.firstName} ${client.lastName}`}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground">
                                  {client.firstName} {client.lastName}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span>{client.email}</span>
                                  <span>{client.phone}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    client.status === 'active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                  }`}>
                                    {client.status === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span>Profile: {client.profileCompletion}%</span>
                                  <span>Forms: {client.formsCompleted}/{client.totalForms}</span>
                                  <span>Joined: {new Date(client.joinDate).toLocaleDateString()}</span>
                                  <span>Last Active: {new Date(client.lastActivity).toLocaleDateString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${client.profileCompletion}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClient(client)}
                                className="text-xs"
                              >
                                <EditIcon className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleShowClientForms(client)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                <FormIcon className="w-3 h-3 mr-1" />
                                Forms
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleClientStatus(client.id)}
                                className={`text-xs ${client.status === 'active' ? 'text-orange-600' : 'text-green-600'}`}
                              >
                                {client.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClient(client.id)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Default dashboard view
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleMobileSidebar}></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          ${showMobileSidebar ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} 
          md:flex md:relative md:z-auto 
          ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'} 
          bg-card border-r border-border transition-all duration-300
        `}
      >
        <div className="flex flex-col h-full">
          <div className={`${themeColor} p-4 flex items-center justify-between`}>
            {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">Coach</h1>}
            <button 
              onClick={toggleSidebar} 
              className="text-white p-1 rounded-md hover:bg-black/10 hidden md:block"
            >
              {sidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
            </button>
          </div>
          <div className="p-4 flex-1">
            {!sidebarCollapsed && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Coach" 
                    className="w-12 h-12 rounded-full border-2 border-blue-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-foreground">Sarah Johnson</h2>
                    <p className="text-xs text-muted-foreground">Certified Financial Coach</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Clients</span>
                    <span className="font-medium">{clients.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Active</span>
                    <span className="font-medium">{clients.filter(c => c.status === 'active').length}</span>
                  </div>
                </div>
              </div>
            )}
            
            {sidebarCollapsed && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Coach" 
                    className="w-10 h-10 rounded-full border-2 border-blue-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            )}
            
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-colors w-full text-left ${
                    activeMenuItem === item.id
                      ? `${themeColor} text-white`
                      : `text-foreground hover:${themeLightBg}`
                  }`}
                >
                  <span>{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-colors text-foreground hover:bg-red-500/10 mt-8 w-full text-left`}
              >
                <span><LogoutIcon /></span>
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center space-x-3">
              <button className="md:hidden" onClick={toggleMobileSidebar}>
                <MenuIcon />
              </button>
              <div className="flex items-center gap-2">
                <Logo />
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative hidden md:block">
                <input 
                  type="text"
                  placeholder="Search..."
                  className="bg-secondary/50 rounded-full px-4 py-1.5 pl-10 text-sm w-48 md:w-64"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <SearchIcon />
                </span>
              </div>
              
              <LanguageSwitcher />
              
              <button 
                className="rounded-full bg-secondary/50 p-2 hidden md:block"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <ThemeIcon />
              </button>
              <button className="rounded-full bg-secondary/50 p-2 relative">
                <NotificationIcon />
                <span className={`absolute top-0 right-0 ${themeColor} text-white rounded-full text-xs w-4 h-4 flex items-center justify-center`}>2</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back, Coach!</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening with your clients today.</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <ClockIcon />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className={`${themeLightBg} p-4 md:p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Clients</h3>
                    <p className="text-2xl font-bold">{loadingClients ? "..." : clients.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {clients.filter(c => c.status === 'active').length} active
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <UsersIcon />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className={`${themeLightBg} p-4 md:p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Profile Completion</h3>
                    <p className="text-2xl font-bold">
                      {loadingClients ? "..." : clients.length > 0 ? Math.round(clients.reduce((sum, c) => sum + c.profileCompletion, 0) / clients.length) + "%" : "0%"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average across all clients
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TargetIcon />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className={`${themeLightBg} p-4 md:p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Forms Completed</h3>
                    <p className="text-2xl font-bold">
                      {loadingClients ? "..." : clients.reduce((sum, c) => sum + c.formsCompleted, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total across all clients
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <ClipboardIcon />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className={`${themeLightBg} p-4 md:p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">This Month</h3>
                    <p className="text-2xl font-bold">
                      {clients.filter(c => {
                        const joinDate = new Date(c.joinDate);
                        const now = new Date();
                        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      New clients joined
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <TrendingUpIcon />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ActivityIcon className="mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleCreateClient}
                  className={`${themeColor} ${themeColorHover} text-white w-full justify-start`}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add New Client
                </Button>
                <Button 
                  onClick={() => handleMenuClick("clients")}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <ClientsIcon className="mr-2 h-4 w-4" />
                  Manage Clients
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <FormsIcon className="mr-2 h-4 w-4" />
                  View All Forms
                </Button>
              </CardContent>
            </Card>

            {/* Recent Client Activity */}
            <Card className="shadow-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <ClockIcon className="mr-2" />
                    Recent Client Activity
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMenuClick("clients")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingClients ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading client data...</p>
                    </div>
                  ) : clients.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-lg font-medium mb-2">No clients yet</p>
                      <p className="text-sm">Add your first client to get started</p>
                      <Button 
                        onClick={handleCreateClient}
                        className={`${themeColor} ${themeColorHover} text-white mt-4`}
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add First Client
                      </Button>
                    </div>
                  ) : (
                    clients.slice(0, 5).map((client, index) => (
                      <div key={client.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={`https://randomuser.me/api/portraits/${client.id % 2 === 0 ? 'women' : 'men'}/${20 + (client.id || 1)}.jpg`} 
                            alt="Client" 
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{client.firstName} {client.lastName}</p>
                            <p className="text-sm text-muted-foreground">
                              Profile: {client.profileCompletion}% complete • 
                              Last active: {new Date(client.lastActivity).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${client.profileCompletion}%` }}
                            ></div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditClient(client)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Sessions & Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <CalendarIcon className="mr-2" />
                    Upcoming Sessions
                  </CardTitle>
                  <Button size="sm" className={`${themeColor} ${themeColorHover} text-white`}>
                    <CalendarIcon className="mr-2 h-4 w-4" /> 
                    Schedule New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { client: "John Smith", type: "Initial Assessment", time: "Today, 3:00 PM", status: "confirmed" },
                    { client: "Sarah Johnson", type: "Follow-up Session", time: "Tomorrow, 10:00 AM", status: "pending" },
                    { client: "Mike Wilson", type: "Financial Review", time: "Dec 28, 2:00 PM", status: "confirmed" }
                  ].map((session, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                      <div className={`${themeColor} rounded-full p-2 text-white flex-shrink-0`}>
                        <CalendarIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{session.type}</p>
                            <p className="text-sm text-muted-foreground">{session.client}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            session.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{session.time}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Join Meeting
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <TargetIcon className="mr-2" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Client Onboarding</span>
                      <span className="text-sm text-muted-foreground">
                        {clients.filter(c => c.profileCompletion >= 80).length}/{clients.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${clients.length > 0 ? (clients.filter(c => c.profileCompletion >= 80).length / clients.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Active Engagement</span>
                      <span className="text-sm text-muted-foreground">
                        {clients.filter(c => c.status === 'active').length}/{clients.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${clients.length > 0 ? (clients.filter(c => c.status === 'active').length / clients.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Form Completion Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {clients.reduce((sum, c) => sum + c.formsCompleted, 0)}/{clients.length * 8}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${clients.length > 0 ? (clients.reduce((sum, c) => sum + c.formsCompleted, 0) / (clients.length * 8)) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-3">This Month's Goals</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>New Clients</span>
                        <span className="font-medium">5/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sessions Completed</span>
                        <span className="font-medium">12/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Forms Processed</span>
                        <span className="font-medium">25/40</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activities & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ActivityIcon className="mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      type: 'profile_update', 
                      client: 'Emily Parker', 
                      action: 'Updated employment details', 
                      time: '2 hours ago',
                      icon: <EditIcon />,
                      color: 'bg-blue-500'
                    },
                    { 
                      type: 'form_submission', 
                      client: 'Michael Thompson', 
                      action: 'Submitted risk assessment form', 
                      time: '4 hours ago',
                      icon: <ClipboardIcon />,
                      color: 'bg-green-500'
                    },
                    { 
                      type: 'session_completed', 
                      client: 'Sarah Wilson', 
                      action: 'Completed initial consultation', 
                      time: '1 day ago',
                      icon: <CheckCircleIcon />,
                      color: 'bg-purple-500'
                    },
                    { 
                      type: 'message', 
                      client: 'John Smith', 
                      action: 'Sent a message about investment goals', 
                      time: '2 days ago',
                      icon: <MessageIcon />,
                      color: 'bg-orange-500'
                    },
                    { 
                      type: 'new_client', 
                      client: 'Lisa Chen', 
                      action: 'Joined as a new client', 
                      time: '3 days ago',
                      icon: <PlusIcon />,
                      color: 'bg-indigo-500'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`${activity.color} rounded-full p-2 text-white flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.client}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <TrendingUpIcon className="mr-2" />
                  Insights & Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Client Engagement</h4>
                      <span className="text-sm font-medium text-blue-600">+15%</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Client activity has increased this month compared to last month.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-900 dark:text-green-100">Form Completion</h4>
                      <span className="text-sm font-medium text-green-600">+8%</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      More clients are completing their profile forms on time.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100">Session Success</h4>
                      <span className="text-sm font-medium text-purple-600">92%</span>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      High satisfaction rate from completed coaching sessions.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-3">Quick Tips</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Follow up with clients who haven't completed their profiles
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Schedule regular check-ins to maintain engagement
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        Use the Forms feature to gather comprehensive client data
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CoachDashboard; 