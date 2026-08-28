import { locales, localeHome, languageNames, type Locale } from "./i18n";

// Rozbaľovací prepínač jazykov (natívny <details>, bez JS). Sumár ukazuje
// aktuálny jazyk, po rozbalení sa zobrazí zoznam všetkých jazykov.
export default function LangSwitch({
  locale,
  aria,
}: {
  locale: Locale;
  aria: string;
}) {
  return (
    <details className="lang-switch">
      <summary aria-label={aria}>
        <span>{locale.toUpperCase()}</span>
        <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden="true">
          <path d="M1 1.5 5 5.5 9 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="lang-menu">
        {locales.map((l) => (
          <a
            key={l}
            href={`${localeHome(l)}?lang=${l}`}
            hrefLang={l}
            className={l === locale ? "is-active" : ""}
            aria-current={l === locale ? "true" : undefined}
          >
            <span className="lang-code">{l.toUpperCase()}</span>
            <span className="lang-name">{languageNames[l]}</span>
          </a>
        ))}
      </div>
    </details>
  );
}
