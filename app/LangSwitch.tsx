import {
  locales,
  routePath,
  languageNames,
  type Locale,
  type RouteKey,
} from "./i18n";
import Flag from "./Flag";

// Rozbaľovací prepínač jazykov (natívny <details>, bez JS). Sumár ukazuje
// aktuálny jazyk, po rozbalení zoznam jazykov. `routeKey` zabezpečí, že
// prepnutie jazyka zachová aktuálnu stránku (napr. /de/wetter → /pl/pogoda).
export default function LangSwitch({
  locale,
  aria,
  routeKey = "home",
}: {
  locale: Locale;
  aria: string;
  routeKey?: RouteKey;
}) {
  return (
    <details className="lang-switch">
      <summary aria-label={aria}>
        <Flag locale={locale} />
        <span>{locale.toUpperCase()}</span>
        <svg className="chev" width="10" height="7" viewBox="0 0 10 7" aria-hidden="true">
          <path d="M1 1.5 5 5.5 9 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="lang-menu">
        {locales.map((l) => (
          <a
            key={l}
            href={`${routePath(routeKey, l)}?lang=${l}`}
            hrefLang={l}
            className={l === locale ? "is-active" : ""}
            aria-current={l === locale ? "true" : undefined}
          >
            <Flag locale={l} />
            <span className="lang-code">{l.toUpperCase()}</span>
            <span className="lang-name">{languageNames[l]}</span>
          </a>
        ))}
      </div>
    </details>
  );
}
