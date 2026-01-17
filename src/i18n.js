import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import el from './locales/el.json';

// Detects user language (from browser settings, local storage, etc.)
// Passes i18n down to react-i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      el: { translation: el },
    },
    fallbackLng: 'en', // If language not found, use English
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
