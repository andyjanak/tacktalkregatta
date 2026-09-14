import LangSwitch from "./LangSwitch";
import MobileNav from "./MobileNav";
import PartnerForm from "./PartnerForm";
import partnersData from "@/data/partners.json";
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

type FeatureId = keyof Dict["partners"]["features"];

export default function PartnersPage({
  dict,
  locale,
}: {
  dict: Dict;
  locale: Locale;
}) {
  const p = dict.partners;
  const home = localeHome(locale);
  const levels = partnersData.levels;
  const features = partnersData.features;
  const levelNames = levels.map((l) => l.name);

  return (
    <main lang={dict.htmlLang} className="pt">
      <header className="site-header pt-header">
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
          <LangSwitch locale={locale} aria={dict.langSwitch.aria} routeKey="partners" />
        </div>
        <MobileNav nav={dict.nav} homePrefix={home} weatherHref={localeWeather(locale)} />
      </header>

      <section className="pt-intro">
        <p className="eyebrow"><span /> {p.eyebrow}</p>
        <h1 className="pt-h1">{p.h1Line1} <em>{p.h1Line2}</em></h1>
        <p className="pt-lead">{p.lead}</p>
      </section>

      <section className="pt-section pt-why">
        <div className="section-heading">
          <p className="eyebrow"><span /> {p.whyTitle}</p>
          <p className="pt-sublead">{p.whyLead}</p>
        </div>
        <div className="pt-stats">
          {p.stats.map((s, i) => (
            <div key={i} className="pt-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-section">
        <div className="section-heading">
          <p className="eyebrow"><span /> {p.levelsTitle}</p>
        </div>
        <div className="pt-levels">
          {levels.map((l) => (
            <article key={l.id} className={`pt-level${l.featured ? " pt-level-featured" : ""}`}>
              {l.featured ? <span className="pt-level-badge">{p.featuredBadge}</span> : null}
              <h3>{l.name}</h3>
              <p className="pt-level-price">
                <span>{p.priceFrom}</span> {l.priceBand}
              </p>
            </article>
          ))}
        </div>
        <p className="pt-note">{p.placeholderNote}</p>
      </section>

      <section className="pt-section pt-section-alt">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> {p.compareTitle}</p>
        </div>
        <div className="pt-table-wrap">
          <table className="pt-table">
            <thead>
              <tr>
                <th scope="col"></th>
                {levels.map((l) => (
                  <th key={l.id} scope="col" className={l.featured ? "is-featured" : ""}>
                    {l.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.id}>
                  <th scope="row">{p.features[f.id as FeatureId]}</th>
                  {f.values.map((v, i) => (
                    <td key={i} className={levels[i]?.featured ? "is-featured" : ""}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pt-section">
        <div className="pt-formwrap">
          <PartnerForm
            t={p}
            levelNames={levelNames}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </div>
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
