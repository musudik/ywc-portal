import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import DashboardLayout from "../../../components/dashboard/layout";

const AccessibilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="4" r="1" />
    <path d="m18 19 1-7-6 1" />
    <path d="m5 8 3-3 5 1-5 3z" />
    <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
    <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
  </svg>
);

const AccessibilitySettings = () => {
  const { t } = useTranslation();
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    reducedMotion: false,
    fontSize: "medium",
  });

  const handleAccessibilityChange = (key, value) => {
    setAccessibility((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("Accessibility Settings")}</h1>
          <p className="text-muted-foreground">{t("Adjust settings for better accessibility")}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("Accessibility")}</CardTitle>
            <CardDescription>{t("Adjust settings for better accessibility")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AccessibilitySettings; 