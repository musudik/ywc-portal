import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import AvatarSelector from "../../../components/ui/AvatarSelector";
import DashboardLayout from "../../../components/dashboard/layout";
import { useAuth } from "../../../contexts/AuthContext";
import { authApi } from "../../../api";

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const AccountSettings = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [accountInfo, setAccountInfo] = useState({
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    displayName: user?.displayName || "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState(user?.profileImage || "");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSaveAccountInfo = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      const updatedUser = await authApi.updateProfile({
        displayName: accountInfo.displayName,
        phoneNumber: accountInfo.phoneNumber,
      });
      
      // Update user in context if updateUser function exists
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setMessage(t("Account information updated successfully!"));
    } catch (err) {
      console.error("Failed to update account info:", err);
      setError(err.response?.data?.message || t("Failed to update account information"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async (avatarUrl) => {
    setAvatarLoading(true);
    setError("");
    setMessage("");
    
    try {
      const updatedUser = await authApi.updateProfile({
        profileImage: avatarUrl,
      });
      
      // Update user in context if updateUser function exists
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setSelectedAvatar(avatarUrl);
      setMessage(t("Profile picture updated successfully!"));
    } catch (err) {
      console.error("Failed to update avatar:", err);
      setError(err.response?.data?.message || t("Failed to update profile picture"));
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("Account Settings")}</h1>
          <p className="text-muted-foreground">{t("Manage your account details")}</p>
        </div>
        
        <div className="space-y-6">
          {/* Messages */}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Profile Picture Section */}
          <AvatarSelector
            currentAvatar={user?.profileImage}
            onAvatarSelect={setSelectedAvatar}
            onSave={handleSaveAvatar}
            loading={avatarLoading}
          />

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Account Information")}</CardTitle>
              <CardDescription>{t("Manage your personal account details")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{t("Personal Information")}</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">{t("Display Name")}</label>
                      <input
                        type="text"
                        value={accountInfo.displayName}
                        onChange={(e) => setAccountInfo({ ...accountInfo, displayName: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder={t("Enter your display name")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">{t("Email")}</label>
                      <input
                        type="email"
                        value={accountInfo.email}
                        disabled
                        className="w-full rounded-md border border-input bg-muted px-3 py-2 text-muted-foreground"
                        title={t("Email cannot be changed from here")}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("Email cannot be changed from account settings")}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">{t("Phone Number")}</label>
                      <input
                        type="tel"
                        value={accountInfo.phoneNumber}
                        onChange={(e) => setAccountInfo({ ...accountInfo, phoneNumber: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder={t("Enter your phone number")}
                      />
                    </div>
                    <Button 
                      onClick={handleSaveAccountInfo} 
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          {t("Saving...")}
                        </>
                      ) : (
                        t("Save Changes")
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">{t("Account Management")}</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <span>{t("Change Password")}</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-yellow-600">
                      <span>{t("Deactivate Account")}</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600">
                      <span>{t("Delete Account")}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings; 