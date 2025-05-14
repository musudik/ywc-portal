import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { profileApi } from "../../../api";
import { ApplicantType } from "../../../api/profile/types";
import { createSafeTranslate } from "../../../utils/translationUtils";

const PersonalDetailsForm = ({ onComplete, initialData, id }) => {
  const { t } = useTranslation();
  const safeTranslate = createSafeTranslate(t);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    coachId: "",
    applicantType: ApplicantType.PRIMARY_APPLICANT,
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

  // Fetch personal details from API
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
              coachId: personalDetails.coachId || prevData.coachId || "",
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
              applicantType: personalDetails.applicantType || prevData.applicantType || ApplicantType.PRIMARY_APPLICANT,
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
            
            console.log("Updated form data:", updatedData);
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
      }
    };
    
    // Only fetch if no initialData is provided
    if (!initialData) {
      fetchPersonalDetails();
    }
  }, [id]);

  // Load initial data if available
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData,
        // Convert dates to proper format if they exist
        birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
      }));
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
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
        coachId: formData.coachId || "unassigned",
        // Ensure id is included
        id: formData.id || id
      };

      console.log("Submitting personal details:", dataToSubmit);

      let response;
      // Check if we have a personalId from either formData or initialData
      const personalId = formData.personalId || (initialData?.personalId);
      
      if (personalId) {
        console.log(`Updating existing personal details with personalId: ${personalId}`);
        // Update existing personal details
        response = await profileApi.updatePersonalDetails({
          ...dataToSubmit,
          personalId: personalId
        });
      } else {
        console.log("Creating new personal details");
        // Create new personal details
        response = await profileApi.savePersonalDetails(dataToSubmit);
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
            <label htmlFor="coachId" className="block text-sm font-medium">
              {safeTranslate('profile.personalDetails.coachId')} *
            </label>
            <Input
              id="coachId"
              name="coachId"
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
              value={formData.birthDate || ''}
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
              <option value="">{safeTranslate('common.select')}</option>
              <option value="Single">{safeTranslate('profile.personalDetails.maritalStatus.single')}</option>
              <option value="Married">{safeTranslate('profile.personalDetails.maritalStatus.married')}</option>
              <option value="Divorced">{safeTranslate('profile.personalDetails.maritalStatus.divorced')}</option>
              <option value="Widowed">{safeTranslate('profile.personalDetails.maritalStatus.widowed')}</option>
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
              <option value="">{safeTranslate('common.select')}</option>
              <option value="Owned">{safeTranslate('profile.personalDetails.housing.owned')}</option>
              <option value="Rented">{safeTranslate('profile.personalDetails.housing.rented')}</option>
              <option value="LivingWithParents">{safeTranslate('profile.personalDetails.housing.livingWithParents')}</option>
              <option value="Other">{safeTranslate('profile.personalDetails.housing.other')}</option>
            </select>
          </div>

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
              <option value={ApplicantType.PRIMARY_APPLICANT}>{safeTranslate('profile.personalDetails.applicantType.primary')}</option>
              <option value={ApplicantType.CO_APPLICANT}>{safeTranslate('profile.personalDetails.applicantType.coApplicant')}</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={loading}
        >
          {loading ? safeTranslate('common.saving') : safeTranslate('common.continue')}
        </Button>
      </div>
    </form>
  );
};

export default PersonalDetailsForm; 