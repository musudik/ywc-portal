import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "./styles";

const GooglePlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.435-.29.704 0 .253.088.506.29.722.174.18.435.288.704.288.253 0 .506-.088.722-.297L16.544 12 5.036 0.397C4.649 0.01 4.069 0.01 3.682 0.397 3.295 0.784 3.295 1.364 3.609 1.814z" />
    <path d="M14.8 12L20.4 6.4C20.7 6.1 20.7 5.5 20.4 5.1 20 4.8 19.5 4.8 19.1 5.1L13.5 10.7 14.8 12z" />
    <path d="M14.8 12l-1.3 1.3 5.6 5.6c0.2 0.2 0.4 0.3 0.7 0.3 0.2 0 0.5-0.1 0.7-0.3 0.4-0.4 0.4-0.9 0-1.3L14.8 12z" />
    <path d="M3.4 0.8C3.2 0.9 0 2.7 0 12 0 21.3 3.2 23.1 3.4 23.2 3.5 23.3 3.7 23.3 3.8 23.3 4 23.3 4.1 23.3 4.3 23.1 4.6 22.8 4.6 22.2 4.3 21.9 4.2 21.8 1.3 20.3 1.3 12 1.3 3.7 4.2 2.2 4.3 2.1 4.6 1.8 4.7 1.2 4.3 0.9 4.1 0.8 3.7 0.7 3.4 0.8z" />
  </svg>
);

const AppleStoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const Footer = ({ collapsed }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`${styles.footer} ${collapsed ? styles.footerCollapsed : ''}`}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.downloadSection}>
            <h4 className={styles.downloadTitle}>{t("Download our app")}</h4>
            <div className={styles.downloadButtons}>
              <a href="#" className={styles.downloadButton}>
                <GooglePlayIcon />
                <div className={styles.downloadButtonText}>
                  <span className={styles.downloadButtonSmall}>{t("GET IT ON")}</span>
                  <span className={styles.downloadButtonLarge}>Google Play</span>
                </div>
              </a>
              <a href="#" className={styles.downloadButton}>
                <AppleStoreIcon />
                <div className={styles.downloadButtonText}>
                  <span className={styles.downloadButtonSmall}>{t("Download on the")}</span>
                  <span className={styles.downloadButtonLarge}>App Store</span>
                </div>
              </a>
            </div>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerLinksColumn}>
              <h5 className={styles.footerLinksTitle}>{t("Quick Links")}</h5>
              <ul className={styles.footerLinksList}>
                <li><a href="#">{t("Dashboard")}</a></li>
                <li><a href="#">{t("Profile")}</a></li>
                <li><a href="#">{t("Settings")}</a></li>
              </ul>
            </div>
            
            <div className={styles.footerLinksColumn}>
              <h5 className={styles.footerLinksTitle}>{t("Support")}</h5>
              <ul className={styles.footerLinksList}>
                <li><a href="#">{t("Help Center")}</a></li>
                <li><a href="#">{t("Contact Us")}</a></li>
                <li><a href="#">{t("FAQ")}</a></li>
              </ul>
            </div>
            
            <div className={styles.footerLinksColumn}>
              <h5 className={styles.footerLinksTitle}>{t("Legal")}</h5>
              <ul className={styles.footerLinksList}>
                <li><a href="#">{t("Terms")}</a></li>
                <li><a href="#">{t("Privacy")}</a></li>
                <li><a href="#">{t("Cookies")}</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Enfix. {t("All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 