import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';

const resources = {
  en: {
    translation: enTranslation
  },
  de: {
    translation: deTranslation
  }
};

i18n
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // detect user language (use only safe methods)
  .use(LanguageDetector)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false, // Disable debug
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    returnObjects: true, // Enable returnObjects to access nested translation objects
    detection: {
      order: ['localStorage'], // Only use localStorage to avoid any browser API calls
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    nsSeparator: false,
    keySeparator: false,
    saveMissing: false, // Don't attempt to save missing translations
    react: {
      useSuspense: false // Disable suspense which can cause issues
    }
  });

export default i18n; 