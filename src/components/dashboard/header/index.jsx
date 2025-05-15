import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../../components/ui/ThemeProvider";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/ui/LanguageSwitcher";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { styles } from "./styles";

// Icon components
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ThemeIcon = () => {
  const { theme } = useTheme();
  return theme === 'dark' ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
};

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EnfixLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#1DB954" fillOpacity="0.1"/>
    <path d="M28.2222 11.7778H11.7778V28.2222H28.2222V11.7778Z" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.7778 20H28.2222" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 11.7778V28.2222" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Header = ({ toggleSidebar }) => {
  const { toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
        <Link to="/" className={styles.logo}>
          <EnfixLogo />
          <span className={styles.logoText}>Enfix Portal</span>
        </Link>
      </div>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <SearchIcon />
          <input
            type="text"
            placeholder={t("Search...")}
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.headerRight}>
        <LanguageSwitcher />
        
        <button
          onClick={toggleTheme}
          className={styles.iconButton}
          aria-label="Toggle theme"
        >
          <ThemeIcon />
        </button>
        
        <button className={styles.iconButton} aria-label="Notifications">
          <NotificationIcon />
          <span className={styles.notificationBadge}>3</span>
        </button>
        
        <div className={styles.profileDropdown} ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={styles.profileButton}
            aria-label="Profile menu"
          >
            <img
              src="https://ui-avatars.com/api/?name=John+Doe&background=1DB954&color=fff"
              alt="Profile"
              className={styles.avatar}
            />
          </button>
          
          {showProfileMenu && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <p className={styles.dropdownName}>John Doe</p>
                <p className={styles.dropdownEmail}>john.doe@example.com</p>
              </div>
              
              <div className={styles.dropdownDivider}></div>
              
              <Link to="/client/profile" className={styles.dropdownItem}>
                <UserIcon />
                <span>{t("Profile")}</span>
              </Link>
              
              <Link to="/client/settings" className={styles.dropdownItem}>
                <SettingsIcon />
                <span>{t("Settings")}</span>
              </Link>
              
              <div className={styles.dropdownDivider}></div>
              
              <button onClick={handleLogout} className={styles.dropdownItem}>
                <LogoutIcon />
                <span>{t("Logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 