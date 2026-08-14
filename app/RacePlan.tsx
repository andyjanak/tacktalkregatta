"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type DayKey = "arrival" | "day1" | "day2" | "day3" | "day4";

const days: Record<DayKey, {
  index: string;
  tab: string;
  destination: string;
  title: string;
  route: string;
  programme: string;
  facts: string[];
  eveningTitle: string;
  eveningCopy: string;
}> = {
  arrival: {
    index: "N1",
    tab: "Príchod",
    destination: "Rogoznica",
    title: "Rogoznica",
    route: "Marina Frapa · príchod flotily",
    programme: "Prevzatie a kontrola lodí s pomocou organizátora, kapitánsky brífing a otvorenie podujatia.",
    facts: ["Prevzatie lodí", "Kontrola organizátorom", "Večera 1/5"],
    eveningTitle: "Otvárací večer",
    eveningCopy: "Prvá spoločná večera a stretnutie posádok pred začiatkom súťažnej časti.",
  },
  day1: {
    index: "01",
    tab: "Deň 1",
    destination: "Tribunj",
    title: "Rogoznica → Tribunj",
    route: "Prvý súťažný deň",
    programme: "Raňajky, ranný brífing a prvá časť regaty s cieľom v Tribunji. Presný rozpis rozjázd zverejnia plachtárske inštrukcie.",
    facts: ["Súťažný deň 1/4", "Raňajky 1/4", "Večera 2/5"],
    eveningTitle: "Tribunj",
    eveningCopy: "Spoločná večera a priestor na rozhovory medzi posádkami po prvom súťažnom dni.",
  },
  day2: {
    index: "02",
    tab: "Deň 2",
    destination: "Jezera",
    title: "Tribunj → Jezera",
    route: "Druhý súťažný deň",
    programme: "Raňajky, ranný brífing a súťažný program na trase do Jezier. Presný rozpis rozjázd zverejnia plachtárske inštrukcie.",
    facts: ["Súťažný deň 2/4", "Raňajky 2/4", "Večera 3/5"],
    eveningTitle: "Jezera",
    eveningCopy: "Spoločná večera a stretnutia naprieč flotilou vrátane programu na BALI 5.2.",
  },
  day3: {
    index: "03",
    tab: "Deň 3",
    destination: "Zlarin",
    title: "Jezera → Zlarin",
    route: "Tretí súťažný deň",
    programme: "Raňajky, ranný brífing a súťažný program s cieľom na Zlarine. Presný rozpis rozjázd zverejnia plachtárske inštrukcie.",
    facts: ["Súťažný deň 3/4", "Raňajky 3/4", "Večera 4/5"],
    eveningTitle: "Zlarin",
    eveningCopy: "Celá flotila sa stretne pri spoločnej večeri a programe po treťom súťažnom dni.",
  },
  day4: {
    index: "04",
    tab: "Deň 4",
    destination: "Rogoznica",
    title: "Zlarin → Rogoznica",
    route: "Finálový súťažný deň",
    programme: "Raňajky, ranný brífing a finálová časť regaty s návratom do Mariny Frapa v Rogoznici.",
    facts: ["Súťažný deň 4/4", "Raňajky 4/4", "Večera 5/5"],
    eveningTitle: "Finále v Rogoznici",
    eveningCopy: "Záverečná spoločná večera a vyhlásenie výsledkov regaty.",
  },
};

const dayKeys = Object.keys(days) as DayKey[];

const stops: Array<{ key: DayKey; transform: string; label: string; sub: string; text: { x: number; y: number; anchor?: "start" | "end" }; subY: number }> = [
  { key: "arrival", transform: "translate(575 382)", label: "ROGOZNICA", sub: "Noc 1 · príchod", text: { x: -16, y: -34, anchor: "end" }, subY: -18 },
  { key: "day1", transform: "translate(236 175)", label: "TRIBUNJ", sub: "Deň 1", text: { x: -32, y: -6, anchor: "end" }, subY: 10 },
  { key: "day2", transform: "translate(318 112)", label: "JEZERA", sub: "Deň 2", text: { x: 31, y: -8 }, subY: 8 },
  { key: "day3", transform: "translate(426 224)", label: "ZLARIN", sub: "Deň 3", text: { x: 30, y: -7 }, subY: 9 },
  { key: "day4", transform: "translate(590 395)", label: "ROGOZNICA", sub: "Deň 4 · finále", text: { x: -18, y: 42, anchor: "end" }, subY: 58 },
];

