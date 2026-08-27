import regatta from "@/data/regatta.json";
import MobileNav from "./MobileNav";
import InterestForm from "./InterestForm";
import RacePlan from "./RacePlan";
import { siteUrl } from "./site-config";

export const dynamic = "force-static";

// Štruktúrované dáta pre podujatie. Zámerne bez cien/dostupnosti — predaj
// ešte nie je otvorený (AGENTS.md: komunikuje sa „pripravujeme").
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: regatta.event.name,
  description: regatta.event.description_sk,
  startDate: regatta.event.start_date,
  endDate: regatta.event.end_date,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  image: new URL("/og-v2.jpg", siteUrl).toString(),
  url: siteUrl.toString(),
  location: {
    "@type": "Place",
    name: regatta.event.base_marina.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: regatta.event.base_marina.town,
      addressCountry: regatta.event.country,
    },
  },
  organizer: {
    "@type": "Organization",
    "@id": "https://www.ajservices.sk/#organization",
    name: regatta.organization.organizer.name,
    url: "https://www.ajservices.sk/",
  },
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <header className="site-header">
        <a className="brand-link" href="#hore" aria-label="Tack & Talk - hore">
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label="Hlavná navigácia">
          <a href="#koncept">Koncept</a>
          <a href="#pre-koho">Pre koho</a>
          <a href="#trasa">Trasa a program</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta" href="#kontakt">
          Kontakt
        </a>
        <MobileNav />
      </header>

      <section className="hero" id="hore">
        <div className="hero-media" aria-hidden="true">
          {/* Poster za videom: keď sa Vimeo nenačíta (blokované, pomalé), */}
          {/* zostane obrázok namiesto chybovej hlášky prehrávača. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-poster" src="/hero-yachting-poster.jpg" alt="" width="1672" height="941" />
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
          <p className="eyebrow"><span /> Biznis regata · Dalmácia 2027</p>
          <h1>
            Svieži vietor
            <br />
            v <em>plachtách.</em>
          </h1>
          <p className="hero-lead">
            Päť nocí. Štyri dni na vode. Dvadsať firemných posádok a obsah,
            ktorý pokračuje aj po návrate do maríny.
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
            <p className="card-kicker">Rogoznica · Chorvátsko</p>
            <p className="card-date">25. – 30. 9.</p>
            <p className="card-year">2027</p>
            <div className="card-rule" />
            <div className="card-stats">
              <span><strong>20</strong> lodí</span>
              <span><strong>120</strong> ľudí</span>
              <span><strong>9</strong> rozjázd</span>
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
              Deväť rozjázd, dve kategórie lodí a jedna spoločná štartová
              čiara. Opatrné rozhodnutie nikdy nie je penalizované.
            </p>
            <div className="ratio"><span style={{ width: "90%" }} /></div>
            <p className="ratio-label"><strong>9</strong> rozjázd</p>
          </article>
          <article className="concept-card concept-card-light">
            <span className="concept-number">02</span>
            <p className="concept-label">Na brehu</p>
            <h3>Reálne problémy, nie vizitky.</h3>
            <p>
              Večerné diskusie, workshop a riadený networking. Program stojí
              na problémoch, ktoré firmy reálne riešia.
            </p>
            <div className="ratio"><span style={{ width: "40%" }} /></div>
            <p className="ratio-label"><strong>4</strong> obsahové bloky</p>
          </article>
        </div>

        <div className="who-organizes">
          <p className="who-kicker">Kto to organizuje</p>
          <p>
            Podujatie pripravuje{" "}
            <a href="https://www.ajservices.sk/">AJservices, s.r.o.</a>{" "}
            ako hlavný organizátor, v spolupráci so spoluorganizátorom Tangreto, s.r.o.
            a pod záštitou veliteľa flotily Michala Hrivnáka.
          </p>
        </div>
      </section>

      <section className="section section-audience" id="pre-koho">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> Pre koho je to</p>
          <h2>Pre tímy, ktoré spolu rozhodujú.</h2>
          <p>
            Tack &amp; Talk nie je firemný výlet. Je to päť nocí, počas
            ktorých firemný tím spoločne funguje, plaví sa a rozhoduje v priestore
            veľkom ako obývačka. Nikto neodbehne na call. Nikto sa nevytratí
            po druhom chode.
          </p>
        </div>

        <div className="audience-grid">
          <article>
            <span>01</span>
            <h3>Vedenie firiem a manažérske tímy</h3>
            <p>
              Pre ľudí, ktorí spolu robia rozhodnutia, ale málokedy majú štyri
              dni na to, aby ich premysleli do konca.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Obchodné a projektové tímy</h3>
            <p>
              Tam, kde na výsledku záleží zohratosť a kde sa oplatí zistiť,
              ako sa tím správa pod tlakom mimo kancelárie.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Firmy, ktoré hostia klientov a partnerov</h3>
            <p>
              Jedna loď je priestor na rozhovory a spoločnú
              skúsenosť, ktorá pokračuje aj po návrate.
            </p>
          </article>
        </div>

        <div className="audience-summary">
          <p>
            Jedna firma tvorí <strong>jednu posádku na jednej lodi</strong>.
            {" "}Odporúčaný tím má štyroch až desiatich ľudí podľa zvolenej lode.
          </p>
          <div className="no-need-grid" aria-label="Čo na účasť nepotrebujete">
            <article><strong>Skúsenosti s plachtením</strong><span>Firma môže využiť vlastného skippera alebo si vyžiadať odporúčanie.</span></article>
            <article><strong>Športovú formu</strong><span>Plavba zaberie časť dňa; zvyšok patrí programu a kotvisku.</span></article>
            <article><strong>Vlastniť plavidlo</strong><span>Loď si firma zabezpečuje vo vlastnej réžii podľa potvrdenej špecifikácie.</span></article>
          </div>
        </div>
      </section>

      <RacePlan />

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

      <section className="section section-fees" id="ucast">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> Lode a balík</p>
            <h2>Dve lode.<br />Kompletný balík.</h2>
          </div>
          <p>
            Balík zahŕňa kompletnú loď, poistenie kaucie, poplatky, stravu,
            regatu aj spoločný katamarán BALI 5.2. Ceny lodí zverejníme 15. 10. 2026.
          </p>
        </div>

        <div className="fee-grid">
          <article className="fee-card fee-card-dark">
            <p className="fee-label">Dufour 460</p>
            <h3>Kompletná loď pre firemnú posádku.</h3>
            <p>Jedna cena za loď a potvrdený rozsah služieb podujatia.</p>
          </article>
          <article className="fee-card">
            <p className="fee-label">Dufour 470</p>
            <h3>Viac priestoru. Rovnaký program.</h3>
            <p>Jedna cena za loď a potvrdený rozsah služieb podujatia.</p>
          </article>
        </div>

        <div className="price-reveal" role="note">
          <p className="fee-label">Ceny</p>
          <strong>Ceny lodí zverejníme 15. 10. 2026.</strong>
          <p>Dovtedy komunikujeme koncept, trasu a obsah balíčka. Nechajte nám nižšie kontakt a ozveme sa.</p>
        </div>
        <div className="package-includes" aria-label="Čo zahŕňa cena každej lode">
          <p className="fee-label">Cena každej lode zahŕňa</p>
          <ul>
            <li>kompletnú loď</li>
            <li>poistenie kaucie a poplatky</li>
            <li>kontrolu a pomoc s prevzatím lode organizátorom</li>
            <li>päť spoločných večerí</li>
            <li>štyri raňajky</li>
            <li>regatu: štyri súťažné dni a deväť rozjázd</li>
            <li>katamarán BALI 5.2 počas celého podujatia</li>
          </ul>
          <p>Presné ceny lodí zverejníme 15. 10. 2026.</p>
        </div>
        <article className="bali-card">
          <figure className="bali-photo">
            {/* Static promo asset is intentionally served directly by the site. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bali-52-promo.jpg"
              alt="Katamarán BALI 5.2 počas plavby na mori"
              width="1600"
              height="899"
              loading="lazy"
            />
            <figcaption>Promo foto · BALI Catamarans</figcaption>
          </figure>
          <div className="bali-copy">
            <p className="eyebrow"><span /> V cene · celý čas s flotilou</p>
            <h3>Daj si kávu so súpermi na BALI 5.2 Lumiere.</h3>
            <p>Spoločný katamarán je zahrnutý v cene každej lode. Počas celého podujatia vytvára priestor na stretnutia medzi posádkami, rannú kávu aj rozhovory po návrate do prístavu.</p>
            <dl className="bali-specs" aria-label="Údaje o katamaráne BALI 5.2 Lumiere">
              <div><dt>Rok</dt><dd>2026</dd></div>
              <div><dt>Dĺžka</dt><dd>15,9 m</dd></div>
              <div><dt>Šírka</dt><dd>8,15 m</dd></div>
              <div><dt>Kapacita</dt><dd>12 osôb</dd></div>
              <div><dt>Kajuty / WC</dt><dd>7 / 7</dd></div>
              <div><dt>Motory</dt><dd>2 × 80 HP</dd></div>
            </dl>
            <p className="bali-features">Flybridge · klimatizácia · generátor · odsoľovač vody · kávovar</p>
          </div>
        </article>
      </section>

      <section className="section section-faq" id="faq">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> Časté otázky</p>
            <h2>Čo treba vedieť pred vyplávaním.</h2>
          </div>
          <p>
            Odpovede platia pre pripravovaný formát podujatia. Technické a
            zmluvné podmienky doplníme pred otvorením účasti.
          </p>
        </div>
        <div className="faq-list">
          <details>
            <summary>V posádke nikto nikdy neplachtil. Môžeme ísť?</summary>
            <p>
              Áno. K plavidlu si môžete objednať profesionálneho skippera,
              ktorý celý týždeň velí, učí a zodpovedá za bezpečnú plavbu.
              Kapacita profesionálnych skipperov je obmedzená, preto si ich treba zabezpečiť s predstihom.
            </p>
          </details>
          <details>
            <summary>Kto môže viesť loď?</summary>
            <p>
              Každá loď musí mať osobu s platným preukazom na vedenie plavidla
              uznávaným v Chorvátsku a oprávnením na obsluhu lodnej rádiostanice
              VHF. Konkrétne doklady overí charterová spoločnosť pred odovzdaním
              plavidla.
            </p>
          </details>
          <details>
            <summary>Ako to funguje so skipperom?</summary>
            <p>
              Skipper je profesionálny kapitán, ktorý sa stará o plavbu,
              manévre a bezpečnosť. Spí na palube a je súčasťou posádky.
              Zmluvu uzatvára firma priamo so skipperom; organizátor nie je
              zmluvnou stranou.
            </p>
          </details>
          <details>
            <summary>Ako sa dostaneme do Rogoznice?</summary>
            <p>
              Najbližšie letisko je v Splite. Dopravu si zabezpečuje každá firma
              samostatne; pri väčšom záujme pomôžeme
              koordinovať spoločnú dopravu.
            </p>
          </details>
          <details>
            <summary>Je to bezpečné?</summary>
            <p>
              Bezpečnosť má prednosť pred súťažou. Neplaví sa v noci, pri
              predpovedi nad 25 uzlov veliteľ flotily ruší etapu a flotila sa
              presúva v konvoji. Každá loď sa hlási na spoločnom VHF kanáli.
              Kapitán, ktorý z bezpečnostných dôvodov nevypláva, nestráca body;
              dostane priemer dovtedajších výsledkov.
            </p>
          </details>
          <details>
            <summary>Aké je počasie koncom septembra?</summary>
            <p>
              Typicky možno čakať teplotu mora okolo 22 °C a dennú teplotu
              vzduchu približne 22 až 26 °C, s chladnejšími večermi. Skutočné
              podmienky sa môžu meniť a plán plavby sa im vždy prispôsobuje.
            </p>
          </details>
          <details>
            <summary>Ako sa vlastne súťaží?</summary>
            <p>
              Deväť rozjázd používa nízkobodový systém. Dufour 460 a Dufour
              470 štartujú na jednej čiare; celkové poradie vzniká z
              prepočítaného času.
            </p>
          </details>
          <details>
            <summary>Môžeme prísť ako dve firmy na jednej lodi?</summary>
            <p>
              Formát je postavený ako jedna firma, jedna loď a jedna posádka.
              Individuálne výnimky budú možné iba po potvrdení organizátorom.
            </p>
          </details>
        </div>
      </section>

      <section className="section section-contact" id="kontakt">
        <div className="contact-copy">
          <p className="eyebrow"><span /> Kontakt</p>
          <h2>Máte otázku? Ozvite sa priamo.</h2>
          <p>
            Radi zodpovieme otázky týkajúce sa technickej špecifikácie plavidiel aj
            toho, ako program vyhovuje vášmu tímu. Ozývame sa spravidla do jedného
            pracovného dňa.
          </p>
        </div>
        <div className="contact-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ajservices-logo.png" alt="AJservices, s.r.o." width="720" height="180" />
          <p><strong>AJservices, s.r.o.</strong><span>hlavný organizátor</span></p>
          <a href="mailto:info@tacktalkregatta.com">info@tacktalkregatta.com</a>
          <a href="tel:+421910909516">+421 910 909 516</a>
        </div>
      </section>

      <section className="section section-final" id="stav">
        <p className="eyebrow"><span /> Ďalší krok</p>
        <h2>Ešte vás nezaväzuje.<br />Len vás udrží v obraze.</h2>
        <p className="final-intro">
          Prihlasovanie zatiaľ nie je otvorené — flotilu a podmienky dolaďujeme
          a nechceme sľubovať miesta, kým ich nemáme potvrdené. Nechajte nám
          kontakt a ozveme sa, keď bude pripravený ďalší krok.
        </p>
        <InterestForm turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        <p className="final-note">
          Nezáväzné. Nejde o registráciu ani rezerváciu miesta. Neposielame
          hromadné newslettery — iba informácie o tomto podujatí.
        </p>
      </section>

      <footer>
        <div>
          <Brand />
          <p>Svieži vietor v plachtách.</p>
          <div className="footer-organizer">
            <span>Organizátor</span>
            <a href="https://www.ajservices.sk/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ajservices-logo-footer.png" alt="AJservices, s.r.o." width="720" height="180" />
            </a>
          </div>
        </div>
        <div className="footer-meta">
          <p>25. – 30. 9. 2027 · Rogoznica, Chorvátsko</p>
          <p>Hlavný organizátor: <a className="footer-org-link" href="https://www.ajservices.sk/">AJservices, s.r.o.</a></p>
          <p>Spoluorganizátor: Tangreto, s.r.o.</p>
          <p>Pod záštitou Michala Hrivnáka</p>
          <p><a href="mailto:info@tacktalkregatta.com">info@tacktalkregatta.com</a></p>
          <a className="footer-admin-link" href="/admin">Admin <span aria-hidden="true">→</span></a>
        </div>
      </footer>
    </main>
  );
}
