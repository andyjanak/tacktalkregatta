import LangSwitch from "./LangSwitch";
import MobileNav from "./MobileNav";
import resultsData from "@/data/results.json";
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

export default function ResultsPage({
  dict,
  locale,
}: {
  dict: Dict;
  locale: Locale;
}) {
  const r = dict.results;
  const home = localeHome(locale);
  const years = resultsData.years;

  return (
    <main lang={dict.htmlLang} className="rs">
      <header className="site-header rs-header">
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
          <LangSwitch locale={locale} aria={dict.langSwitch.aria} routeKey="results" />
        </div>
        <MobileNav nav={dict.nav} homePrefix={home} weatherHref={localeWeather(locale)} />
      </header>

      <section className="rs-intro">
        <p className="eyebrow"><span /> {r.eyebrow}</p>
        <h1 className="rs-h1">
          {r.h1Line1} <em>{r.h1Line2}</em>
        </h1>
        <p className="rs-lead">{r.lead}</p>
      </section>

      <section className="rs-section">
        <div className="rs-grid">
          <article className="rs-card">
            <p className="rs-card-eyebrow">{r.scoringLead}</p>
            <h2>{r.scoringTitle}</h2>
            <p>{r.scoringP}</p>
          </article>
          <article className="rs-card">
            <h2>{r.tieTitle}</h2>
            <p>{r.tieP}</p>
          </article>
          <article className="rs-card">
            <h2>{r.discardTitle}</h2>
            <p>{r.discardP}</p>
          </article>
          <article className="rs-card">
            <h2>{r.whenTitle}</h2>
            <p>{r.whenP}</p>
          </article>
        </div>

        <div className="rs-live">
          <div>
            <h2>{r.liveTitle}</h2>
            <p>{r.liveP}</p>
          </div>
          <span className="rs-badge">{r.liveSoon}</span>
        </div>
      </section>

      <section className="rs-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> {r.archiveTitle}</p>
        </div>
        <ul className="rs-editions">
          {years.map((y) => (
            <li key={y.year} className="rs-edition">
              <span className="rs-edition-year">{r.editionPrefix} {y.year}</span>
              {y.status === "upcoming" ? (
                <span className="rs-badge">{r.upcoming}</span>
              ) : null}
            </li>
          ))}
        </ul>
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
