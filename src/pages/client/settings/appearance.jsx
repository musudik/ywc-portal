import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { useTheme } from "../../../components/ui/ThemeProvider";
import DashboardLayout from "../../../components/dashboard/layout";

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

const AppearanceSettings = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("Appearance Settings")}</h1>
          <p className="text-muted-foreground">{t("Customize the look and feel of the application")}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("Appearance")}</CardTitle>
            <CardDescription>{t("Customize the look and feel of the application")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppearanceSettings; 