import LangSwitch from "./LangSwitch";
import MobileNav from "./MobileNav";
import { CompassArrow, ScoreBar, WindRose, WindTimeline } from "./WeatherCharts";
import { localeHome, localeWeather, type Dict, type Locale } from "./i18n";
import type { WeatherPayload } from "@/lib/weather/service";
import type { CompassCode } from "@/lib/weather/types";

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

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}

export default function WeatherPage({
  dict,
  locale,
  payload,
}: {
  dict: Dict;
  locale: Locale;
  payload: WeatherPayload;
}) {
  const w = dict.weather;
  const home = localeHome(locale);
  const here = localeWeather(locale);
  const compass = w.compass as Record<CompassCode, string>;

  const points = [...payload.points].sort((a, b) => a.point.order - b.point.order);
  const primary = points.find((p) => p.forecastAvailable) ?? null;
  const anyForecast = points.some((p) => p.forecastAvailable);
  const anyClimate = points.some((p) => p.climatology);

  return (
    <main lang={dict.htmlLang} className="wx">
      <header className="site-header wx-header">
        <a className="brand-link" href={home} aria-label={dict.nav.brandUpAria}>
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label={dict.nav.mainAria}>
          <a href={`${home}#koncept`}>{dict.nav.koncept}</a>
          <a href={`${home}#trasa`}>{dict.nav.trasa}</a>
          <a href={here} aria-current="page" className="is-active">
            {dict.nav.pocasie}
          </a>
          <a href={`${home}#faq`}>{dict.nav.faq}</a>
        </nav>
        <div className="header-actions">
          <a className="nav-cta" href={`${home}#kontakt`}>{dict.nav.kontakt}</a>
          <LangSwitch locale={locale} aria={dict.langSwitch.aria} />
        </div>
        <MobileNav nav={dict.nav} homePrefix={home} weatherHref={here} />
      </header>

      <section className="wx-intro">
        <p className="eyebrow"><span /> {w.eyebrow}</p>
        <h1 className="wx-h1">
          {w.h1Line1} <em>{w.h1Line2}</em>
        </h1>
        <p className="wx-lead">{w.lead}</p>
        <div className="wx-meta">
          {payload.updatedAt ? (
            <span>{w.updatedPrefix}: {fmtDate(payload.updatedAt)}</span>
          ) : null}
          <span className="wx-source">{w.sourceNote}</span>
        </div>
      </section>

      {!anyForecast ? (
        <p className="wx-notice">
          <strong>{w.forecastUnavailableTitle}.</strong> {w.forecastUnavailable}
        </p>
      ) : null}

      {/* Aktuálne podmienky po bodoch trasy */}
      <section className="wx-section">
        <div className="section-heading">
          <p className="eyebrow"><span /> {w.routeTitle}</p>
        </div>
        <div className="wx-points">
          {points.map((p) => {
            const s = p.summary;
            const nowWave = p.hours[0]?.waveM ?? null;
            const clim = p.climatology;
            const forecast = p.forecastAvailable && s;
            return (
              <article key={p.point.id} className="wx-point">
                <header className="wx-point-head">
                  <span className="wx-point-order">{p.point.order + 1}</span>
                  <h3>{p.point.name}</h3>
                </header>

                {forecast ? (
                  <>
                    <div className="wx-now">
                      <div className="wx-now-main">
                        <span className="wx-now-val">{s.nowWindKn}</span>
                        <span className="wx-now-unit">{w.knotsShort}</span>
                      </div>
                      {s.nowDirDeg != null ? (
                        <div className="wx-now-dir">
                          <CompassArrow dirDeg={s.nowDirDeg} />
                          <span>{s.nowDir ? compass[s.nowDir] : "—"}</span>
                        </div>
                      ) : null}
                    </div>
                    <dl className="wx-metrics">
                      <div>
                        <dt>{w.gust}</dt>
                        <dd>{s.nowGustKn} {w.knotsShort}</dd>
                      </div>
                      <div>
                        <dt>{w.beaufort}</dt>
                        <dd>{s.nowBeaufort} Bft</dd>
                      </div>
                      {nowWave != null ? (
                        <div>
                          <dt>{w.waves}</dt>
                          <dd>{nowWave.toFixed(1)} {w.metres}</dd>
                        </div>
                      ) : null}
                    </dl>
                    {s.nowSafety ? (
                      <span className={`wx-pill wx-pill-${s.nowSafety}`}>
                        {w.safetyLabel[s.nowSafety]}
                      </span>
                    ) : null}
                  </>
                ) : clim ? (
                  <div className="wx-point-clim">
                    <p className="wx-point-climline">
                      {w.avgWind}: <strong>{clim.windMeanKn} {w.knotsShort}</strong>
                    </p>
                    <p className="wx-point-climline">
                      {w.prevailing}: <strong>{compass[clim.prevailingDir]}</strong>
                    </p>
                    <p className="wx-point-note">{w.modeClimate}</p>
                  </div>
                ) : (
                  <p className="wx-point-note">{w.loading}</p>
                )}
              </article>
            );
          })}
        </div>
        {anyForecast ? <p className="wx-safety-note">{w.safetyNote}</p> : null}
      </section>

      {/* Časový vývoj vetra + okno na plavbu */}
      {primary && primary.summary ? (
        <section className="wx-section wx-section-alt">
          <div className="section-heading">
            <p className="eyebrow"><span /> {w.timelineTitle}</p>
            <p className="wx-sublead">{w.timelineLead} · {primary.point.name}</p>
          </div>
          <div className="wx-timeline-wrap">
            <WindTimeline hours={primary.hours} windLabel={w.wind} gustLabel={w.gust} />
          </div>

          <div className="section-heading wx-window-head">
            <p className="eyebrow"><span /> {w.sailingWindowTitle}</p>
            <p className="wx-sublead">{w.sailingWindowLead}</p>
          </div>
          <ul className="wx-days">
            {primary.summary.daySailingScores.map((d) => (
              <li key={d.date} className="wx-day">
                <span className="wx-day-date">{d.date.slice(8, 10)}.{d.date.slice(5, 7)}.</span>
                <ScoreBar score={d.score} safety={d.safety} />
                <span className="wx-day-score">{d.score}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Klimatológia — ružice vetra a typické podmienky */}
      {anyClimate ? (
        <section className="wx-section">
          <div className="section-heading">
            <p className="eyebrow"><span /> {w.climateTitle}</p>
            <p className="wx-sublead">{w.climateLead}</p>
          </div>
          <div className="wx-climate">
            {points.map((p) =>
              p.climatology ? (
                <article key={p.point.id} className="wx-rose-card">
                  <h3>{p.point.name}</h3>
                  <WindRose bins={p.climatology.windRose} compassLabels={compass} />
                  <dl className="wx-climstats">
                    <div>
                      <dt>{w.avgWind}</dt>
                      <dd>{p.climatology.windMeanKn} {w.knotsShort}</dd>
                    </div>
                    <div>
                      <dt>{w.peakWind}</dt>
                      <dd>{p.climatology.windP90Kn} {w.knotsShort}</dd>
                    </div>
                    <div>
                      <dt>{w.prevailing}</dt>
                      <dd>{compass[p.climatology.prevailingDir]}</dd>
                    </div>
                    {p.climatology.tempMeanC != null ? (
                      <div>
                        <dt>{w.avgTemp}</dt>
                        <dd>{p.climatology.tempMeanC} °C</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>{w.maestralFreq}</dt>
                      <dd>{Math.round(p.climatology.maestralShare * 100)} %</dd>
                    </div>
                    <div>
                      <dt>{w.overThreshold}</dt>
                      <dd>{Math.round(p.climatology.overThresholdShare * 100)} %</dd>
                    </div>
                  </dl>
                </article>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {/* Slovník jadranských vetrov */}
      <section className="wx-section wx-section-alt">
        <div className="section-heading">
          <p className="eyebrow"><span /> {w.glossaryTitle}</p>
          <p className="wx-sublead">{w.glossaryLead}</p>
        </div>
        <div className="wx-glossary">
          {w.winds.map((wind) => (
            <article key={wind.name} className="wx-wind">
              <div className="wx-wind-head">
                <h3>{wind.name}</h3>
                <span className="wx-wind-dir">{wind.dir}</span>
              </div>
              <p className="wx-wind-when">{wind.when}</p>
              <p className="wx-wind-desc">{wind.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="wx-disclaimer">{w.disclaimer}</p>

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
