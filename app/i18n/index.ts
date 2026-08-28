import sk, { type Dict } from "./sk";
import en from "./en";

export type Locale = "sk" | "en";
export const locales: Locale[] = ["sk", "en"];
export const defaultLocale: Locale = "sk";

const dicts: Record<Locale, Dict> = { sk, en };

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
  "x-default": "/",
};

export type { Dict };
