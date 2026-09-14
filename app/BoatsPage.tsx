import LangSwitch from "./LangSwitch";
import MobileNav from "./MobileNav";
import OrganizerLegal from "./OrganizerLegal";
import BoatGallery from "./BoatGallery";
import boatsData from "@/data/boats.json";
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

type SpecKey = keyof Dict["boats"]["spec"];
const SPEC_ORDER: SpecKey[] = [
  "length",
  "beam",
  "draught",
  "cabins",
  "berths",
  "wc",
  "engine",
  "crew",
];

export default function BoatsPage({
  dict,
  locale,
}: {
  dict: Dict;
  locale: Locale;
}) {
  const b = dict.boats;
  const home = localeHome(locale);

  return (
    <main lang={dict.htmlLang} className="bt">
      <header className="site-header bt-header">
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
          <LangSwitch locale={locale} aria={dict.langSwitch.aria} routeKey="boats" />
        </div>
        <MobileNav nav={dict.nav} homePrefix={home} weatherHref={localeWeather(locale)} />
      </header>

      <section className="bt-intro">
        <p className="eyebrow"><span /> {b.eyebrow}</p>
        <h1 className="bt-h1">{b.h1Line1} <em>{b.h1Line2}</em></h1>
        <p className="bt-lead">{b.lead}</p>
      </section>

      {boatsData.boats.map((boat) => {
        const specs = boat.specs as Record<SpecKey, string>;
        return (
          <section key={boat.id} className="bt-section">
            <div className="bt-card">
              <h2 className="bt-boat-name">{boat.name}</h2>

              <div className="bt-cols">
                <div className="bt-spec">
                  <p className="fee-label">{b.specTitle}</p>
                  <dl className="bt-spec-list">
                    {SPEC_ORDER.map((key) => (
                      <div key={key}>
                        <dt>{b.spec[key]}</dt>
                        <dd>{specs[key] ?? "—"}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="bt-visual">
                  <p className="fee-label">{b.galleryLabel}</p>
                  <BoatGallery
                    photos={boat.photos}
                    name={boat.name}
                    emptyLabel={b.galleryEmpty}
                    closeLabel={b.galleryClose}
                  />

                  <p className="fee-label bt-layout-label">{b.layoutLabel}</p>
                  {boat.layout ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="bt-layout" src={boat.layout} alt={`${boat.name} — ${b.layoutLabel}`} loading="lazy" />
                  ) : (
                    <p className="boat-gallery-empty">{b.layoutEmpty}</p>
                  )}

                  {boat.tourUrl ? (
                    <a className="bt-tour" href={boat.tourUrl} target="_blank" rel="noopener noreferrer">
                      {b.tourLabel} <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <p className="bt-note">{b.note}</p>

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
          <OrganizerLegal t={dict.footer} />
          <p><a href="mailto:info@tacktalkregatta.com">info@tacktalkregatta.com</a></p>
        </div>
      </footer>
    </main>
  );
}
