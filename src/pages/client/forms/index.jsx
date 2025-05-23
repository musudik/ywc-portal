import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/layout";
import { useAuth } from "../../../contexts/AuthContext";
import { profileApi, formsApi } from "../../../api";

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

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ClientForms = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
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
        // Call the actual API to get all client forms
        const response = await formsApi.getAllClientForms();
        
        if (response.success) {
          console.log('Raw API response:', response);
          console.log('Fetched forms data:', response.data);
          
          // Create a map of form types to their corresponding form data
          const formsMap = {};
          if (response.data && Array.isArray(response.data)) {
            response.data.forEach(form => {
              // Handle different API response structures
              // Some APIs return formType, some might return type or form_type
              const formType = form.formType || form.type || form.form_type;
              console.log(`Processing form: ${formType}, ID: ${form.formId || form.id}`);
              
              if (formType) {
                // First try direct match
                const matchingType = formTypes.find(
                  type => type.id.toLowerCase() === formType.toLowerCase()
                );
                
                if (matchingType) {
                  // We found a matching form type in our formTypes array
                  formsMap[matchingType.id.toLowerCase()] = {
                    ...form,
                    formId: form.formId || form.id,
                  };
                  console.log(`Matched ${formType} to form type ${matchingType.id}`);
                } else {
                  // Fallback to using the formType as is
                  const formTypeKey = formType.toLowerCase();
                  formsMap[formTypeKey] = {
                    ...form,
                    formId: form.formId || form.id,
                  };
                }
              }
            });
          }
          
          console.log('Forms map created:', formsMap);
          
          // Create the final forms array with all form types
          const formsList = formTypes.map(type => {
            // Look for existing form using standardized type ID
            const typeKey = type.id.toLowerCase();
            const existingForm = formsMap[typeKey];
            
            console.log(`Checking form type: ${type.id}, exists: ${!!existingForm}`);
            
            if (existingForm) {
              // Form exists, return it with existing data and correct path format
              const formEntry = {
                ...existingForm,
                id: type.id,
                name: type.name,
                status: "filled",
                formId: existingForm.formId,
                link: `${window.location.origin}/client/forms/${type.id}/${existingForm.formId}`
              };
              console.log(`Found existing form for ${type.id}:`, formEntry);
              return formEntry;
            } else {
              // Form doesn't exist, return a template with correct path format
              return {
                id: type.id,
                name: type.name,
                status: "not_filled",
                link: `${window.location.origin}/client/forms/${type.id}`,
                formId: null
              };
            }
          });
          
          console.log('Final forms list:', formsList);
          setForms(formsList);
        } else {
          // Handle API error
          console.error("Failed to fetch forms:", response.message);
          setError(response.message || "Failed to load forms. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching forms:", err);
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

  const handleCreateForm = (form) => {
    // Navigate to the appropriate form page based on form type
    switch(form.id) {
      case "immobilien":
        navigate("/client/forms/immobilien");
        break;
      case "privateHealthInsurance":
      case "stateHealthInsurance":
      case "kfz":
      case "electricity":
      case "loans":
      case "sanuspay":
      case "gems":
        navigate(`/client/forms/${form.id}`);
        break;
      default:
        alert(`Creating a new ${form.name} form... (Not yet implemented)`);
        break;
    }
  };

  const handleViewForm = (form) => {
    if (!form.formId) return;
    
    // Navigate to view the form based on form type
    switch(form.id) {
      case "immobilien":
        navigate(`/client/forms/immobilien/${form.formId}`);
        break;
      case "privateHealthInsurance":
      case "stateHealthInsurance":
      case "kfz":
      case "electricity":
      case "loans":
      case "sanuspay":
      case "gems":
        navigate(`/client/forms/${form.id}/${form.formId}`);
        break;
      default:
        alert(`Viewing ${form.name} form... (Not yet implemented)`);
        break;
    }
  };

  const handleUpdateForm = (form) => {
    if (!form.formId) return;
    
    // Navigate to edit the form based on form type
    switch(form.id) {
      case "immobilien":
        navigate(`/client/forms/immobilien/${form.formId}`);
        break;
      case "privateHealthInsurance":
      case "stateHealthInsurance":
      case "kfz":
      case "electricity":
      case "loans":
      case "sanuspay":
      case "gems":
        navigate(`/client/forms/${form.id}/${form.formId}`);
        break;
      default:
        alert(`Updating ${form.name} form... (Not yet implemented)`);
        break;
    }
  };

  const handleDeleteForm = async (form) => {
    if (!form.formId) return;
    
    // Confirm deletion with the user
    if (window.confirm(`Are you sure you want to delete this ${form.name} form?`)) {
      setLoading(true);
      try {
        const response = await formsApi.deleteClientForm(form.formId);
        
        if (response.success) {
          // Update local state to reflect deletion
          const updatedForms = forms.map(f => {
            if (f.id === form.id) {
              return {
                ...f,
                status: "not_filled",
                formId: null
              };
            }
            return f;
          });
          
          setForms(updatedForms);
          alert(`${form.name} form deleted successfully.`);
        } else {
          alert(`Error: ${response.message || "Failed to delete form"}`);
        }
      } catch (err) {
        console.error("Error deleting form:", err);
        alert("Failed to delete form. Please try again later.");
      } finally {
        setLoading(false);
      }
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
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleViewForm(form)}
                                  title={t("View Form")}
                                  className="text-blue-600"
                                >
                                  <ViewIcon />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleUpdateForm(form)}
                                  title={t("Edit Form")}
                                  className="text-amber-600"
                                >
                                  <EditIcon />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteForm(form)}
                                  title={t("Delete Form")}
                                  className="text-red-600"
                                >
                                  <DeleteIcon />
                                </Button>
                              </>
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