import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

// Import avatar images statically to work with build systems
const avatarImages = {
  // Avatar set 1
  'avatar1_r1_c1': () => import('../../assets/avatar_icons/avatar1_r1_c1.png'),
  'avatar1_r1_c2': () => import('../../assets/avatar_icons/avatar1_r1_c2.png'),
  'avatar1_r1_c3': () => import('../../assets/avatar_icons/avatar1_r1_c3.png'),
  'avatar1_r1_c4': () => import('../../assets/avatar_icons/avatar1_r1_c4.png'),
  'avatar1_r1_c5': () => import('../../assets/avatar_icons/avatar1_r1_c5.png'),
  'avatar1_r1_c6': () => import('../../assets/avatar_icons/avatar1_r1_c6.png'),
  'avatar1_r1_c7': () => import('../../assets/avatar_icons/avatar1_r1_c7.png'),
  'avatar1_r1_c8': () => import('../../assets/avatar_icons/avatar1_r1_c8.png'),
  'avatar1_r2_c1': () => import('../../assets/avatar_icons/avatar1_r2_c1.png'),
  'avatar1_r2_c2': () => import('../../assets/avatar_icons/avatar1_r2_c2.png'),
  'avatar1_r2_c3': () => import('../../assets/avatar_icons/avatar1_r2_c3.png'),
  'avatar1_r2_c4': () => import('../../assets/avatar_icons/avatar1_r2_c4.png'),
  'avatar1_r2_c5': () => import('../../assets/avatar_icons/avatar1_r2_c5.png'),
  'avatar1_r2_c6': () => import('../../assets/avatar_icons/avatar1_r2_c6.png'),
  'avatar1_r2_c7': () => import('../../assets/avatar_icons/avatar1_r2_c7.png'),
  'avatar1_r2_c8': () => import('../../assets/avatar_icons/avatar1_r2_c8.png'),
  'avatar1_r3_c1': () => import('../../assets/avatar_icons/avatar1_r3_c1.png'),
  'avatar1_r3_c2': () => import('../../assets/avatar_icons/avatar1_r3_c2.png'),
  'avatar1_r3_c3': () => import('../../assets/avatar_icons/avatar1_r3_c3.png'),
  'avatar1_r3_c4': () => import('../../assets/avatar_icons/avatar1_r3_c4.png'),
  'avatar1_r3_c5': () => import('../../assets/avatar_icons/avatar1_r3_c5.png'),
  'avatar1_r3_c6': () => import('../../assets/avatar_icons/avatar1_r3_c6.png'),
  'avatar1_r3_c7': () => import('../../assets/avatar_icons/avatar1_r3_c7.png'),
  'avatar1_r3_c8': () => import('../../assets/avatar_icons/avatar1_r3_c8.png'),
  'avatar1_r4_c1': () => import('../../assets/avatar_icons/avatar1_r4_c1.png'),
  'avatar1_r4_c2': () => import('../../assets/avatar_icons/avatar1_r4_c2.png'),
  'avatar1_r4_c3': () => import('../../assets/avatar_icons/avatar1_r4_c3.png'),
  'avatar1_r4_c4': () => import('../../assets/avatar_icons/avatar1_r4_c4.png'),
  'avatar1_r4_c5': () => import('../../assets/avatar_icons/avatar1_r4_c5.png'),
  'avatar1_r4_c6': () => import('../../assets/avatar_icons/avatar1_r4_c6.png'),
  'avatar1_r4_c7': () => import('../../assets/avatar_icons/avatar1_r4_c7.png'),
  'avatar1_r4_c8': () => import('../../assets/avatar_icons/avatar1_r4_c8.png'),
  'avatar1_r5_c1': () => import('../../assets/avatar_icons/avatar1_r5_c1.png'),
  'avatar1_r5_c2': () => import('../../assets/avatar_icons/avatar1_r5_c2.png'),
  'avatar1_r5_c3': () => import('../../assets/avatar_icons/avatar1_r5_c3.png'),
  'avatar1_r5_c4': () => import('../../assets/avatar_icons/avatar1_r5_c4.png'),
  'avatar1_r5_c5': () => import('../../assets/avatar_icons/avatar1_r5_c5.png'),
  'avatar1_r5_c6': () => import('../../assets/avatar_icons/avatar1_r5_c6.png'),
  'avatar1_r5_c7': () => import('../../assets/avatar_icons/avatar1_r5_c7.png'),
  'avatar1_r5_c8': () => import('../../assets/avatar_icons/avatar1_r5_c8.png'),
  'avatar1_r6_c1': () => import('../../assets/avatar_icons/avatar1_r6_c1.png'),
  'avatar1_r6_c2': () => import('../../assets/avatar_icons/avatar1_r6_c2.png'),
  'avatar1_r6_c3': () => import('../../assets/avatar_icons/avatar1_r6_c3.png'),
  'avatar1_r6_c4': () => import('../../assets/avatar_icons/avatar1_r6_c4.png'),
  'avatar1_r6_c5': () => import('../../assets/avatar_icons/avatar1_r6_c5.png'),
  'avatar1_r6_c6': () => import('../../assets/avatar_icons/avatar1_r6_c6.png'),
  'avatar1_r6_c7': () => import('../../assets/avatar_icons/avatar1_r6_c7.png'),
  'avatar1_r6_c8': () => import('../../assets/avatar_icons/avatar1_r6_c8.png'),
  // Avatar set 2
  'avatar2_r1_c1': () => import('../../assets/avatar_icons/avatar2_r1_c1.png'),
  'avatar2_r1_c2': () => import('../../assets/avatar_icons/avatar2_r1_c2.png'),
  'avatar2_r1_c3': () => import('../../assets/avatar_icons/avatar2_r1_c3.png'),
  'avatar2_r1_c4': () => import('../../assets/avatar_icons/avatar2_r1_c4.png'),
  'avatar2_r1_c5': () => import('../../assets/avatar_icons/avatar2_r1_c5.png'),
  'avatar2_r1_c6': () => import('../../assets/avatar_icons/avatar2_r1_c6.png'),
  'avatar2_r2_c1': () => import('../../assets/avatar_icons/avatar2_r2_c1.png'),
  'avatar2_r2_c2': () => import('../../assets/avatar_icons/avatar2_r2_c2.png'),
  'avatar2_r2_c3': () => import('../../assets/avatar_icons/avatar2_r2_c3.png'),
  'avatar2_r2_c4': () => import('../../assets/avatar_icons/avatar2_r2_c4.png'),
  'avatar2_r2_c5': () => import('../../assets/avatar_icons/avatar2_r2_c5.png'),
  'avatar2_r2_c6': () => import('../../assets/avatar_icons/avatar2_r2_c6.png'),
  'avatar2_r3_c1': () => import('../../assets/avatar_icons/avatar2_r3_c1.png'),
  'avatar2_r3_c2': () => import('../../assets/avatar_icons/avatar2_r3_c2.png'),
  'avatar2_r3_c3': () => import('../../assets/avatar_icons/avatar2_r3_c3.png'),
  'avatar2_r3_c4': () => import('../../assets/avatar_icons/avatar2_r3_c4.png'),
  'avatar2_r3_c5': () => import('../../assets/avatar_icons/avatar2_r3_c5.png'),
  'avatar2_r3_c6': () => import('../../assets/avatar_icons/avatar2_r3_c6.png'),
  'avatar2_r4_c1': () => import('../../assets/avatar_icons/avatar2_r4_c1.png'),
  'avatar2_r4_c2': () => import('../../assets/avatar_icons/avatar2_r4_c2.png'),
  'avatar2_r4_c3': () => import('../../assets/avatar_icons/avatar2_r4_c3.png'),
  'avatar2_r4_c4': () => import('../../assets/avatar_icons/avatar2_r4_c4.png'),
  'avatar2_r4_c5': () => import('../../assets/avatar_icons/avatar2_r4_c5.png'),
  'avatar2_r4_c6': () => import('../../assets/avatar_icons/avatar2_r4_c6.png'),
  'avatar2_r5_c1': () => import('../../assets/avatar_icons/avatar2_r5_c1.png'),
  'avatar2_r5_c2': () => import('../../assets/avatar_icons/avatar2_r5_c2.png'),
  'avatar2_r5_c3': () => import('../../assets/avatar_icons/avatar2_r5_c3.png'),
  'avatar2_r5_c4': () => import('../../assets/avatar_icons/avatar2_r5_c4.png'),
  'avatar2_r5_c5': () => import('../../assets/avatar_icons/avatar2_r5_c5.png'),
  'avatar2_r5_c6': () => import('../../assets/avatar_icons/avatar2_r5_c6.png'),
};

