import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ClientDashboard from "./pages/client/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import CoachDashboard from "./pages/coach/Dashboard";
import ProfileSetup from "./pages/client/profile";
// Import i18n configuration
import "./i18n/i18n";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProfileProvider, useProfile } from "./contexts/ProfileContext";

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
                  {/* Add more client routes here */}
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
