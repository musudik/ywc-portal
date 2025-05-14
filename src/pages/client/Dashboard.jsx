import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";
import { useTheme } from "../../components/ui/ThemeProvider";
import { useTranslation } from "react-i18next";
import { profileApi } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";

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

const FullScreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize">
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.435-.29.704 0 .253.088.506.29.722.174.18.435.288.704.288.253 0 .506-.088.722-.297L16.544 12 5.036 0.397C4.649 0.01 4.069 0.01 3.682 0.397 3.295 0.784 3.295 1.364 3.609 1.814z" />
    <path d="M14.8 12L20.4 6.4C20.7 6.1 20.7 5.5 20.4 5.1 20 4.8 19.5 4.8 19.1 5.1L13.5 10.7 14.8 12z" />
    <path d="M14.8 12l-1.3 1.3 5.6 5.6c0.2 0.2 0.4 0.3 0.7 0.3 0.2 0 0.5-0.1 0.7-0.3 0.4-0.4 0.4-0.9 0-1.3L14.8 12z" />
    <path d="M3.4 0.8C3.2 0.9 0 2.7 0 12 0 21.3 3.2 23.1 3.4 23.2 3.5 23.3 3.7 23.3 3.8 23.3 4 23.3 4.1 23.3 4.3 23.1 4.6 22.8 4.6 22.2 4.3 21.9 4.2 21.8 1.3 20.3 1.3 12 1.3 3.7 4.2 2.2 4.3 2.1 4.6 1.8 4.7 1.2 4.3 0.9 4.1 0.8 3.7 0.7 3.4 0.8z" />
  </svg>
);

const AppleStoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const VerifyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const TwoFactorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const EnfixLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#1DB954" fillOpacity="0.1"/>
    <path d="M28.2222 11.7778H11.7778V28.2222H28.2222V11.7778Z" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.7778 20H28.2222" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 11.7778V28.2222" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

