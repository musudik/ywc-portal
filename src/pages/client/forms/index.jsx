import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import DashboardLayout from "../../../components/dashboard/layout";
import { useAuth } from "../../../contexts/AuthContext";
import { profileApi } from "../../../api";

// Icons
const QRCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </svg>
);

const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CreateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" x2="12" y1="18" y2="12" />
    <line x1="9" x2="15" y1="15" y2="15" />
  </svg>
);

const ClientForms = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the possible form types
  const formTypes = [
    { id: "immobilien", name: "Immobilien" },
    { id: "privateHealthInsurance", name: "Private Health Insurance" },
    { id: "stateHealthInsurance", name: "State Health Insurance" },
    { id: "kfz", name: "KFZ" },
    { id: "electricity", name: "Electricity" },
    { id: "loans", name: "Loans" },
    { id: "sanuspay", name: "Sanuspay" },
    { id: "gems", name: "Gems" }
  ];

  // Fetch forms data when component mounts
  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, this would be a call to your API
        // const response = await profileApi.getForms();
        // setForms(response);
        
        // For demonstration, we'll create mock data
        // In a real implementation, this would be replaced with actual API data
        const mockForms = formTypes.map(type => ({
          id: type.id,
          name: type.name,
          status: Math.random() > 0.5 ? "filled" : "not_filled",
          link: `https://yourwealth.coach/forms/${type.id}/${user?.id || 'user123'}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        setForms(mockForms);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
        setError("Failed to load forms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [user?.id]);

  const copyLink = (link) => {
    navigator.clipboard.writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };

  const handleCreateForm = (formType) => {
    // In a real app, this would create a new form
    alert(`Creating a new ${formType.name} form...`);
  };

  const handleViewForm = (form) => {
    // In a real app, this would navigate to the form view
    window.open(form.link, '_blank');
  };

  const handleDeleteForm = (form) => {
    // In a real app, this would delete the form after confirmation
    if (window.confirm(`Are you sure you want to delete this ${form.name} form?`)) {
      alert(`Deleting ${form.name} form...`);
      // const updatedForms = forms.filter(f => f.id !== form.id);
      // setForms(updatedForms);
    }
  };

  const handleShowQR = (form) => {
    // In a real app, this would show a QR code modal
    alert(`QR Code for ${form.name} form:\n${form.link}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("Forms")}</h1>
          <p className="text-muted-foreground">{t("Manage your application forms")}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
              </div>
              <p className="text-center">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                {t("Try Again")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("Your Forms")}</CardTitle>
              <CardDescription>
                {t("Manage your application forms, view their status, and get unique links")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="py-3 px-4 font-medium text-sm">{t("Form Type")}</th>
                      <th className="py-3 px-4 font-medium text-sm">{t("Status")}</th>
                      <th className="py-3 px-4 font-medium text-sm">{t("Form Link")}</th>
                      <th className="py-3 px-4 font-medium text-sm text-center">{t("QR Code")}</th>
                      <th className="py-3 px-4 font-medium text-sm text-center">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {forms.map((form) => (
                      <tr key={form.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{form.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          {form.status === "filled" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              {t("Filled")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                              {t("Not Filled")}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-sm truncate max-w-[12rem]">{form.link}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2" 
                              onClick={() => copyLink(form.link)}
                              title={t("Copy Link")}
                            >
                              <CopyIcon />
                            </Button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleShowQR(form)}
                            title={t("Show QR Code")}
                            className="text-primary"
                          >
                            <QRCodeIcon />
                          </Button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            {form.status === "filled" ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewForm(form)}
                                title={t("View Form")}
                                className="text-blue-600"
                              >
                                <ViewIcon />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCreateForm(form)}
                                title={t("Create Form")}
                                className="text-green-600"
                              >
                                <CreateIcon />
                              </Button>
                            )}
                            {form.status === "filled" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteForm(form)}
                                title={t("Delete Form")}
                                className="text-red-600"
                              >
                                <DeleteIcon />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientForms; 