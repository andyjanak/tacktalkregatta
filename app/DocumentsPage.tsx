import LangSwitch from "./LangSwitch";
import MobileNav from "./MobileNav";
import documentsData from "@/data/documents.json";
import { localeHome, localeWeather, type Dict, type Locale } from "./i18n";

function Brand() {
  return (
    <span className="brand" aria-label="Tack and Talk Regatta 2027">
      <span>TACK</span>
      <span className="brand-amp">&amp;</span>
      <span>TALK</span>
    </span>
  );
}

export default function DocumentsPage({
  dict,
  locale,
}: {
  dict: Dict;
  locale: Locale;
}) {
  const d = dict.documents;
  const home = localeHome(locale);
  const meta = documentsData.documents;

  return (
    <main lang={dict.htmlLang} className="dc">
      <header className="site-header dc-header">
        <a className="brand-link" href={home} aria-label={dict.nav.brandUpAria}>
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label={dict.nav.mainAria}>
          <a href={`${home}#koncept`}>{dict.nav.koncept}</a>
          <a href={`${home}#trasa`}>{dict.nav.trasa}</a>
          <a href={localeWeather(locale)}>{dict.nav.pocasie}</a>
          <a href={`${home}#faq`}>{dict.nav.faq}</a>
        </nav>
        <div className="header-actions">
          <a className="nav-cta" href={`${home}#kontakt`}>{dict.nav.kontakt}</a>
          <LangSwitch locale={locale} aria={dict.langSwitch.aria} routeKey="documents" />
        </div>
        <MobileNav nav={dict.nav} homePrefix={home} weatherHref={localeWeather(locale)} />
      </header>

      <section className="dc-intro">
        <p className="eyebrow"><span /> {d.eyebrow}</p>
        <h1 className="dc-h1">
          {d.h1Line1} <em>{d.h1Line2}</em>
        </h1>
        <p className="dc-lead">{d.lead}</p>
      </section>

      <section className="dc-section">
        <ul className="dc-list">
          {d.docs.map((doc, i) => {
            const m = meta[i] ?? { status: "soon", version: "", date: "", url: "" };
            const ready = m.status === "ready" && m.url;
            return (
              <li key={i} className="dc-item">
                <div className="dc-item-main">
                  <h2>{doc.title}</h2>
                  <p>{doc.desc}</p>
                  {ready && m.version ? (
                    <p className="dc-version">
                      {d.versionPrefix} {m.version}
                      {m.date ? ` · ${m.date}` : ""}
                    </p>
                  ) : null}
                </div>
                <div className="dc-item-action">
                  {ready ? (
                    <a className="dc-open" href={m.url}>{d.open} →</a>
                  ) : (
                    <span className="dc-badge">{d.statusSoon}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="dc-note">{d.note}</p>
      </section>

      <footer>
        <div>
          <Brand />
          <p>{dict.footer.claim}</p>
          <div className="footer-organizer">
            <span>{dict.footer.organizerLabel}</span>
            <a href="https://www.ajservices.sk/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ajservices-logo-footer.png" alt="AJservices, s.r.o." width="720" height="180" />
            </a>
          </div>
        </div>
        <div className="footer-meta">
          <p>{dict.footer.dateLine}</p>
          <p><a className="footer-org-link" href={home}>← {dict.nav.brandUpAria}</a></p>
          <p>{dict.footer.patronageLine}</p>
          <p><a href="mailto:info@tacktalkregatta.com">info@tacktalkregatta.com</a></p>
        </div>
      </footer>
    </main>
  );
}
