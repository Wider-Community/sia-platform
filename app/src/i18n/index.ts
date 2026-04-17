import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";

const saved = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: saved,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Apply direction on init and on change
function applyDir(lng: string) {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  localStorage.setItem("lang", lng);
}
applyDir(saved);
i18n.on("languageChanged", applyDir);

export default i18n;
