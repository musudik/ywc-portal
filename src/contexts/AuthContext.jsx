import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api";
import { profileApi } from "../api";
import { getUser, isAuthenticated, saveAuthData, clearAuthData, getToken } from "../utils/tokenUtils";

// Create the auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenRefreshing, setTokenRefreshing] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);

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
      // For new users without personal details, this is normal - don't fail the login
      // Just return the user data without the personal details enhancement
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
    // Prevent multiple simultaneous login attempts
    if (loginInProgress) {
      console.warn('Login already in progress, ignoring new attempt');
      throw new Error('Login already in progress');
    }
    
    setLoginInProgress(true);
    
    try {
      console.log('Starting login process...');
      const response = await authApi.login(credentials);
      console.log("Login successful, user data:", response.user);
      
      // Enhance user data with profile information after login
      const enhancedUserData = await enhanceUserWithProfile(response.user);
      setUser(enhancedUserData);
      setIsLoggedIn(true);
      
      console.log('Login process completed successfully');
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      // Ensure we're logged out on login failure
      setUser(null);
      setIsLoggedIn(false);
      throw error;
    } finally {
      setLoginInProgress(false);
    }
  };

  // Register function
  const register = async (userData) => {
    const response = await authApi.register(userData);
    return response;
  };

  // Logout function
  const logout = () => {
    console.log("Logging out, clearing user data");
    
    // Clear user state immediately to prevent UI issues
    setUser(null);
    setIsLoggedIn(false);
    setLoading(false);
    
    // Clear authentication data from storage
    authApi.logout();
    
    console.log("Logout completed successfully");
  };

  // Update user function
  const updateUser = async (userData) => {
    try {
      // Enhance the updated user data with profile information
      const enhancedUserData = await enhanceUserWithProfile(userData);
      setUser(enhancedUserData);
      
      // Update the stored user data as well
      const token = getToken();
      if (token) {
        saveAuthData(token, enhancedUserData, '24h'); // Use default expiry
      }
      
      console.log("User data updated successfully:", enhancedUserData);
      return enhancedUserData;
    } catch (error) {
      console.error("Error updating user data:", error);
      // Even if enhancement fails, still update the core user data
      setUser(userData);
      
      const token = getToken();
      if (token) {
        saveAuthData(token, userData, '24h');
      }
      
      return userData;
    }
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
    updateUser,
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