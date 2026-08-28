import sk, { type Dict } from "./sk";
import en from "./en";
import cs from "./cs";
import de from "./de";
import hu from "./hu";
import hr from "./hr";

export type Locale = "sk" | "en" | "cs" | "de" | "hu" | "hr";
export const locales: Locale[] = ["sk", "en", "cs", "de", "hu", "hr"];
export const defaultLocale: Locale = "sk";

const dicts: Record<Locale, Dict> = { sk, en, cs, de, hu, hr };

// Vlastné (native) názvy jazykov pre rozbaľovací prepínač.
export const languageNames: Record<Locale, string> = {
  sk: "Slovenčina",
  en: "English",
  cs: "Čeština",
  de: "Deutsch",
  hu: "Magyar",
  hr: "Hrvatski",
};

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

// Slovenčina je na "/", ostatné jazyky pod "/<locale>".
export function localeHome(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

// hreflang alternatívy pre metadata (next/metadata alternates.languages).
export const languageAlternates: Record<string, string> = {
  sk: "/",
  en: "/en",
  cs: "/cs",
  de: "/de",
  hu: "/hu",
  hr: "/hr",
  "x-default": "/",
};

export type { Dict };