const AvatarSelector = ({ currentAvatar, onAvatarSelect, onSave, loading = false }) => {
  const { t } = useTranslation();
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvatars = async () => {
      setIsLoading(true);
      const loadedAvatars = [];
      
      try {
        // Load all avatar images
        const imagePromises = Object.entries(avatarImages).map(async ([id, importFn]) => {
          try {
            const module = await importFn();
            return {
              id,
              src: module.default,
              name: id.replace(/_/g, ' ').replace(/avatar(\d+) r(\d+) c(\d+)/, 'Avatar $1 - Row $2, Col $3')
            };
          } catch (error) {
            console.warn(`Failed to load avatar: ${id}`, error);
            return null;
          }
        });
        
        const results = await Promise.all(imagePromises);
        const validAvatars = results.filter(avatar => avatar !== null);
        setAvatars(validAvatars);
      } catch (error) {
        console.error("Error loading avatars:", error);
      }
      
      setIsLoading(false);
    };

    loadAvatars();
  }, []);

  useEffect(() => {
    setSelectedAvatar(currentAvatar);
  }, [currentAvatar]);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar.src);
    if (onAvatarSelect) {
      onAvatarSelect(avatar.src);
    }
  };

  const handleSave = () => {
    if (onSave && selectedAvatar) {
      onSave(selectedAvatar);
    }
  };

  const hasChanges = selectedAvatar !== currentAvatar;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Profile Picture")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Profile Picture")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("Choose an avatar from our collection")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Selection Preview */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={selectedAvatar || `https://ui-avatars.com/api/?name=User&background=1DB954&color=fff`}
              alt={t("Selected Avatar")}
              className="w-16 h-16 rounded-full border-2 border-green-500"
            />
            {hasChanges && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium">{t("Current Selection")}</h4>
            <p className="text-sm text-muted-foreground">
              {hasChanges ? t("Click Save to apply changes") : t("No changes made")}
            </p>
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="space-y-4">
          <h4 className="font-medium">{t("Choose an Avatar")} ({avatars.length} available)</h4>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-h-96 overflow-y-auto p-2 border rounded-md">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarClick(avatar)}
                className={`relative p-1 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md ${
                  selectedAvatar === avatar.src
                    ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20"
                    : "hover:ring-1 hover:ring-gray-300"
                }`}
                title={avatar.name}
              >
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {selectedAvatar === avatar.src && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  {t("Saving...")}
                </>
              ) : (
                t("Save Avatar")
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvatarSelector; 