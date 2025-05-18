import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import DashboardLayout from "../../../components/dashboard/layout"; 

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 13v4" />
  </svg>
);

const SecuritySettings = () => {
  const { t } = useTranslation();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <DashboardLayout>
    <Card>
      <CardHeader>
        <CardTitle>{t("Security")}</CardTitle>
        <CardDescription>{t("Configure security settings")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
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
      </CardContent>
    </Card>
    </DashboardLayout>
  );
};

export default SecuritySettings; 