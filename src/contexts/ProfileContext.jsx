import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../api";
import { useAuth } from "./AuthContext";

// Create the profile context
const ProfileContext = createContext(null);

// Profile provider component
export const ProfileProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [profileCompletion, setProfileCompletion] = useState(null);
  const [personalId, setPersonalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch personal details and extract personalId
  const fetchPersonalDetails = async () => {
    try {
      const details = await profileApi.getPersonalDetails();
      if (details) {
        // Handle case where details is an array
        const personalDetails = Array.isArray(details) && details.length > 0 ? details[0] : details;
        
        // Try to extract ID from different possible properties
        let extractedId = null;
        
        if (personalDetails.userId) {
          extractedId = personalDetails.userId;
          console.log("Found userId in personal details:", extractedId);
        }
        
        if (extractedId) {
          console.log("Setting personalId from fetched personal details:", extractedId);
          setPersonalId(extractedId);
          return extractedId;
        } else {
          console.warn("No id found in personal details:", personalDetails);
        }
      }
    } catch (err) {
      console.error("Failed to fetch personal details:", err);
    }
    return null;
  };

  // Check profile completion status when user logs in
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!isLoggedIn || user?.role?.name !== "CLIENT") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // First try to get the profile completion status
        const completionStatus = await profileApi.getProfileCompletionStatus();
        setProfileCompletion(completionStatus);
        
        // Set personalId from completion status
        if (completionStatus.personalId) {
          console.log("Setting personalId from completion status:", completionStatus.personalId);
          setPersonalId(completionStatus.personalId);
        } 
        // If personal details are complete but personalId is missing, try to fetch it
        else if (completionStatus.sections?.personalDetails) {
          await fetchPersonalDetails();
        }

        // If profile is not complete, redirect to profile setup
        if (!completionStatus.isComplete && window.location.pathname !== '/client/profile') {
          navigate("/client/profile");
        }
      } catch (err) {
        console.error("Failed to check profile completion:", err);
        setError("Failed to check profile completion status");
        
        // Even if profile completion check fails, try to get personalId
        await fetchPersonalDetails();
      } finally {
        setLoading(false);
      }
    };

    checkProfileCompletion();
  }, [isLoggedIn, user, navigate]);

  // Update profile completion status
  const updateProfileCompletion = async () => {
    try {
      const completionStatus = await profileApi.getProfileCompletionStatus();
      console.log("Got profile completion status:", completionStatus);
      setProfileCompletion(completionStatus);
      
      // Update personalId if available
      if (completionStatus.personalId) {
        console.log("Setting personalId from completion status:", completionStatus.personalId);
        setPersonalId(completionStatus.personalId);
      } else if (completionStatus.sections?.personalDetails) {
        // If personal details are complete but personalId is missing, try to fetch it
        console.log("Personal details section is complete, fetching personalId");
        await fetchPersonalDetails();
      }
      
      return completionStatus;
    } catch (err) {
      console.error("Failed to update profile completion:", err);
      
      // Even if profile completion check fails, try to get personalId
      await fetchPersonalDetails();
      
      throw err;
    }
  };

  // Force refresh of personal ID
  const refreshPersonalId = async () => {
    return await fetchPersonalDetails();
  };

  // Get the current step based on profile completion
  const getCurrentStep = () => {
    if (!profileCompletion || !profileCompletion.sections) {
      return 0;
    }

    const { sections } = profileCompletion;
    
    if (!sections.personalDetails) return 0;
    if (!sections.employment) return 1;
    if (!sections.income) return 2;
    if (!sections.expenses) return 3;
    if (!sections.assets) return 4;
    if (!sections.liabilities) return 5;
    if (!sections.goalsAndWishes) return 6;
    if (!sections.riskAppetite) return 7;
    
    // If all steps are complete, return 7 (last step) instead of 8
    // This ensures we show a valid step even when all sections are completed
    return 7;
  };

  // Context value
  const value = {
    profileCompletion,
    personalId,
    loading,
    error,
    updateProfileCompletion,
    getCurrentStep,
    refreshPersonalId,
    getPersonalDetails: fetchPersonalDetails
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

// Custom hook to use profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export default ProfileContext; 