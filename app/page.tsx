import regatta from "@/data/regatta.json";
import MobileNav from "./MobileNav";
import InterestForm from "./InterestForm";
import RacePlan from "./RacePlan";

export const dynamic = "force-static";

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
            <p className="card-date">25. - 30. 9.</p>
            <p className="card-year">2027</p>
            <div className="card-rule" />
            <div className="card-stats">
              <span><strong>20</strong> lodí</span>
              <span><strong>120</strong> ľudí</span>
              <span><strong>70</strong> nm</span>
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
              Sedem rozjázd, dve kategórie lodí a jedna spoločná štartová
              čiara. Opatrné rozhodnutie nikdy nie je penalizované.
            </p>
            <div className="ratio"><span style={{ width: "70%" }} /></div>
            <p className="ratio-label"><strong>7</strong> rozjázd</p>
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
      </section>

      <section className="section section-audience" id="pre-koho">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> Pre koho je to</p>
          <h2>Pre tímy, ktoré spolu rozhodujú.</h2>
          <p>
            Tack &amp; Talk nie je firemný výlet. Je to päť nocí, počas
            ktorých firemný tím žije, plaví sa a rieši spolu na priestore
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
            <p className="eyebrow eyebrow-dark"><span /> Pripravovaný model účasti</p>
            <h2>Dve platby,<br />jasne oddelené.</h2>
          </div>
          <p>
            Účasť na regate a plavidlo sú dve samostatné veci. Platíte ich
            zvlášť a rozhodujete o nich zvlášť. Konkrétne ceny zverejníme až
            po zmluvnom a právnom potvrdení modelu.
          </p>
        </div>

        <div className="fee-grid">
          <article className="fee-card fee-card-dark">
            <p className="fee-label">Účastnícky poplatok</p>
            <h3>Platí sa organizátorovi.</h3>
            <ul>
              <li>kompletná organizácia a produkcia podujatia</li>
              <li>sedem rozjázd, štartovacie procedúry, rozhodcovstvo a bodovanie</li>
              <li>moderované bloky, tímové výzvy, rečník a riadený networking</li>
              <li>štartovacie čísla a materiály pre posádku</li>
              <li>plachtárske inštrukcie a predodletový brífing</li>
              <li>spoločné večery zaradené do programu a fotodokumentácia</li>
            </ul>
          </article>
          <article className="fee-card">
            <p className="fee-label">Plavidlo</p>
            <h3>Zabezpečuje si posádka samostatne.</h3>
            <p>
              Loď nie je súčasťou účastníckeho poplatku. Zverejníme technickú
              špecifikáciu prípustného plavidla a odporúčané možnosti prenájmu
              v Rogoznici. Zmluvu na plavidlo uzatvára firma priamo s charterovou
              spoločnosťou.
            </p>
            <ul>
              <li>doprava do Rogoznice a späť</li>
              <li>poistenie osôb a plavidla a vratná kaucia</li>
              <li>kvalifikovaný kapitán alebo profesionálny skipper</li>
              <li>palivo, prístavné poplatky a potraviny na palube</li>
              <li>strava mimo spoločných večerov v programe</li>
            </ul>
          </article>
        </div>
        <div className="fee-note">
          <strong>Prečo takto:</strong> firma má kontrolu nad tým, aké plavidlo
          si vyberie a s kým na ňom pôjde. Finálne znenie tejto časti zverejníme
          po právnom posúdení štruktúry predaja.
        </div>
      </section>

      <section className="section section-faq" id="faq">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> Časté otázky</p>
            <h2>Čo chcete vedieť pred vyplávaním.</h2>
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
              Počet skipperov je obmedzený, preto sa zabezpečujú s predstihom.
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
              Najbližšie letisko je Split. Dopravu si zabezpečuje každá firma
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
              Sedem rozjázd používa nízkobodový systém. Dufour 460 a Dufour
              470 GL štartujú na jednej čiare; celkové poradie vzniká z
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
            Radi zodpovieme otázky od technickej špecifikácie plavidiel až po
            to, ako program sedí na váš tím. Ozývame sa spravidla do jedného
            pracovného dňa.
          </p>
        </div>
        <div className="contact-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tangreto-logo.png" alt="Tangreto" width="380" height="191" />
          <p><strong>Tangreto s.r.o.</strong><span>organizátor podujatia</span></p>
          <a href="mailto:info@tangreto.com">info@tangreto.com</a>
          <a href="tel:+421910909516">+421 910 909 516</a>
        </div>
      </section>

      <section className="section section-final" id="stav">
        <p className="eyebrow"><span /> Ďalší krok</p>
        <h2>Ešte nezaväzuje.<br />Len vás nechá pri tom.</h2>
        <p className="final-intro">
          Prihlasovanie zatiaľ nie je otvorené — flotilu a podmienky dolaďujeme
          a nechceme sľubovať miesta, kým ich nemáme potvrdené. Nechajte nám
          kontakt a ozveme sa, keď bude pripravený ďalší krok.
        </p>
        <InterestForm />
        <p className="final-note">
          Nezáväzné. Nejde o registráciu ani rezerváciu miesta. Neposielame
          hromadné newslettery — iba informácie o tomto podujatí.
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
          <p>25. - 30. 9. 2027 · Rogoznica, Chorvátsko</p>
          <p>Organizátor: Tangreto s.r.o.</p>
          <p>Pod záštitou Michala Hrivnáka</p>
          <p><a href="mailto:info@tangreto.com">info@tangreto.com</a></p>
        </div>
      </footer>
    </main>
  );
}
