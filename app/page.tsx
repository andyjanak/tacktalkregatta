import regatta from "@/data/regatta.json";
import MobileNav from "./MobileNav";

export const dynamic = "force-static";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "short",
});

const routeLegs = regatta.route.legs.filter(
  (leg) => leg.type !== "checkin" && leg.type !== "checkout",
);

const packageNotes: Record<string, string> = {
  BOAT_BAREBOAT: "6-členná firemná posádka s vlastným kvalifikovaným kapitánom.",
  BOAT_SKIPPER: "Celá firemná loď s profesionálnym skipperom.",
  BOAT_LEAD: "Vedúca loď jednej zo spoločných eskadier.",
  SEAT: "Jednotlivé miesto, ak sa po potvrdení flotily otvorí.",
  PARTNER: "Loď, viditeľnosť v materiáloch a vlastný programový blok.",
};

const publicPackages = regatta.pricing.packages.filter(
  (item) => item.code !== "PARTNER",
);

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

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand-link" href="#hore" aria-label="Tack & Talk - hore">
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label="Hlavná navigácia">
          <a href="#koncept">Koncept</a>
          <a href="#trasa">Trasa</a>
          <a href="#program">Program</a>
          <a href="#zastita">Záštita</a>
          <a href="#baliky">Balíky</a>
        </nav>
        <a className="nav-cta" href="#stav">
          Stav prípravy
        </a>
        <MobileNav />
      </header>

      <section className="hero" id="hore">
        <div className="hero-media" aria-hidden="true">
          <iframe
            title="Jachting na mori"
            src="https://player.vimeo.com/video/229143837?h=63d733599c&background=1&autoplay=1&muted=1&loop=1&autopause=0&controls=0&dnt=1"
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
          />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Business regatta · Dalmácia 2027</p>
          <h1>
            Prevetraj
            <br />
            svoj <em>biznis.</em>
          </h1>
          <p className="hero-lead">
            Sedem dní na mori. Dvadsať firemných posádok. Jedna regata,
            v ktorej rozhoduje plavba aj to, čo dokážete vytvoriť spolu.
          </p>
          <a className="patronage-pill" href="#zastita">
            Pod záštitou Michala Hrivnáka <span aria-hidden="true">↓</span>
          </a>
          <div className="hero-actions">
            <a className="button button-brass" href="#koncept">
              Pozrieť koncept <span aria-hidden="true">↘</span>
            </a>
            <a className="text-link" href="#trasa">
              Trasa a program <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Základné údaje o regate">
          <div className="hero-card">
            <p className="card-kicker">Sukošan · Chorvátsko</p>
            <p className="card-date">25. 9. - 2. 10.</p>
            <p className="card-year">2027</p>
            <div className="card-rule" />
            <div className="card-stats">
              <span><strong>20</strong> lodí</span>
              <span><strong>120</strong> ľudí</span>
              <span><strong>125</strong> nm</span>
            </div>
          </div>
          <p className="hero-note">Pripravujeme koncept a flotilu</p>
        </div>
      </section>

      <section className="status-strip" aria-label="Stav podujatia">
        <p><span className="status-dot" /> Projekt vo fáze prípravy</p>
        <p>Verejná registrácia sa otvorí až po zmluvnom a právnom potvrdení.</p>
      </section>

      <section className="section section-sand" id="koncept">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> Nie teambuilding. Spoločná výzva.</p>
          <h2>Na mori sa firma ukáže bez filtra.</h2>
          <p>
            Malý priestor, meniace sa podmienky a jasný cieľ. Regata prepája
            športovú disciplínu s obsahom, ktorý má pokračovanie aj po návrate.
          </p>
        </div>
        <div className="concept-grid">
          <article className="concept-card concept-card-dark">
            <span className="concept-number">01</span>
            <p className="concept-label">Na vode</p>
            <h3>Jednotná flotila, férová hra.</h3>
            <p>
              Päť bodovaných etáp, eskadry po štyroch lodiach a jedna škrtaná
              etapa. Opatrné rozhodnutie nikdy nie je penalizované.
            </p>
            <div className="ratio"><span style={{ width: "50%" }} /></div>
            <p className="ratio-label"><strong>50 %</strong> plachtárska vetva</p>
          </article>
          <article className="concept-card concept-card-light">
            <span className="concept-number">02</span>
            <p className="concept-label">Na brehu</p>
            <h3>Reálne problémy, nie vizitky.</h3>
            <p>
              Pitche, výzva eskadier a riadený networking. Boduje sa schopnosť
              počúvať, pomenovať problém a spoločne navrhnúť riešenie.
            </p>
            <div className="ratio"><span style={{ width: "50%" }} /></div>
            <p className="ratio-label"><strong>50 %</strong> obsahová vetva</p>
          </article>
        </div>
      </section>

      <section className="section section-route" id="trasa">
        <div className="section-heading heading-on-dark">
          <p className="eyebrow"><span /> 7 nocí · približne 125 námorných míľ</p>
          <h2>Dalmácia.<br />Každý deň iný kurz.</h2>
          <p>
            Zo Sukošanu cez Dugi otok, Kornati a Skradin späť do domovskej
            maríny. Trasa sa vždy prispôsobuje počasiu a bezpečnému rozhodnutiu.
          </p>
        </div>

        <div className="route-line" role="list" aria-label="Plánovaná trasa">
          {routeLegs.map((leg, index) => (
            <article className="route-stop" role="listitem" key={`${leg.day}-${leg.to}`}>
              <div className="route-marker"><span>{index + 1}</span></div>
              <p className="route-day">
                {dateFormatter.format(new Date(`${leg.date}T12:00:00+02:00`))}
              </p>
              <h3>{leg.to}</h3>
              <p>{leg.distance_nm} nm · {leg.scored ? leg.leg_code : "prológ"}</p>
            </article>
          ))}
        </div>
        <p className="route-disclaimer">
          Trasa a vzdialenosti sú orientačné a určené na plánovanie. Nie sú
          navigačným podkladom; pred plavbou sa overujú v oficiálnych námorných
          mapách a lodných sprievodcoch.
        </p>
      </section>

      <section className="section section-program" id="program">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> Program</p>
            <h2>Rytmus, ktorý drží flotilu spolu.</h2>
          </div>
          <p>
            Každý deň má svoju plavebnú aj obsahovú úlohu. Večer sa uzatvoria
            výsledky a ráno začína eskadra znova od spoločnej čiary.
          </p>
        </div>

        <div className="schedule">
          {regatta.route.legs.slice(1, 7).map((leg) => (
            <article className="schedule-row" key={leg.day}>
              <div className="schedule-date">
                <span>0{leg.day - 1}</span>
                <p>{leg.weekday}</p>
              </div>
              <div className="schedule-route">
                <p>{leg.from} <span aria-hidden="true">→</span> {leg.to}</p>
                <small>{leg.distance_nm} námorných míľ</small>
              </div>
              <div className="schedule-program">
                <p>{leg.programme[0]}</p>
                <small>{leg.programme.slice(1).join(" · ")}</small>
              </div>
              <div className={`schedule-badge ${leg.scored ? "is-scored" : ""}`}>
                {leg.scored ? leg.leg_code : "Prológ"}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-safety">
        <div className="safety-title">
          <p className="eyebrow"><span /> Pravidlo číslo jeden</p>
          <h2>Bezpečnosť má prednosť pred súťažou.</h2>
          <p>
            Za opatrnosť sa netrestá. Bezpečnostné vzdanie znamená priemer
            dovtedajších etáp, nie prehru.
          </p>
        </div>
        <div className="safety-grid">
          {regatta.safety_rules.slice(0, 4).map((item) => (
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
          <img
            src="/michal-hrivnak.jpg"
            alt="Michal Hrivnák pri kormidle"
            width="1080"
            height="1080"
          />
          <span>Pod záštitou</span>
        </div>
        <div className="patronage-copy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="tangreto-logo"
            src="/tangreto-logo.png"
            alt="Tangreto"
            width="380"
            height="191"
          />
          <p className="eyebrow eyebrow-dark"><span /> Skúsenosť pri kormidle</p>
          <h2>Michal Hrivnák</h2>
          <p>
            Zakladateľ Tangreto sa k plachteniu dostal ako šesťročný na
            slovenských jazerách a na otvorenom mori sa plaví od roku 2003.
            Regatám sa venuje od roku 2013 a Tangreto založil v roku 2014.
          </p>
          <p>
            Podľa oficiálneho profilu má za sebou viac než 30 000 námorných
            míľ. Tack &amp; Talk Regatta 2027 sa pripravuje pod jeho záštitou.
          </p>
          <a
            className="profile-link"
            href="https://www.tangreto.com/about-us/"
            target="_blank"
            rel="noreferrer"
          >
            Oficiálny profil na Tangreto <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="section section-packages" id="baliky">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> Plánované balíky</p>
            <h2>Jedna firma.<br />Jedna loď. Jeden tím.</h2>
          </div>
          <p>
            Primárnou jednotkou je celá loď pre šesťčlennú firemnú posádku.
            Ceny sú stanovené, predaj však zatiaľ nie je otvorený.
          </p>
        </div>
        <div className="package-grid">
          {publicPackages.map((item, index) => (
            <article className={`package-card ${index === 1 ? "featured" : ""}`} key={item.code}>
              <p className="package-index">0{index + 1}</p>
              <h3>{item.name}</h3>
              <p className="package-note">{packageNotes[item.code]}</p>
              <p className="package-price">{formatCurrency(item.price)}</p>
              <p className="package-meta">{item.pax === 1 ? "za osobu" : `za loď · ${item.pax} osôb`}</p>
            </article>
          ))}
        </div>
        <div className="price-note">
          <strong>Cenová politika:</strong> po 28. 2. 2027 sa cena neznižuje.
          Prípadné dopredanie mení obsah balíčka, nie jeho cenu.
        </div>
      </section>

      <section className="section section-final" id="stav">
        <p className="eyebrow"><span /> Aktuálny stav · august 2026</p>
        <h2>Pripravujeme flotilu.<br />Registráciu ešte nie.</h2>
        <p>
          Verejné prihlasovanie otvoríme až po podpise charterovej zmluvy a
          právnom posúdení predajného modelu. Dovtedy predstavujeme koncept,
          overujeme dopyt a pripravujeme bezpečné podmienky podujatia.
        </p>
        <div className="readiness">
          <div><span className="done" /> Koncept a trasa <strong>pripravené</strong></div>
          <div><span /> Charterová zmluva <strong>v príprave</strong></div>
          <div><span /> Právne posúdenie <strong>otvorené</strong></div>
        </div>
      </section>

      <footer>
        <div>
          <Brand />
          <p>Prevetraj svoj biznis.</p>
        </div>
        <div className="footer-meta">
          <p>25. 9. - 2. 10. 2027 · Dalmácia</p>
          <p>Organizátor: Tangreto s.r.o.</p>
          <p>Pod záštitou Michala Hrivnáka</p>
        </div>
      </footer>
    </main>
  );
}
