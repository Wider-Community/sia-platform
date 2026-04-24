import type { I18nProvider } from "@refinedev/core";
import i18next from "i18next";

export const i18nProvider: I18nProvider = {
  translate(key, options, defaultMessage) {
    return i18next.t(key, { defaultValue: defaultMessage, ...options }) as string;
  },
  changeLocale(lang) {
    return i18next.changeLanguage(lang);
  },
  getLocale() {
    return i18next.language;
  },
};
