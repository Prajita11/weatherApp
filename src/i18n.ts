import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// import translations (simple synchronous approach)
import enTranslation from "./locales/en/en.json";
import neTranslation from "./locales/ne/ne.json";

const resources = {
  en: { translation: enTranslation },
  ne: { translation: neTranslation },
};

i18n
  .use(LanguageDetector) // detect user language (from navigator/localStorage/cookie)
  .use(initReactI18next) // connect with react
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      // order and options for language detection
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  });

export default i18n;