// Navigation tabs for settings page
const SettingsTabs = () => {
  const tabs = [
    { name: "Account", active: true },
    { name: "Real Estate", active: false },
    { name: "Loans", active: false },
    { name: "Insurance", active: false },
    { name: "KFZ", active: false },
    { name: "Electricity", active: false },
    { name: "Sanuspay", active: false },
    { name: "Gems", active: false },
    { name: "Miscellaneous", active: false }
  ];

  return (
    <div className="overflow-x-auto">
      <nav className="flex border-b border-muted mb-8 min-w-max">
        {tabs.map((tab, index) => (
          <a 
            key={index}
            href="#" 
            className={`px-4 py-3 text-sm whitespace-nowrap ${tab.active ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            {tab.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

function Dashboard() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Client theme color - Green
  const themeColor = "bg-green-600";
  const themeColorHover = "hover:bg-green-700";
  const themeLightBg = "bg-green-500/10";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <HomeIcon /> },
    { id: "profile", label: "Profile", icon: <ProfileIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> }
  ];

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the authUser data if available, otherwise fetch from API
        if (authUser) {
          setProfileData({
            ...authUser,
            // Add default values for fields that might not be in authUser
            joinedDate: authUser.joinedDate || new Date().toISOString(),
            accountType: authUser.accountType || "Personal",
            country: authUser.country || "Unknown",
            userId: authUser.id || "N/A",
            verificationStatus: authUser.verificationStatus || "unverified"
          });
        } else {
          const profileResponse = await profileApi.getProfile();
          setProfileData(profileResponse);
        }
        
        // Get verification status
        try {
          const verificationResponse = await profileApi.getVerificationStatus();
          setVerificationStatus(verificationResponse);
        } catch (verificationError) {
          console.error("Failed to fetch verification status:", verificationError);
          // Use default value if API fails
          setVerificationStatus({ 
            status: profileData?.verificationStatus || "unverified", 
            message: "Verification status could not be retrieved" 
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Failed to load profile data. Please try again later.");
        
        // Use auth user data as fallback if API fails
        if (authUser) {
          setProfileData({
            ...authUser,
            joinedDate: new Date().toISOString(),
            accountType: "Personal",
            country: "Unknown",
            verificationStatus: "unverified"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser]);

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

  const handleVerifyAccount = async () => {
    try {
      await profileApi.requestVerification();
      alert("Verification request submitted successfully!");
      // Refresh verification status
      const verificationResponse = await profileApi.getVerificationStatus();
      setVerificationStatus(verificationResponse);
    } catch (err) {
      console.error("Failed to request verification:", err);
      alert("Failed to submit verification request. Please try again later.");
    }
  };
  
  // Format date function
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (err) {
      return "N/A";
    }
  };

  // Get verification status display
  const getVerificationStatusDisplay = () => {
    const status = verificationStatus?.status || profileData?.verificationStatus || "unverified";
    
    switch (status.toLowerCase()) {
      case "verified":
        return <span className="text-green-500 font-medium">Verified</span>;
      case "pending":
        return <span className="text-amber-500 font-medium">Pending</span>;
      case "unverified":
      default:
        return <span className="text-amber-500 font-medium">Unverified</span>;
    }
  };
  
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
            {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">Client</h1>}
            <button 
              onClick={toggleSidebar} 
              className="text-white p-1 rounded-md hover:bg-white/10 hidden md:block"
            >
              {sidebarCollapsed ? <ExpandIcon /> : <CollapseIcon />}
            </button>
          </div>
          <div className="p-4 flex-1">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src={profileData?.profileImage || "https://randomuser.me/api/portraits/men/34.jpg"} 
                  alt="User" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-medium">{profileData?.displayName || "Loading..."}</h2>
                  <p className="text-xs text-muted-foreground">{profileData?.role?.name || "Client"}</p>
                </div>
              </div>
            )}
            
            {sidebarCollapsed && (
              <div className="flex justify-center mb-6">
                <img 
                  src={profileData?.profileImage || "https://randomuser.me/api/portraits/men/34.jpg"} 
                  alt="User" 
                  className="w-10 h-10 rounded-full"
                />
              </div>
            )}
            
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/client/${item.id}`}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-colors ${
                    activeMenuItem === item.id
                      ? `${themeColor} text-white`
                      : `text-foreground hover:${themeLightBg}`
                  }`}
                  onClick={() => {
                    setActiveMenuItem(item.id);
                    setShowMobileSidebar(false);
                  }}
                >
                  <span>{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
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
              <h2 className="text-lg font-medium">
                Welcome, {profileData?.displayName || "User"}
              </h2>
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
                <span className={`absolute top-0 right-0 ${themeColor} text-white rounded-full text-xs w-4 h-4 flex items-center justify-center`}>3</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-6">
                <div className="text-red-500">{error}</div>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-primary hover:bg-primary/90"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <SettingsTabs />

              {/* User Profile Section */}
              <Card className="mb-6 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="relative mb-4 md:mb-0 md:mr-4">
                      <img 
                        src={profileData?.profileImage || "https://randomuser.me/api/portraits/men/34.jpg"} 
                        alt="User" 
                        className="w-16 h-16 rounded-full"
                      />
                    </div>
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-xl font-bold">Welcome, {profileData?.displayName}</h2>
                      <p className="text-muted-foreground text-sm">
                        {verificationStatus?.status === "verified" 
                          ? "Your account is verified. Enjoy the full potential of enfix." 
                          : "Looks like you are not verified yet. Verify yourself to use the full potential of enfix."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {verificationStatus?.status !== "verified" && (
                      <Button 
                        onClick={handleVerifyAccount}
                        className={`${themeColor} ${themeColorHover} text-white rounded-full flex items-center`}
                      >
                        <VerifyIcon className="mr-2" />
                        Verify account
                      </Button>
                    )}
                    <Button variant="outline" className="bg-secondary/30 hover:bg-secondary/50 border-none text-foreground rounded-full flex items-center">
                      <TwoFactorIcon className="mr-2" />
                      Two-factor authentication (2FA)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Section */}
              <Card className="mb-6 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Verify & Upgrade</h3>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium">Account Status : </span>
                        {getVerificationStatusDisplay()}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {verificationStatus?.message || 
                        (verificationStatus?.status === "verified" 
                          ? "Your account is verified. You can now access all features." 
                          : "Your account is unverified. Get verified to enable funding, trading, and withdrawal.")}
                    </p>
                  </div>
                  {verificationStatus?.status !== "verified" && (
                    <Button 
                      onClick={handleVerifyAccount}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Get Verified
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Information Section */}
              <Card className="mb-6 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Information</h3>
                    <Button 
                      variant="outline" 
                      className="bg-secondary/30 hover:bg-secondary/50 border-none text-primary rounded-md flex items-center"
                      onClick={() => navigate('/client/profile')}
                    >
                      <EditIcon className="mr-2" />
                      Edit
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase mb-1">USER ID</h4>
                      <p className="font-medium">{profileData?.userId || profileData?.id || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase mb-1">EMAIL ADDRESS</h4>
                      <p className="font-medium">{profileData?.email || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase mb-1">JOINED SINCE</h4>
                      <p className="font-medium">{formatDate(profileData?.joinedDate)}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase mb-1">TYPE</h4>
                      <p className="font-medium">{profileData?.accountType || "Personal"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase mb-1">COUNTRY OF RESIDENCE</h4>
                      <p className="font-medium">{profileData?.country || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase mb-1">PHONE NUMBER</h4>
                      <p className="font-medium">{profileData?.phoneNumber || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Download Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold">Download App</h3>
                    </div>
                    <div className="mb-6">
                      <h4 className="text-base font-medium mb-2">Get Verified On Our Mobile App</h4>
                      <p className="text-muted-foreground text-sm">Verifying your identity on our mobile app more secure, faster, and reliable.</p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" className="bg-secondary/30 hover:bg-secondary/50 border-none text-foreground rounded-md flex items-center">
                        <GooglePlayIcon className="mr-2" />
                        Google Play
                      </Button>
                      <Button variant="outline" className="bg-secondary/30 hover:bg-secondary/50 border-none text-foreground rounded-md flex items-center">
                        <AppleStoreIcon className="mr-2" />
                        App Store
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold">Earn 30% Commission</h3>
                    </div>
                    <div className="mb-6">
                      <p className="text-muted-foreground text-sm">Refer your friends and earn 30% of their trading fees.</p>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Referral Program
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard; 