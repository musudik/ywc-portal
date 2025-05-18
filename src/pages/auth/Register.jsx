import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";
import { authApi } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/ui/Logo";

// Social media icons
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    phoneNumber: "",
    roleName: "CLIENT", // Default role
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.register.passwordMismatch"));
      return false;
    }
    
    // Basic password strength validation
    if (formData.password.length < 8) {
      setError(t("auth.register.passwordTooShort"));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Register the user
      await register({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || formData.email.split('@')[0], // Use email username if no display name
        phoneNumber: formData.phoneNumber,
        roleName: formData.roleName,
      });
      
      // Show success message
      alert(t("auth.register.successMessage") || "Registration successful! Please login to continue.");
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message || 
        t("auth.register.errorGeneric")
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[1000px] flex flex-row overflow-hidden">
        {/* Left side - Background Image */}
        <div className="hidden md:block w-1/2 bg-[#1DB954]/20 p-8 relative">
          <div className="absolute top-8 left-8">
            <Logo />
          </div>
          <div className="flex flex-col h-full justify-between">
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white">{t('auth.register.welcome')}</h2>
            </div>
            <div className="flex flex-row space-x-4 mt-auto">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <TwitterIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <LinkedInIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <GithubIcon />
              </a>
            </div>
            <div className="mt-auto">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-white">{t('auth.register.twoFactorIssue')}</p>
                <a href="#" className="text-sm text-white">{t('auth.register.privacyPolicy')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('auth.register.title')}</h1>
            <LanguageSwitcher />
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="block text-sm font-medium">
                {t('auth.register.nameLabel')}
              </label>
              <Input
                id="displayName"
                type="text"
                placeholder={t('auth.register.namePlaceholder')}
                className="bg-secondary/50 border-none"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>
          
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                {t('auth.register.emailLabel')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.register.emailPlaceholder')}
                className="bg-secondary/50 border-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                {t('auth.register.passwordLabel')}
              </label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.register.passwordPlaceholder')}
                className="bg-secondary/50 border-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                {t('auth.register.confirmPasswordLabel')}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
                className="bg-secondary/50 border-none"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium">
                {t('auth.register.phoneLabel')}
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder={t('auth.register.phonePlaceholder')}
                className="bg-secondary/50 border-none"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 mt-2"
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('auth.register.signUpButton')}
            </Button>
            
            <div className="text-center pt-2">
              <Link to="/login" className="text-sm text-primary hover:underline">
                {t('auth.register.haveAccount')}
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default Register; 