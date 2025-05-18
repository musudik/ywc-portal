import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api";
import { profileApi } from "../api";
import { getUser, isAuthenticated } from "../utils/tokenUtils";

// Create the auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Helper function to enhance user data with profile information
  const enhanceUserWithProfile = async (userData) => {
    if (!userData) return null;
    
    try {
      // Try to get personal details for the user
      const personalDetails = await profileApi.getPersonalDetails();
      
      // If personal details exist, merge the relevant fields with user data
      if (personalDetails) {
        // Handle case where details is an array
        const details = Array.isArray(personalDetails) && personalDetails.length > 0 
          ? personalDetails[0] 
          : personalDetails;
        
        return {
          ...userData,
          firstName: details.firstName || '',
          lastName: details.lastName || '',
          personalId: details.id || details.personalId || null
        };
      }
      
      return userData;
    } catch (error) {
      console.error("Error fetching personal details:", error);
      return userData;
    }
  };

  // Load user from local storage on initial render
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Try to get current user from API
          const userData = await authApi.getCurrentUser();
          
          // Enhance user data with profile information
          const enhancedUserData = await enhanceUserWithProfile(userData);
          
          setUser(enhancedUserData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // If API call fails, try to use stored user data
          const storedUser = getUser();
          if (storedUser) {
            try {
              // Try to enhance stored user with profile data
              const enhancedStoredUser = await enhanceUserWithProfile(storedUser);
              setUser(enhancedStoredUser);
            } catch (profileError) {
              // If enhancing fails, use the stored user as is
              console.error("Error enhancing stored user data:", profileError);
              setUser(storedUser);
            }
            setIsLoggedIn(true);
          } else {
            // If no stored user, logout
            authApi.logout();
            setIsLoggedIn(false);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for storage events (logout from other tabs)
    const handleStorageChange = () => {
      const isUserAuthenticated = isAuthenticated();
      setIsLoggedIn(isUserAuthenticated);
      if (!isUserAuthenticated) {
        setUser(null);
      } else if (!user) {
        setUser(getUser());
      }
    };

    // Listen for auth:logout events
    const handleLogout = () => {
      setUser(null);
      setIsLoggedIn(false);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    console.log("Login successful, user data:", response.user);
    
    // Enhance user data with profile information after login
    const enhancedUserData = await enhanceUserWithProfile(response.user);
    setUser(enhancedUserData);
    setIsLoggedIn(true);
    return response;
  };

  // Register function
  const register = async (userData) => {
    const response = await authApi.register(userData);
    return response;
  };

  // Logout function
  const logout = () => {
    console.log("Logging out, clearing user data");
    authApi.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Context value
  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext; 