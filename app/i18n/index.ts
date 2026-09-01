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

// ---------------------------------------------------------------------------
// Mapa routov: kanonický kľúč stránky → lokalizovaný slug pre každý jazyk.
// Slugy sú ASCII (bez diakritiky) kvôli čistým URL. Z tejto mapy sa generujú
// cesty, sitemap aj hreflang — nikdy sa nepíšu ručne.
// ---------------------------------------------------------------------------
export type RouteKey = "home" | "weather";

const routeSlugs: Record<RouteKey, Record<Locale, string>> = {
  home: { sk: "", en: "", cs: "", de: "", hu: "", hr: "", pl: "" },
  weather: {
    sk: "pocasie",
    en: "weather",
    cs: "pocasi",
    de: "wetter",
    hu: "idojaras",
    hr: "vrijeme",
    pl: "pogoda",
  },
};

// Cesta pre danú stránku a jazyk. SK je v koreni, ostatné pod "/<locale>".
export function routePath(key: RouteKey, locale: Locale): string {
  const base = locale === defaultLocale ? "" : `/${locale}`;
  const slug = routeSlugs[key][locale];
  if (!slug) return base || "/";
  return `${base}/${slug}`;
}

// hreflang alternatívy pre danú stránku (7 jazykov + x-default → SK).
export function routeAlternates(key: RouteKey): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of locales) out[l] = routePath(key, l);
  out["x-default"] = routePath(key, defaultLocale);
  return out;
}

// Slovenčina je na "/", ostatné jazyky pod "/<locale>".
export function localeHomePath(locale: Locale): string {
  return routePath("home", locale);
}

// Stránka počasia — lokalizovaný slug (napr. /pocasie, /en/weather, /de/wetter).
export function localeWeather(locale: Locale): string {
  return routePath("weather", locale);
}

// hreflang alternatívy generované z mapy routov.
export const languageAlternates = routeAlternates("home");
export const weatherAlternates = routeAlternates("weather");

export type { Dict };
