import sk, { type Dict } from "./sk";
import en from "./en";
import cs from "./cs";
import de from "./de";
import hu from "./hu";
import hr from "./hr";
import pl from "./pl";

export type Locale = "sk" | "en" | "cs" | "de" | "hu" | "hr" | "pl";
export const locales: Locale[] = ["sk", "en", "cs", "de", "hu", "hr", "pl"];
export const defaultLocale: Locale = "sk";

const dicts: Record<Locale, Dict> = { sk, en, cs, de, hu, hr, pl };

// Vlastné (native) názvy jazykov pre rozbaľovací prepínač.
export const languageNames: Record<Locale, string> = {
  sk: "Slovenčina",
  en: "English",
  cs: "Čeština",
  de: "Deutsch",
  hu: "Magyar",
  hr: "Hrvatski",
  pl: "Polski",
};

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

// Slovenčina je na "/", ostatné jazyky pod "/<locale>".
export function localeHome(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

// Stránka počasia: /pocasie (sk) alebo /<locale>/pocasie.
export function localeWeather(locale: Locale): string {
  return locale === defaultLocale ? "/pocasie" : `/${locale}/pocasie`;
}

// hreflang alternatívy pre metadata (next/metadata alternates.languages).
export const languageAlternates: Record<string, string> = {
  sk: "/",
  en: "/en",
  cs: "/cs",
  de: "/de",
  hu: "/hu",
  hr: "/hr",
  pl: "/pl",
  "x-default": "/",
};

// hreflang alternatívy pre stránku počasia.
export const weatherAlternates: Record<string, string> = {
  sk: "/pocasie",
  en: "/en/pocasie",
  cs: "/cs/pocasie",
  de: "/de/pocasie",
  hu: "/hu/pocasie",
  hr: "/hr/pocasie",
  pl: "/pl/pocasie",
  "x-default": "/pocasie",
};

export type { Dict };
