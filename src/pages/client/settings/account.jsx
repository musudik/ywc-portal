import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import DashboardLayout from "../../../components/dashboard/layout";
import { useAuth } from "../../../contexts/AuthContext";

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const AccountSettings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [accountInfo, setAccountInfo] = useState({
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const handleSaveAccountInfo = () => {
    // Save account info logic would go here
    alert("Account information updated!");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("Account Settings")}</h1>
          <p className="text-muted-foreground">{t("Manage your account details")}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("Account")}</CardTitle>
            <CardDescription>{t("Manage your account details")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings; 