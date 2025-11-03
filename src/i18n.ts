import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// import translations
import enTranslation from "./locales/en/en.json";
import neTranslation from "./locales/np/np.json";

// Helper function to convert English digits to Nepali digits
const toNepaliDigits = (num: string | number) => {
  const digits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return num.toString().replace(/\d/g, (d) => digits[parseInt(d)]);
};

const resources = {
  en: { translation: enTranslation },
  ne: { translation: neTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,

      // a formatter for Nepali digits
      format: (value, format, lng) => {
        if (format === "nepaliDigits" && lng === "ne") {
          return toNepaliDigits(value);
        }
        return value;
      },
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  });

export default i18n;
