import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import DashboardLayout from "../../../components/dashboard/layout";
import { useTheme } from "../../../components/ui/ThemeProvider";
import { useAuth } from "../../../contexts/AuthContext";

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

const ClientSettings = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("appearance");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    updates: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "everyone",
    dataSharing: false,
    activityTracking: true,
  });
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    reducedMotion: false,
    fontSize: "medium",
  });
  const [accountInfo, setAccountInfo] = useState({
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    twoFactorEnabled: false,
  });

  // Navigation tabs
  const navigationItems = [
    { id: "appearance", label: "Appearance", icon: <ThemeIcon /> },
    { id: "notifications", label: "Notifications", icon: <NotificationIcon /> },
    { id: "privacy", label: "Privacy", icon: <PrivacyIcon /> },
    { id: "language", label: "Language", icon: <LanguageIcon /> },
    { id: "accessibility", label: "Accessibility", icon: <AccessibilityIcon /> },
    { id: "account", label: "Account", icon: <AccountIcon /> },
    { id: "security", label: "Security", icon: <SecurityIcon /> },
  ];

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAccessibilityChange = (key, value) => {
    setAccessibility((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveAccountInfo = () => {
    // Save account info logic would go here
    alert("Account information updated!");
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
                        activeSection === item.id
                          ? "bg-green-600 text-white"
                          : "hover:bg-green-500/10"
                      }`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{t(item.label)}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t(navigationItems.find((item) => item.id === activeSection)?.label || "Settings")}
                </CardTitle>
                <CardDescription>
                  {activeSection === "appearance" && t("Customize the look and feel of the application")}
                  {activeSection === "notifications" && t("Control how you receive notifications")}
                  {activeSection === "privacy" && t("Manage your privacy preferences")}
                  {activeSection === "language" && t("Change your language preferences")}
                  {activeSection === "accessibility" && t("Adjust settings for better accessibility")}
                  {activeSection === "account" && t("Manage your account details")}
                  {activeSection === "security" && t("Configure security settings")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appearance Settings */}
                {activeSection === "appearance" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{t("Theme")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Choose between light and dark modes")}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="flex items-center gap-2"
                      >
                        <ThemeIcon />
                        <span>{theme === "dark" ? t("Light Mode") : t("Dark Mode")}</span>
                      </Button>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">{t("Color Scheme")}</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          className="p-4 bg-green-600 text-white rounded-md flex items-center justify-center"
                          title="Green (Default)"
                        >
                          <span className="sr-only">Green</span>
                          ✓
                        </button>
                        <button
                          className="p-4 bg-blue-600 text-white rounded-md flex items-center justify-center opacity-60 hover:opacity-100"
                          title="Blue"
                        >
                          <span className="sr-only">Blue</span>
                        </button>
                        <button
                          className="p-4 bg-purple-600 text-white rounded-md flex items-center justify-center opacity-60 hover:opacity-100"
                          title="Purple"
                        >
                          <span className="sr-only">Purple</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeSection === "notifications" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{t("Email Notifications")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Receive notifications via email")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={() => handleToggleNotification("email")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h3 className="font-medium">{t("Push Notifications")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Receive notifications in browser")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={() => handleToggleNotification("push")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h3 className="font-medium">{t("Marketing Emails")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Receive marketing and promotional emails")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.marketing}
                          onChange={() => handleToggleNotification("marketing")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h3 className="font-medium">{t("System Updates")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Receive notifications about system updates")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.updates}
                          onChange={() => handleToggleNotification("updates")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeSection === "privacy" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{t("Profile Visibility")}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("Control who can see your profile information")}
                      </p>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={privacy.profileVisibility}
                        onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                      >
                        <option value="everyone">{t("Everyone")}</option>
                        <option value="coaches">{t("Only My Coaches")}</option>
                        <option value="none">{t("Private")}</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h3 className="font-medium">{t("Data Sharing")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Allow sharing anonymized data for service improvement")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.dataSharing}
                          onChange={() => handlePrivacyChange("dataSharing", !privacy.dataSharing)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h3 className="font-medium">{t("Activity Tracking")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Track your activity for personalized recommendations")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.activityTracking}
                          onChange={() => handlePrivacyChange("activityTracking", !privacy.activityTracking)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="border-t pt-4">
                      <Button variant="destructive" size="sm">
                        {t("Request Data Export")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Language Settings */}
                {activeSection === "language" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{t("Interface Language")}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("Change the language of the user interface")}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center">
                          <span>English</span>
                        </button>
                        <button className="px-4 py-2 border border-input bg-background rounded-md flex items-center justify-center hover:bg-green-500/10">
                          <span>Deutsch</span>
                        </button>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">{t("Date Format")}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("Choose your preferred date format")}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="dateFormat" defaultChecked />
                          <span>DD/MM/YYYY (30/01/2024)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="dateFormat" />
                          <span>MM/DD/YYYY (01/30/2024)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="dateFormat" />
                          <span>YYYY-MM-DD (2024-01-30)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Accessibility Settings */}
                {activeSection === "accessibility" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{t("High Contrast")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Increase contrast for better visibility")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessibility.highContrast}
                          onChange={() => handleAccessibilityChange("highContrast", !accessibility.highContrast)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div>
                        <h3 className="font-medium">{t("Reduced Motion")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Minimize animations throughout the interface")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessibility.reducedMotion}
                          onChange={() => handleAccessibilityChange("reducedMotion", !accessibility.reducedMotion)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">{t("Font Size")}</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className={`px-4 py-2 rounded-md ${
                            accessibility.fontSize === "small"
                              ? "bg-green-600 text-white"
                              : "border border-input bg-background hover:bg-green-500/10"
                          }`}
                          onClick={() => handleAccessibilityChange("fontSize", "small")}
                        >
                          <span className="text-sm">{t("Small")}</span>
                        </button>
                        <button
                          className={`px-4 py-2 rounded-md ${
                            accessibility.fontSize === "medium"
                              ? "bg-green-600 text-white"
                              : "border border-input bg-background hover:bg-green-500/10"
                          }`}
                          onClick={() => handleAccessibilityChange("fontSize", "medium")}
                        >
                          <span>{t("Medium")}</span>
                        </button>
                        <button
                          className={`px-4 py-2 rounded-md ${
                            accessibility.fontSize === "large"
                              ? "bg-green-600 text-white"
                              : "border border-input bg-background hover:bg-green-500/10"
                          }`}
                          onClick={() => handleAccessibilityChange("fontSize", "large")}
                        >
                          <span className="text-lg">{t("Large")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Settings */}
                {activeSection === "account" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{t("Personal Information")}</h3>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">{t("Email")}</label>
                          <input
                            type="email"
                            value={accountInfo.email}
                            onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">{t("Phone Number")}</label>
                          <input
                            type="tel"
                            value={accountInfo.phoneNumber}
                            onChange={(e) => setAccountInfo({ ...accountInfo, phoneNumber: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        <Button onClick={handleSaveAccountInfo} className="bg-green-600 hover:bg-green-700">
                          {t("Save Changes")}
                        </Button>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">{t("Account Management")}</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <span>{t("Change Password")}</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-yellow-600">
                          <span>{t("Deactivate Account")}</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-600">
                          <span>{t("Delete Account")}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeSection === "security" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{t("Two-Factor Authentication")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Add an extra layer of security to your account")}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accountInfo.twoFactorEnabled}
                          onChange={() => setAccountInfo({ ...accountInfo, twoFactorEnabled: !accountInfo.twoFactorEnabled })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">{t("Login Sessions")}</h3>
                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">{t("Current Session")}</p>
                            <p className="text-sm text-muted-foreground">Windows • Chrome • May 25, 2023</p>
                          </div>
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full">
                            {t("Active")}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-600">
                          {t("Log Out All Other Devices")}
                        </Button>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">{t("Activity Log")}</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <p>{t("Password changed")}</p>
                          <p className="text-muted-foreground">May 20, 2023</p>
                        </div>
                        <div className="flex justify-between">
                          <p>{t("Login from new device")}</p>
                          <p className="text-muted-foreground">May 18, 2023</p>
                        </div>
                        <div className="flex justify-between">
                          <p>{t("Profile updated")}</p>
                          <p className="text-muted-foreground">May 15, 2023</p>
                        </div>
                      </div>
                      <Button variant="link" size="sm" className="mt-2 px-0">
                        {t("View Full Activity Log")}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientSettings; 