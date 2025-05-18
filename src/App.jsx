import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ClientDashboard from "./pages/client/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import CoachDashboard from "./pages/coach/Dashboard";
import ProfileSetup from "./pages/client/profile";
import ClientForms from "./pages/client/forms";

// Settings pages
import ClientSettings from "./pages/client/settings";
import AppearanceSettings from "./pages/client/settings/appearance";
import NotificationSettings from "./pages/client/settings/notifications";
import PrivacySettings from "./pages/client/settings/privacy";
import LanguageSettings from "./pages/client/settings/language";
import AccessibilitySettings from "./pages/client/settings/accessibility";
import AccountSettings from "./pages/client/settings/account";
import SecuritySettings from "./pages/client/settings/security";

// Import i18n configuration
import "./i18n/i18n";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProfileProvider, useProfile } from "./contexts/ProfileContext";

// Import Immobilien form
import ImmobilienForm from "./pages/client/forms/ImmobilienForm";

// Protected route component
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You could add a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user?.role?.name)) {
    // Redirect based on user role if they don't have access
    switch (user?.role?.name) {
      case "CLIENT":
        return <Navigate to="/client/dashboard" replace />;
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;
      case "COACH":
        return <Navigate to="/coach/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

// Client route component with profile check
const ClientRoute = () => {
  const { profileCompletion, loading, getCurrentStep } = useProfile();
  const location = useLocation();

  if (loading) {
    return <div>Loading profile information...</div>;
  }

  // Check if the user is explicitly trying to edit their profile
  const isEditingProfile = location.search.includes('edit=true');

  // If profile is not complete and not already on profile setup page
  // Don't redirect if the user is explicitly trying to edit their profile
  if (profileCompletion && !profileCompletion.isComplete && 
      location.pathname !== '/client/profile' && 
      !isEditingProfile) {
    return <Navigate to="/client/profile" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ProfileProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected client routes */}
              <Route element={<ProtectedRoute allowedRoles={["CLIENT"]} />}>
                <Route element={<ClientRoute />}>
                  <Route path="/client/dashboard" element={<ClientDashboard />} />
                  {/* Settings routes */}
                  <Route path="/client/settings" element={<ClientSettings />} />
                  <Route path="/client/settings/appearance" element={<AppearanceSettings />} />
                  <Route path="/client/settings/notifications" element={<NotificationSettings />} />
                  <Route path="/client/settings/privacy" element={<PrivacySettings />} />
                  <Route path="/client/settings/language" element={<LanguageSettings />} />
                  <Route path="/client/settings/accessibility" element={<AccessibilitySettings />} />
                  <Route path="/client/settings/account" element={<AccountSettings />} />
                  <Route path="/client/settings/security" element={<SecuritySettings />} />
                  {/* Form routes */}
                  <Route path="/client/forms/immobilien" element={<ImmobilienForm />} />
                  {/* Other client routes */}
                  <Route path="/client/forms" element={<ClientForms />} />
                </Route>
                <Route path="/client/profile" element={<ProfileSetup />} />
              </Route>
              
              {/* Protected admin routes */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* Add more admin routes here */}
              </Route>
              
              {/* Protected coach routes */}
              <Route element={<ProtectedRoute allowedRoles={["COACH"]} />}>
                <Route path="/coach/dashboard" element={<CoachDashboard />} />
                {/* Add more coach routes here */}
              </Route>
              
              {/* Default redirect to login */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </ProfileProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
