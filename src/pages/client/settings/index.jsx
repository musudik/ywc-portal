import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../../../components/ui/card";
import DashboardLayout from "../../../components/dashboard/layout";

// Icon components
const ThemeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const PrivacyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <path d="M12 15a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1v0a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1v0Z"/>
  </svg>
);

const LanguageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

const AccessibilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="4" r="1" />
    <path d="m18 19 1-7-6 1" />
    <path d="m5 8 3-3 5 1-5 3z" />
    <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
    <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
  </svg>
);

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 13v4" />
  </svg>
);

const AvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);

const ClientSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation items with routes
  const navigationItems = [
    { id: "account", label: "Account", icon: <AccountIcon />, path: "/client/settings/account" },
    { id: "appearance", label: "Appearance", icon: <ThemeIcon />, path: "/client/settings/appearance" },
    { id: "notifications", label: "Notifications", icon: <NotificationIcon />, path: "/client/settings/notifications" },
    { id: "privacy", label: "Privacy", icon: <PrivacyIcon />, path: "/client/settings/privacy" },
    { id: "language", label: "Language", icon: <LanguageIcon />, path: "/client/settings/language" },
    { id: "accessibility", label: "Accessibility", icon: <AccessibilityIcon />, path: "/client/settings/accessibility" },
    { id: "security", label: "Security", icon: <SecurityIcon />, path: "/client/settings/security" },
  ];

  // Determine active section based on URL
  const currentPath = location.pathname;

  // Redirect to account settings if at the base settings URL
  useEffect(() => {
    if (currentPath === "/client/settings") {
      navigate("/client/settings/account");
    }
  }, [currentPath, navigate]);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("Settings")}</h1>
          <p className="text-muted-foreground">{t("Manage your preferences and account settings")}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                        currentPath.includes(item.id)
                          ? "bg-green-600 text-white"
                          : "hover:bg-green-500/10"
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{t(item.label)}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientSettings; 