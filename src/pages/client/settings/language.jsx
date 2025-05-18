import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import DashboardLayout from "../../../components/dashboard/layout";

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

const LanguageSettings = () => {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("Language Settings")}</h1>
          <p className="text-muted-foreground">{t("Change your language preferences")}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("Language")}</CardTitle>
            <CardDescription>{t("Change your language preferences")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LanguageSettings; 