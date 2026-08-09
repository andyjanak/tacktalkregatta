import regatta from "@/data/regatta.json";
import MobileNav from "./MobileNav";
import InterestForm from "./InterestForm";

export const dynamic = "force-static";

const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "short",
});

const routeLegs = regatta.route.legs.filter(
  (leg) => leg.type !== "checkin" && leg.type !== "checkout",
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
          <a href="#pre-koho">Pre koho</a>
          <a href="#trasa">Trasa</a>
          <a href="#program">Program</a>
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

      <section className="section section-audience" id="pre-koho">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> Pre koho je to</p>
          <h2>Pre tímy, ktoré spolu rozhodujú.</h2>
          <p>
            Tack &amp; Talk nie je firemný výlet. Je to sedem dní, počas
            ktorých šesťčlenný tím žije, plaví sa a rieši spolu na priestore
            veľkom ako obývačka. Nikto neodbehne na call. Nikto sa nevytratí
            po druhom chode.
          </p>
        </div>

        <div className="audience-grid">
          <article>
            <span>01</span>
            <h3>Vedenie firiem a manažérske tímy</h3>
            <p>
              Pre ľudí, ktorí spolu robia rozhodnutia, ale málokedy majú sedem
              dní na to, aby ich premysleli do konca.
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
              Loď so šiestimi miestami je priestor na rozhovory a spoločnú
              skúsenosť, ktorá pokračuje aj po návrate.
            </p>
          </article>
        </div>

        <div className="audience-summary">
          <p>
            Typická účastnícka firma má <strong>15 až 200 zamestnancov</strong>
            {" "}a berie si jednu loď ako jeden tím. Väčšie firmy môžu vytvoriť
            dve posádky.
          </p>
          <div className="no-need-grid" aria-label="Čo na účasť nepotrebujete">
            <article><strong>Skúsenosti s plachtením</strong><span>Časť lodí pôjde s profesionálnym skipperom, ktorý velí a učí.</span></article>
            <article><strong>Športovú formu</strong><span>Plavba zaberie časť dňa; zvyšok patrí programu a kotvisku.</span></article>
            <article><strong>Vlastnú loď ani vybavenie</strong><span>Plavidlo a potrebné vybavenie sa zabezpečujú samostatne.</span></article>
          </div>
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
              <li>päť meraných etáp, štartovacie procedúry, rozhodcovstvo a bodovanie</li>
              <li>moderované bloky, tímové výzvy, rečník a riadený networking</li>
              <li>štartovacie čísla, vlajka eskadry a materiály pre posádku</li>
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
              v Sukošane. Zmluvu na plavidlo uzatvára firma priamo s charterovou
              spoločnosťou.
            </p>
            <ul>
              <li>doprava do Sukošanu a späť</li>
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
              manévre a bezpečnosť. Spí na palube a je súčasťou šesťčlennej
              posádky. Objednáva sa spolu s plavidlom.
            </p>
          </details>
          <details>
            <summary>Ako sa dostaneme do Sukošanu?</summary>
            <p>
              Autom je cesta z Bratislavy približne osem hodín, z Košíc
              približne jedenásť. Najbližšie letiská sú Zadar a Split. Dopravu
              si zabezpečuje každá firma samostatne; pri väčšom záujme pomôžeme
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
              Flotila je rozdelená na eskadry po štyroch lodiach. Polovicu
              výsledku tvorí plavba a polovicu obsahový program, takže o poradí
              nerozhodujú iba skúsenosti pri kormidle.
            </p>
          </details>
          <details>
            <summary>Môžeme prísť ako dve firmy na jednej lodi?</summary>
            <p>
              Áno. Loď má šesť miest a je na posádke, ako ich obsadí, pokiaľ
              všetci účastníci spĺňajú podmienky podujatia.
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
          Prihlasovanie zatiaľ nie je otvorené — flotilu a termíny dolaďujeme
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
          <p>25. 9. - 2. 10. 2027 · Dalmácia</p>
          <p>Organizátor: Tangreto s.r.o.</p>
          <p>Pod záštitou Michala Hrivnáka</p>
          <p><a href="mailto:info@tangreto.com">info@tangreto.com</a></p>
        </div>
      </footer>
    </main>
  );
}
