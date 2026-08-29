import regatta from "@/data/regatta.json";
import MobileNav from "./MobileNav";
import InterestForm from "./InterestForm";
import RacePlan from "./RacePlan";
import LangSwitch from "./LangSwitch";
import { siteUrl } from "./site-config";
import { localeHome, localeWeather, type Dict, type Locale } from "./i18n";

function Brand() {
  return (
    <span className="brand" aria-label="Tack and Talk Regatta 2027">
      <span>TACK</span>
      <span className="brand-amp">&amp;</span>
      <span>TALK</span>
      <span className="brand-year">2027</span>
    </span>
  );
}

export default function Landing({ dict, locale }: { dict: Dict; locale: Locale }) {
  const homeUrl = new URL(localeHome(locale), siteUrl).toString();

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: regatta.event.name,
    description: dict.meta.eventDescription,
    startDate: regatta.event.start_date,
    endDate: regatta.event.end_date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: locale,
    image: new URL("/og-v2.jpg", siteUrl).toString(),
    url: homeUrl,
    location: {
      "@type": "Place",
      name: regatta.event.base_marina.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: regatta.event.base_marina.town,
        addressRegion: regatta.event.region,
        addressCountry: regatta.event.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: regatta.event.base_marina.lat,
        longitude: regatta.event.base_marina.lon,
      },
    },
    organizer: {
      "@type": "Organization",
      "@id": "https://www.ajservices.sk/#organization",
      name: regatta.organization.organizer.name,
      url: "https://www.ajservices.sk/",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main lang={dict.htmlLang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="site-header">
        <a className="brand-link" href="#hore" aria-label={dict.nav.brandUpAria}>
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label={dict.nav.mainAria}>
          <a href="#koncept">{dict.nav.koncept}</a>
          <a href="#pre-koho">{dict.nav.preKoho}</a>
          <a href="#trasa">{dict.nav.trasa}</a>
          <a href={localeWeather(locale)}>{dict.nav.pocasie}</a>
          <a href="#faq">{dict.nav.faq}</a>
        </nav>
        <div className="header-actions">
          <a className="nav-cta" href="#kontakt">{dict.nav.kontakt}</a>
          <LangSwitch locale={locale} aria={dict.langSwitch.aria} />
        </div>
        <MobileNav nav={dict.nav} weatherHref={localeWeather(locale)} />
      </header>

      <section className="hero" id="hore">
        <div className="hero-media" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-poster" src="/hero-yachting-poster.jpg" alt="" width="1672" height="941" />
          <iframe
            title={dict.hero.videoTitle}
            src="https://player.vimeo.com/video/229143837?h=63d733599c&background=1&autoplay=1&muted=1&loop=1&autopause=0&controls=0&dnt=1"
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
          />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> {dict.hero.eyebrow}</p>
          <h1>
            {dict.hero.h1Line1}
            <br />
            {dict.hero.h1Line2Pre}<em>{dict.hero.h1Em}</em>
          </h1>
          <p className="hero-lead">{dict.hero.lead}</p>
          <a className="patronage-pill" href="#zastita">
            {dict.hero.patronage} <span aria-hidden="true">↓</span>
          </a>
          <div className="hero-actions">
            <a className="button button-brass" href="#koncept">
              {dict.hero.ctaConcept} <span aria-hidden="true">↘</span>
            </a>
            <a className="text-link" href="#trasa">
              {dict.hero.ctaRoute} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label={dict.hero.visualAria}>
          <div className="hero-card">
            <p className="card-kicker">{dict.hero.cardKicker}</p>
            <p className="card-date">{dict.hero.cardDate}</p>
            <p className="card-year">2027</p>
            <div className="card-rule" />
            <div className="card-stats">
              <span><strong>20</strong> {dict.hero.statBoats}</span>
              <span><strong>120</strong> {dict.hero.statPeople}</span>
              <span><strong>9</strong> {dict.hero.statRaces}</span>
            </div>
          </div>
          <p className="hero-note">{dict.hero.note}</p>
        </div>
      </section>

      <section className="status-strip" aria-label={dict.statusStrip.line1}>
        <p><span className="status-dot" /> {dict.statusStrip.line1}</p>
        <p>{dict.statusStrip.line2}</p>
      </section>

      <section className="section section-sand" id="koncept">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> {dict.koncept.eyebrow}</p>
          <h2>{dict.koncept.h2}</h2>
          <p>{dict.koncept.lead}</p>
        </div>
        <div className="concept-grid">
          <article className="concept-card concept-card-dark">
            <span className="concept-number">01</span>
            <p className="concept-label">{dict.koncept.card1Label}</p>
            <h3>{dict.koncept.card1H3}</h3>
            <p>{dict.koncept.card1P}</p>
            <div className="ratio"><span style={{ width: "90%" }} /></div>
            <p className="ratio-label"><strong>9</strong> {dict.koncept.card1Ratio}</p>
          </article>
          <article className="concept-card concept-card-light">
            <span className="concept-number">02</span>
            <p className="concept-label">{dict.koncept.card2Label}</p>
            <h3>{dict.koncept.card2H3}</h3>
            <p>{dict.koncept.card2P}</p>
            <div className="ratio"><span style={{ width: "40%" }} /></div>
            <p className="ratio-label"><strong>4</strong> {dict.koncept.card2Ratio}</p>
          </article>
        </div>

        <div className="who-organizes">
          <p className="who-kicker">{dict.koncept.whoKicker}</p>
          <p>
            {dict.koncept.whoPre}
            <a href="https://www.ajservices.sk/">{dict.koncept.whoLink}</a>
            {dict.koncept.whoPost}
          </p>
        </div>
      </section>

      <section className="section section-audience" id="pre-koho">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> {dict.audience.eyebrow}</p>
          <h2>{dict.audience.h2}</h2>
          <p>{dict.audience.lead}</p>
        </div>

        <div className="audience-grid">
          {dict.audience.cards.map((card, i) => (
            <article key={card.h3}>
              <span>{`0${i + 1}`}</span>
              <h3>{card.h3}</h3>
              <p>{card.p}</p>
            </article>
          ))}
        </div>

        <div className="audience-summary">
          <p>
            {dict.audience.summaryPre}<strong>{dict.audience.summaryStrong}</strong>{dict.audience.summaryPost}
          </p>
          <div className="no-need-grid" aria-label={dict.audience.noNeedAria}>
            {dict.audience.noNeed.map((item) => (
              <article key={item.title}><strong>{item.title}</strong><span>{item.desc}</span></article>
            ))}
          </div>
        </div>
      </section>

      <RacePlan route={dict.route} program={dict.program} days={dict.days} />

      <section className="section section-safety">
        <div className="safety-title">
          <p className="eyebrow"><span /> {dict.safety.eyebrow}</p>
          <h2>{dict.safety.h2}</h2>
          <p>{dict.safety.lead}</p>
        </div>
        <div className="safety-grid">
          {dict.safety.rules.map((item) => (
            <article key={item.id}>
              <span>{item.id}</span>
              <p>{item.rule}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-patronage" id="zastita">
        <div className="patronage-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/michal-hrivnak.jpg" alt={dict.patronage.photoAlt} width="1080" height="1080" />
          <span>{dict.patronage.badge}</span>
        </div>
        <div className="patronage-copy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="tangreto-logo" src="/tangreto-logo.png" alt="Tangreto" width="380" height="191" />
          <p className="eyebrow eyebrow-dark"><span /> {dict.patronage.eyebrow}</p>
          <h2>{dict.patronage.name}</h2>
          <p>{dict.patronage.p1}</p>
          <p>{dict.patronage.p2}</p>
          <a className="profile-link" href="https://www.tangreto.com/about-us/" target="_blank" rel="noreferrer">
            {dict.patronage.profileLink} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="section section-fees" id="ucast">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> {dict.fees.eyebrow}</p>
            <h2>{dict.fees.h2Line1}<br />{dict.fees.h2Line2}</h2>
          </div>
          <p>{dict.fees.lead}</p>
        </div>

        <div className="fee-grid">
          <article className="fee-card fee-card-dark">
            <p className="fee-label">{dict.fees.card1Label}</p>
            <h3>{dict.fees.card1H3}</h3>
            <p>{dict.fees.card1P}</p>
          </article>
          <article className="fee-card">
            <p className="fee-label">{dict.fees.card2Label}</p>
            <h3>{dict.fees.card2H3}</h3>
            <p>{dict.fees.card2P}</p>
          </article>
        </div>

        <div className="price-reveal" role="note">
          <p className="fee-label">{dict.fees.priceLabel}</p>
          <strong>{dict.fees.priceStrong}</strong>
          <p>{dict.fees.priceP}</p>
        </div>
        <div className="package-includes" aria-label={dict.fees.includesAria}>
          <p className="fee-label">{dict.fees.includesLabel}</p>
          <ul>
            {dict.fees.includes.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p>{dict.fees.includesNote}</p>
        </div>
        <article className="bali-card">
          <figure className="bali-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bali-52-promo.jpg" alt={dict.fees.baliPhotoAlt} width="1600" height="899" loading="lazy" />
            <figcaption>{dict.fees.baliCaption}</figcaption>
          </figure>
          <div className="bali-copy">
            <p className="eyebrow"><span /> {dict.fees.baliEyebrow}</p>
            <h3>{dict.fees.baliH3}</h3>
            <p>{dict.fees.baliP}</p>
            <dl className="bali-specs" aria-label={dict.fees.baliSpecsAria}>
              <div><dt>{dict.fees.baliSpecs.year}</dt><dd>2026</dd></div>
              <div><dt>{dict.fees.baliSpecs.length}</dt><dd>{dict.fees.baliSpecs.lengthVal}</dd></div>
              <div><dt>{dict.fees.baliSpecs.beam}</dt><dd>{dict.fees.baliSpecs.beamVal}</dd></div>
              <div><dt>{dict.fees.baliSpecs.capacity}</dt><dd>{dict.fees.baliSpecs.capacityVal}</dd></div>
              <div><dt>{dict.fees.baliSpecs.cabinsWc}</dt><dd>7 / 7</dd></div>
              <div><dt>{dict.fees.baliSpecs.engines}</dt><dd>2 × 80 HP</dd></div>
            </dl>
            <p className="bali-features">{dict.fees.baliFeatures}</p>
          </div>
        </article>
      </section>

      <section className="section section-faq" id="faq">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> {dict.faq.eyebrow}</p>
            <h2>{dict.faq.h2}</h2>
          </div>
          <p>{dict.faq.lead}</p>
        </div>
        <div className="faq-list">
          {dict.faq.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section section-contact" id="kontakt">
        <div className="contact-copy">
          <p className="eyebrow"><span /> {dict.contact.eyebrow}</p>
          <h2>{dict.contact.h2}</h2>
          <p>{dict.contact.lead}</p>
        </div>
        <div className="contact-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ajservices-logo.png" alt="AJservices, s.r.o." width="720" height="180" />
          <p><strong>AJservices, s.r.o.</strong><span>{dict.contact.orgRole}</span></p>
          <a href="mailto:info@tacktalkregatta.com">info@tacktalkregatta.com</a>
          <a href="tel:+421910909516">+421 910 909 516</a>
        </div>
      </section>

      <section className="section section-final" id="stav">
        <p className="eyebrow"><span /> {dict.final.eyebrow}</p>
        <h2>{dict.final.h2Line1}<br />{dict.final.h2Line2}</h2>
        <p className="final-intro">{dict.final.intro}</p>
        <InterestForm t={dict.form} turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        <p className="final-note">{dict.final.note}</p>
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
          <p>{dict.footer.mainOrgPre}<a className="footer-org-link" href="https://www.ajservices.sk/">AJservices, s.r.o.</a></p>
          <p>{dict.footer.coOrgLine}</p>
          <p>{dict.footer.patronageLine}</p>
          <p><a href="mailto:info@tacktalkregatta.com">info@tacktalkregatta.com</a></p>
          <a className="footer-admin-link" href="/admin">{dict.footer.adminLink} <span aria-hidden="true">→</span></a>
        </div>
      </footer>
    </main>
  );
}
