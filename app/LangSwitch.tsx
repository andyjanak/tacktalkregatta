import { locales, localeHome, type Locale } from "./i18n";

export default function LangSwitch({
  locale,
  aria,
}: {
  locale: Locale;
  aria: string;
}) {
  return (
    <div className="lang-switch" role="group" aria-label={aria}>
      {locales.map((l) => (
        <a
          key={l}
          href={localeHome(l)}
          hrefLang={l}
          className={l === locale ? "is-active" : ""}
          aria-current={l === locale ? "true" : undefined}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
