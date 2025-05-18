import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import DashboardLayout from "../../../components/dashboard/layout";

const PrivacyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <path d="M12 15a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1v0a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1v0Z"/>
  </svg>
);

const PrivacySettings = () => {
  const { t } = useTranslation();
  const [privacy, setPrivacy] = useState({
    profileVisibility: "everyone",
    dataSharing: false,
    activityTracking: true,
  });

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("Privacy Settings")}</h1>
          <p className="text-muted-foreground">{t("Manage your privacy preferences")}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("Privacy")}</CardTitle>
            <CardDescription>{t("Manage your privacy preferences")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PrivacySettings; 