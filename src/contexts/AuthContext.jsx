import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api";
import { profileApi } from "../api";
import { getUser, isAuthenticated, saveAuthData, clearAuthData } from "../utils/tokenUtils";

// Create the auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenRefreshing, setTokenRefreshing] = useState(false);

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

  // Function to refresh token
  const refreshToken = async () => {
    if (tokenRefreshing) return;
    
    try {
      setTokenRefreshing(true);
      console.log("Attempting to refresh authentication token...");
      
      const response = await authApi.refreshToken();
      
      if (response && response.token) {
        console.log("Token refreshed successfully");
        saveAuthData(response.token, response.user || user, response.expiresIn || '24h');
        setUser(response.user || user);
        setIsLoggedIn(true);
      } else {
        throw new Error("Invalid response from refresh token endpoint");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      // If refresh fails, logout
      logout();
    } finally {
      setTokenRefreshing(false);
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
          
          // If error is unauthorized (401), try to refresh token
          if (error.response && error.response.status === 401) {
            try {
              await refreshToken();
              // If refresh successful, we should be logged in now
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              // If refresh fails, try to use stored user as fallback
              const storedUser = getUser();
              if (storedUser) {
                try {
                  const enhancedStoredUser = await enhanceUserWithProfile(storedUser);
                  setUser(enhancedStoredUser);
                  setIsLoggedIn(true);
                } catch (profileError) {
                  console.error("Error enhancing stored user data:", profileError);
                  setUser(storedUser);
                  setIsLoggedIn(true);
                }
              } else {
                // If no stored user, logout
                logout();
              }
            }
          } else {
            // For other errors, try to use stored user data
            const storedUser = getUser();
            if (storedUser) {
              try {
                const enhancedStoredUser = await enhanceUserWithProfile(storedUser);
                setUser(enhancedStoredUser);
              } catch (profileError) {
                console.error("Error enhancing stored user data:", profileError);
                setUser(storedUser);
              }
              setIsLoggedIn(true);
            } else {
              // If no stored user, logout
              logout();
            }
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

    // Listen for auth:unauthorized events to trigger token refresh
    const handleUnauthorized = () => {
      refreshToken();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth:logout", handleLogout);
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:logout", handleLogout);
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
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
    refreshToken,
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