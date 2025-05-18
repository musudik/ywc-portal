import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useTranslation } from "react-i18next";
import { profileApi } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import DashboardLayout from "../../components/dashboard/layout";

// Icon components
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

// Navigation tabs for settings page
// const SettingsTabs = () => {
//   const tabs = [
//     { name: "Account", active: true },
//     { name: "Real Estate", active: false },
//     { name: "Loans", active: false },
//     { name: "Insurance", active: false },
//     { name: "KFZ", active: false },
//     { name: "Electricity", active: false },
//     { name: "Sanuspay", active: false },
//     { name: "Gems", active: false },
//     { name: "Miscellaneous", active: false }
//   ];

//   return (
//     <div className="overflow-x-auto">
//       <nav className="flex border-b border-muted mb-8 min-w-max">
//         {tabs.map((tab, index) => (
//           <a 
//             key={index}
//             href="#" 
//             className={`px-4 py-3 text-sm whitespace-nowrap ${tab.active ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
//           >
//             {tab.name}
//           </a>
//         ))}
//       </nav>
//     </div>
//   );
// };

function Dashboard() {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
            verificationStatus: authUser.verificationStatus || "unverified",
            displayName: authUser.displayName || `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || 'User'
          });
        } else {
          const profileResponse = await profileApi.getProfile();
          setProfileData(profileResponse);
        }
        
        // Get verification status
        // try {
        //   const verificationResponse = await profileApi.getVerificationStatus();
        //   setVerificationStatus(verificationResponse);
        // } catch (verificationError) {
        //   console.error("Failed to fetch verification status:", verificationError);
        //   // Use default value if API fails
        //   setVerificationStatus({ 
        //     status: profileData?.verificationStatus || "unverified", 
        //     message: "Verification status could not be retrieved" 
        //   });
        // }
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
            verificationStatus: "unverified",
            displayName: authUser.displayName || `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || 'User'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser]);

  const handleVerifyAccount = async () => {
    // try {
    //   await profileApi.requestVerification();
    //   alert("Verification request submitted successfully!");
    //   // Refresh verification status
    //   const verificationResponse = await profileApi.getVerificationStatus();
    //   setVerificationStatus(verificationResponse);
    // } catch (err) {
    //   console.error("Failed to request verification:", err);
    //   alert("Failed to submit verification request. Please try again later.");
    // }
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
        return (
          <div className="flex items-center text-green-600">
            <VerifyIcon />
            <span className="ml-2">{t("Verified")}</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hourglass">
              <path d="M5 22h14" />
              <path d="M5 2h14" />
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            </svg>
            <span className="ml-2">{t("Pending")}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span className="ml-2">{t("Not Verified")}</span>
          </div>
        );
    }
  };
  
  // Content for the Dashboard page
  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center p-6 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            {t("Try Again")}
          </Button>
        </div>
      );
    }
    
    return (
      <>
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-green-500/10 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {t("Welcome back")}, {profileData?.displayName || 'User'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("Here's what's happening with your account today.")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <VerifyIcon className="mr-2" />
                {t("Verify Account")}
              </Button>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-700">
                <TwoFactorIcon className="mr-2" />
                {t("Enable 2FA")}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Account Overview Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("Account Overview")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">{t("Account Status")}</h3>
                    {getVerificationStatusDisplay()}
                  </div>
                  <div className="p-2 rounded-full bg-green-500/10 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm">{verificationStatus?.message || t("Verify your account to unlock all features.")}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">{t("Account Type")}</h3>
                    <p className="font-medium">{profileData?.accountType || 'Personal'}</p>
                  </div>
                  <div className="p-2 rounded-full bg-green-500/10 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm">{t("Standard account with basic features")}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">{t("Member Since")}</h3>
                    <p className="font-medium">{formatDate(profileData?.joinedDate || new Date())}</p>
                  </div>
                  <div className="p-2 rounded-full bg-green-500/10 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm">{t("Member for")} {Math.floor((new Date() - new Date(profileData?.joinedDate || new Date())) / (1000 * 60 * 60 * 24))} {t("days")}</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Quick Actions Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("Quick Actions")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/client/profile" className="group">
              <Card className="hover:border-green-500 transition-all">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-green-500/10 text-green-600 mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">{t("Edit Profile")}</h3>
                  <p className="text-sm text-muted-foreground">{t("Update your personal information")}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/client/forms" className="group">
              <Card className="hover:border-green-500 transition-all">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-green-500/10 text-green-600 mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">{t("Forms")}</h3>
                  <p className="text-sm text-muted-foreground">{t("Manage your application forms")}</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/client/settings" className="group">
              <Card className="hover:border-green-500 transition-all">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-green-500/10 text-green-600 mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">{t("Account Settings")}</h3>
                  <p className="text-sm text-muted-foreground">{t("Manage your preferences")}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/client/help" className="group">
              <Card className="hover:border-green-500 transition-all">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-green-500/10 text-green-600 mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">{t("Help & Support")}</h3>
                  <p className="text-sm text-muted-foreground">{t("Get assistance when needed")}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </>
    );
  };

  return (
    <DashboardLayout>
      {renderDashboardContent()}
    </DashboardLayout>
  );
}

export default Dashboard; 