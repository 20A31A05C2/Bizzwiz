import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

// French-speaking countries
const frenchCountries = [
  'FR', 'BE', 'CH', 'LU', 'MC', 'CA', 'CI', 'SN', 'ML', 'NE', 'BF',
  'TG', 'BJ', 'GA', 'CD', 'MG', 'CM', 'DJ', 'GN', 'BI', 'HT', 'RW'
];

// Init with fallback (default French), disable all detection
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslation },
      en: { translation: enTranslation }
    },
    lng: 'fr', // Force initial language to French
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

// Detect user country and override language accordingly
fetch('https://ipapi.co/json/')
  .then(res => res.json())
  .then(data => {
    const userCountry = data.country_code;
    if (!frenchCountries.includes(userCountry)) {
      i18n.changeLanguage('en');
    }
  })
  .catch(() => {
    // silent fail
  });

export default i18n;
