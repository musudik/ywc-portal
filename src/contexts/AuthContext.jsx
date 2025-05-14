import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api";
import { getUser, isAuthenticated } from "../utils/tokenUtils";

// Create the auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from local storage on initial render
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Try to get current user from API
          const userData = await authApi.getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // If API call fails, try to use stored user data
          const storedUser = getUser();
          if (storedUser) {
            setUser(storedUser);
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
    setUser(response.user);
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