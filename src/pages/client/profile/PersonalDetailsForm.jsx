import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";
import { ApplicantType } from "../../../api/profile/types";
import { createSafeTranslate } from "../../../utils/translationUtils";

// Define constants for dropdown options
const MARITAL_STATUS_OPTIONS = ["single", "married", "divorced", "widowed"];
const HOUSING_OPTIONS = ["owned", "rented", "livingWithParents", "other"];
const APPLICANT_TYPE_OPTIONS = ["PrimaryApplicant", "SecondaryApplicant"];

const PersonalDetailsForm = ({ 
  onComplete, 
  initialData, 
  id, 
  showUpdateButton, 
  onUpdate, 
  profileComplete 
}) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    coachId: "",
    applicantType: "primary",
    firstName: "",
    lastName: "",
    streetAddress: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    birthDate: "",
    birthPlace: "",
    maritalStatus: "",
    nationality: "",
    housing: "",
    id: id, // Add id from props
  });
  const [initialLoading, setInitialLoading] = useState(true);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Setting personal details from initialData:", initialData);
      setFormData(prevData => {
        // Create a clean data object with all the fields we need
        const updatedData = {
          ...prevData,
          coachId: initialData.coachId || initialData.coach?.id || prevData.coachId || "",
          firstName: initialData.firstName || prevData.firstName || "",
          lastName: initialData.lastName || prevData.lastName || "",
          streetAddress: initialData.streetAddress || prevData.streetAddress || "",
          postalCode: initialData.postalCode || prevData.postalCode || "",
          city: initialData.city || prevData.city || "",
          phone: initialData.phone || prevData.phone || "",
          email: initialData.email || prevData.email || "",
          birthPlace: initialData.birthPlace || prevData.birthPlace || "",
          maritalStatus: initialData.maritalStatus || prevData.maritalStatus || "",
          nationality: initialData.nationality || prevData.nationality || "",
          housing: initialData.housing || prevData.housing || "",
          applicantType: initialData.applicantType || prevData.applicantType || "primary",
          id: initialData.id || id || prevData.id,
        };
        
        // Handle birthDate separately to ensure proper date formatting
        if (initialData.birthDate) {
          try {
            updatedData.birthDate = new Date(initialData.birthDate).toISOString().split('T')[0];
          } catch (e) {
            console.error("Error formatting birthDate:", e);
            updatedData.birthDate = prevData.birthDate || "";
          }
        }
        
        // If personalId exists, store it for updates
        if (initialData.personalId) {
          updatedData.personalId = initialData.personalId;
        }
        
        console.log("Updated form data from initialData:", updatedData);
        setInitialLoading(false);
        return updatedData;
      });
    }
  }, [initialData, id]);

  // Fetch personal details from API if initialData is not provided
  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        setLoading(true);
        const response = await profileApi.getPersonalDetails();
        
        // Debug the API response
        console.log("Personal details API response:", response);
        
        // Handle different response structures
        let personalDetails;
        if (Array.isArray(response)) {
          // If response is an array, take the first item
          personalDetails = response.length > 0 ? response[0] : null;
          console.log("Personal details from array:", personalDetails);
        } else if (response && typeof response === 'object') {
          // If response is an object
          personalDetails = response;
          console.log("Personal details from object:", personalDetails);
        }
        
        if (personalDetails) {
          setFormData(prevData => {
            // Create a clean data object with all the fields we need
            const updatedData = {
              ...prevData,
              coachId: personalDetails.coachId || personalDetails.coach || prevData.coachId || "",
              firstName: personalDetails.firstName || prevData.firstName || "",
              lastName: personalDetails.lastName || prevData.lastName || "",
              streetAddress: personalDetails.streetAddress || prevData.streetAddress || "",
              postalCode: personalDetails.postalCode || prevData.postalCode || "",
              city: personalDetails.city || prevData.city || "",
              phone: personalDetails.phone || prevData.phone || "",
              email: personalDetails.email || prevData.email || "",
              birthPlace: personalDetails.birthPlace || prevData.birthPlace || "",
              maritalStatus: personalDetails.maritalStatus || prevData.maritalStatus || "",
              nationality: personalDetails.nationality || prevData.nationality || "",
              housing: personalDetails.housing || prevData.housing || "",
              applicantType: personalDetails.applicantType || prevData.applicantType || "primary",
              id: personalDetails.id || id || prevData.id,
            };
            
            // Handle birthDate separately to ensure proper date formatting
            if (personalDetails.birthDate) {
              try {
                updatedData.birthDate = new Date(personalDetails.birthDate).toISOString().split('T')[0];
              } catch (e) {
                console.error("Error formatting birthDate:", e);
                updatedData.birthDate = prevData.birthDate || "";
              }
            }
            
            // If personalId exists, store it for updates
            if (personalDetails.personalId) {
              updatedData.personalId = personalDetails.personalId;
            }
            
            console.log("Updated form data from API:", updatedData);
            return updatedData;
          });
        }
      } catch (err) {
        console.error("Failed to fetch personal details:", err);
        // Only show error if it's not a 404 (which means no data exists yet)
        if (err.response?.status !== 404) {
          setError("Failed to load personal details. Please try again.");
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };
    
    // Only fetch if no initialData is provided
    if (!initialData) {
      fetchPersonalDetails();
    }
  }, [id, initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for coach field
    if (name === 'coach') {
      setFormData(prevData => ({
        ...prevData,
        coachId: value // Update the coachId field when coach field changes
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        // If no coachId is provided, use a default or empty value
        coach: formData.coachId || "unassigned",
        // Ensure userId is included
        userId: formData.id || id
      };

      console.log("Submitting personal details:", dataToSubmit);

      let response;
      
      // First, check if we have a personalId from either formData or initialData
      const personalId = dataToSubmit.user?.id;
      
      console.log("User ID:", personalId);
      if (personalId) {
        console.log(`Updating existing personal details with personalId: ${personalId}`);
        // Update existing personal details
        response = await profileApi.updatePersonalDetails({
          ...dataToSubmit,
          personalId: personalId
        });
      } else {
        // Check if user exists by userId (which should be available from props)
        try {
          console.log("Checking if user exists with userId:", dataToSubmit.userId);
          const existingUsers = await profileApi.getPersonalDetails();
          
          let existingUser = null;
          if (Array.isArray(existingUsers)) {
            existingUser = existingUsers.find(user => 
              user.userId === dataToSubmit.userId || user.email === dataToSubmit.email
            );
          } else if (existingUsers && 
                    (existingUsers.userId === dataToSubmit.userId || 
                     existingUsers.email === dataToSubmit.email)) {
            existingUser = existingUsers;
          }
          
          if (existingUser && existingUser.personalId) {
            console.log(`User already exists with personalId: ${existingUser.personalId}`);
            // Update existing user
            response = await profileApi.updatePersonalDetails({
              ...dataToSubmit,
              personalId: existingUser.personalId
            });
          } else {
            console.log("Creating new personal details - no existing user found");
            // Create new personal details
            response = await profileApi.savePersonalDetails(dataToSubmit);
          }
        } catch (checkErr) {
          console.error("Error checking for existing user:", checkErr);
          // If check fails, proceed with create
          console.log("Creating new personal details after failed check");
          response = await profileApi.savePersonalDetails(dataToSubmit);
        }
      }

      console.log("Personal details saved successfully:", response);
      // Call the onComplete callback with the response
      onComplete(response);
    } catch (err) {
      console.error("Failed to save personal details:", err);
      setError(err.response?.data?.message || safeTranslate('profile.personalDetails.saveFailed', "Failed to save personal details. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{safeTranslate('profile.personalDetails.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {safeTranslate('profile.personalDetails.description')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          

          <div className="space-y-2">
            <label htmlFor="applicantType" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.applicantTypeLabel')} *
            </label>
            <select
              id="applicantType"
              name="applicantType"
              value={formData.applicantType}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              {APPLICANT_TYPE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {safeTranslate(`profile.personalDetails.applicantTypeOptions.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1').trim())}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="coach" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.coachId')} *
            </label>
            <Input
              id="coach"
              name="coach"
              value={formData.coachId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.firstName')} *
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.lastName')} *
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.email')} *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.phone')} *
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="birthDate" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.birthDate')} *
            </label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="birthPlace" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.birthPlace')} *
            </label>
            <Input
              id="birthPlace"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nationality" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.nationality')} *
            </label>
            <Input
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="maritalStatus" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.maritalStatusLabel')} *
            </label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">{safeTranslate('common.select', 'Select...')}</option>
              {MARITAL_STATUS_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {safeTranslate(`profile.personalDetails.maritalStatus.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1').trim())}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="streetAddress" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.streetAddress')} *
            </label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="postalCode" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.postalCode')} *
            </label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.city')} *
            </label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="housing" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.housingLabel')} *
            </label>
            <select
              id="housing"
              name="housing"
              value={formData.housing}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">{safeTranslate('common.select', 'Select...')}</option>
              {HOUSING_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {safeTranslate(`profile.personalDetails.housing.${option}`, option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1').trim())}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        {profileComplete ? (
          <Button 
            type="button"
            onClick={onUpdate}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('common.updating', 'Updating...')}
              </span>
            ) : t('common.update', 'Update')}
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('common.saving', 'Saving...')}
              </span>
            ) : t('common.next', 'Next')}
          </Button>
        )}
      </div>
    </form>
  );
};

export default PersonalDetailsForm; 