export default function RacePlan() {
  const [activeKey, setActiveKey] = useState<DayKey>("day1");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeDay = days[activeKey];

  function selectDay(key: DayKey, scroll = false) {
    setActiveKey(key);
    if (scroll) document.querySelector("#program")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % dayKeys.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + dayKeys.length) % dayKeys.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = dayKeys.length - 1;
    else return;
    event.preventDefault();
    const key = dayKeys[next];
    setActiveKey(key);
    tabRefs.current[next]?.focus();
  }

  return (
    <>
      <section className="section section-route integrated-route" id="trasa" aria-labelledby="route-title">
        <div className="section-heading heading-on-dark">
          <p className="eyebrow"><span /> Trasa · 5 nocí · 4 súťažné dni · 9 rozjázd</p>
          <h2 id="route-title">Päť bodov.<br />Štyri dni.</h2>
          <p>Rogoznica, Tribunj, Jezera, Zlarin a návrat do Mariny Frapa. Vyber bod na mape a zobrazí sa denný program.</p>
        </div>

        <div className="integrated-route-layout">
          <div>
            <div className="integrated-map" aria-label="Schematická interaktívna mapa trasy">
              <p className="map-instruction">Vyber bod 1 – 5</p>
              <svg viewBox="0 0 760 500" role="img" aria-labelledby="map-title map-desc">
                <title id="map-title">Trasa TACK &amp; TALK REGATTA 2027</title>
                <desc id="map-desc">Schematická trasa z Rogoznice cez Tribunj, Jezera a Zlarin späť do Rogoznice. Päť interaktívnych bodov otvorí denný plán.</desc>
                <path className="plan-coast" d="M0 0H205C218 41 203 77 175 110C142 149 151 194 185 224C214 249 222 289 194 322C162 358 121 373 118 421C116 452 135 480 155 500H0Z" />
                <path className="plan-coast" d="M760 0H665C641 41 643 88 673 121C700 151 694 184 661 216C626 251 626 287 666 315C704 342 715 383 694 421C681 445 654 472 647 500H760Z" />
                <path className="plan-island" d="M250 70c22-18 59-15 65 8 7 27-17 53-47 48-27-4-38-37-18-56Z" />
                <path className="plan-island" d="M351 164c21-21 63-18 69 10 4 21-20 43-46 40-29-3-41-31-23-50Z" />
                <path className="plan-island" d="M451 294c30-25 78-8 70 25-6 27-48 39-75 18-17-14-15-27 5-43Z" />
                <path className="plan-island" d="M277 305c20-16 52-9 54 13 1 20-28 37-48 25-17-10-19-27-6-38Z" />
                <text className="plan-map-north" x="700" y="42">N</text>
                <path d="M705 76V51m0 0-7 11m7-11 7 11" fill="none" stroke="#C08A2E" strokeWidth="2" />
                <path className={`plan-route-segment ${activeKey === "day1" ? "is-active" : ""}`} d="M575 382C514 337 401 286 236 175" />
                <path className={`plan-route-segment ${activeKey === "day2" ? "is-active" : ""}`} d="M236 175C257 148 283 125 318 112" />
                <path className={`plan-route-segment ${activeKey === "day3" ? "is-active" : ""}`} d="M318 112C355 139 391 178 426 224" />
                <path className={`plan-route-segment ${activeKey === "day4" ? "is-active" : ""}`} d="M426 224C486 279 536 330 590 395" />
                {stops.map((stop, index) => (
                  <g
                    className={`plan-stop ${activeKey === stop.key ? "is-active" : ""}`}
                    key={stop.key}
                    transform={stop.transform}
                    tabIndex={0}
                    role="button"
                    aria-label={`${days[stop.key].tab}, ${days[stop.key].title}`}
                    aria-pressed={activeKey === stop.key}
                    onClick={() => selectDay(stop.key, true)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectDay(stop.key, true);
                      }
                    }}
                  >
                    <circle className="focus-ring" r="28" />
                    <circle className="halo" r="21" />
                    <circle className="dot" r="5" />
                    <text className="number" y="1">{index + 1}</text>
                    <text className="label" x={stop.text.x} y={stop.text.y} textAnchor={stop.text.anchor}>{stop.label}</text>
                    <text className="sub" x={stop.text.x} y={stop.subY} textAnchor={stop.text.anchor}>{stop.sub}</text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="route-disclaimer">Schematická mapa je určená iba na predstavenie programu. Nie je navigačným podkladom. Pred plavbou treba trasu overiť v oficiálnych námorných mapách a lodných sprievodcoch.</p>
          </div>

          <aside className="integrated-route-summary">
            <div>
              <p className="eyebrow">Základňa</p>
              <h3>Marina Frapa</h3>
              <p>Rogoznica, Chorvátsko. Dvadsať lodí a približne 120 účastníkov.</p>
              <ol>
                <li><strong>Rogoznica</strong><span>prevzatie lodí</span></li>
                <li><strong>Tribunj</strong><span>súťažný deň 1</span></li>
                <li><strong>Jezera</strong><span>súťažný deň 2</span></li>
                <li><strong>Zlarin</strong><span>súťažný deň 3</span></li>
                <li><strong>Rogoznica</strong><span>finále a vyhlásenie</span></li>
              </ol>
            </div>
            <div className="route-safety-note"><strong>Za opatrnosť sa netrestá.</strong><span>Veliteľ flotily môže etapu zrušiť alebo zmeniť trasu. Nočná plavba je zakázaná.</span></div>
          </aside>
        </div>
      </section>

      <section className="section integrated-program" id="program" aria-labelledby="program-title">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> Denný plán</p>
          <h2 id="program-title">Štyri dni. Deväť rozjázd.</h2>
          <p>Presný denný rozpis R1–R9 zverejnia plachtárske inštrukcie. Na tomto mieste uvádzame iba potvrdenú trasu a rámec programu.</p>
        </div>

        <div className="plan-day-tabs" role="tablist" aria-label="Vyber deň programu">
          {dayKeys.map((key, index) => (
            <button
              key={key}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`tab-${key}`}
              className="plan-day-tab"
              type="button"
              role="tab"
              aria-selected={activeKey === key}
              aria-controls="plan-day-detail"
              tabIndex={activeKey === key ? 0 : -1}
              onClick={() => setActiveKey(key)}
              onKeyDown={(event) => handleTabKey(event, index)}
            >
              <strong>{days[key].tab}</strong><span>{days[key].destination}</span>
            </button>
          ))}
        </div>

        <div className="plan-day-panel" id="plan-day-detail" role="tabpanel" aria-labelledby={`tab-${activeKey}`} aria-live="polite">
          <header className="plan-day-header">
            <span className="plan-day-index">{activeDay.index}</span>
            <div><p>{activeDay.route}</p><h3>{activeDay.title}</h3></div>
            <strong>{activeKey === "arrival" ? "Príchod" : "Regata"}</strong>
          </header>
          <p className="plan-day-copy">{activeDay.programme}</p>
          <div className="plan-fact-row" aria-label="Fakty dňa">{activeDay.facts.map((fact) => <span key={fact}>{fact}</span>)}</div>

          {activeKey !== "arrival" && (
            <article className="plan-race-status">
              <strong>9</strong>
              <div><span>rozjázd počas štyroch súťažných dní</span><p>Počet rozjázd v jednotlivých dňoch a ich trate potvrdia plachtárske inštrukcie. Bezpečnostné rozhodnutie veliteľa flotily má vždy prednosť.</p></div>
            </article>
          )}

          <article className="plan-content-card">
            <span>Program na brehu</span><div><h4>{activeDay.eveningTitle}</h4><p>{activeDay.eveningCopy}</p></div>
          </article>
        </div>
      </section>
    </>
  );
}
