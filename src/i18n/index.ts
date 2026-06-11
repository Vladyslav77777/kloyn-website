import en from "./en";
import ru from "./ru";
import ua from "./ua";

export type Locale = "en" | "ru" | "ua";

export const locales: Locale[] = ["en", "ru", "ua"];

export const labels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  ua: "UA",
};

export type Translations = typeof en;

export const translations: Record<Locale, Translations> = { en, ru, ua };
