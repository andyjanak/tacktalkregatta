"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Dict } from "./i18n";

type DayKey = "arrival" | "day1" | "day2" | "day3" | "day4";

const dayKeys: DayKey[] = ["arrival", "day1", "day2", "day3", "day4"];

// Poradové značky a geometria mapy sú jazykovo nezávislé.
const dayIndex: Record<DayKey, string> = {
  arrival: "N1",
  day1: "01",
  day2: "02",
  day3: "03",
  day4: "04",
};

const stopsGeom: Array<{
  key: DayKey;
  transform: string;
  label: string;
  text: { x: number; y: number; anchor?: "start" | "end" };
  subY: number;
}> = [
  { key: "arrival", transform: "translate(575 382)", label: "ROGOZNICA", text: { x: -16, y: -34, anchor: "end" }, subY: -18 },
  { key: "day1", transform: "translate(236 175)", label: "TRIBUNJ", text: { x: -32, y: -6, anchor: "end" }, subY: 10 },
  { key: "day2", transform: "translate(318 112)", label: "JEZERA", text: { x: 31, y: -8 }, subY: 8 },
  { key: "day3", transform: "translate(426 224)", label: "ZLARIN", text: { x: 30, y: -7 }, subY: 9 },
  { key: "day4", transform: "translate(590 395)", label: "ROGOZNICA", text: { x: -18, y: 42, anchor: "end" }, subY: 58 },
];

export default function RacePlan({
  route,
  program,
  days,
}: {
  route: Dict["route"];
  program: Dict["program"];
  days: Dict["days"];
}) {
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
          <p className="eyebrow"><span /> {route.eyebrow}</p>
          <h2 id="route-title">{route.h2Line1}<br />{route.h2Line2}</h2>
          <p>{route.lead}</p>
        </div>

        <div className="integrated-route-layout">
          <div>
            <div className="integrated-map" aria-label={route.mapAria}>
              <p className="map-instruction">{route.mapInstruction}</p>
              <svg viewBox="0 0 760 500" role="img" aria-labelledby="map-title map-desc">
                <title id="map-title">{route.mapTitle}</title>
                <desc id="map-desc">{route.mapDesc}</desc>
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
                {stopsGeom.map((stop, index) => (
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
                    <text className="sub" x={stop.text.x} y={stop.subY} textAnchor={stop.text.anchor}>{days[stop.key].mapSub}</text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="route-disclaimer">{route.disclaimer}</p>
          </div>

          <aside className="integrated-route-summary">
            <div>
              <p className="eyebrow">{route.baseEyebrow}</p>
              <h3>{route.baseName}</h3>
              <p>{route.baseP}</p>
              <ol>
                {route.ol.map((item) => (
                  <li key={item.span}><strong>{item.strong}</strong><span>{item.span}</span></li>
                ))}
              </ol>
            </div>
            <div className="route-safety-note"><strong>{route.safetyStrong}</strong><span>{route.safetySpan}</span></div>
          </aside>
        </div>
      </section>

      <section className="section integrated-program" id="program" aria-labelledby="program-title">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark"><span /> {program.eyebrow}</p>
          <h2 id="program-title">{program.h2}</h2>
          <p>{program.lead}</p>
        </div>

        <div className="plan-day-tabs" role="tablist" aria-label={program.tabsAria}>
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
            <span className="plan-day-index">{dayIndex[activeKey]}</span>
            <div><p>{activeDay.route}</p><h3>{activeDay.title}</h3></div>
            <strong>{activeKey === "arrival" ? program.arrivalTag : program.regataTag}</strong>
          </header>
          <p className="plan-day-copy">{activeDay.programme}</p>
          <div className="plan-fact-row" aria-label={program.factsAria}>{activeDay.facts.map((fact) => <span key={fact}>{fact}</span>)}</div>

          {activeKey !== "arrival" && (
            <article className="plan-race-status">
              <strong>9</strong>
              <div><span>{program.raceStatusLabel}</span><p>{program.raceStatusP}</p></div>
            </article>
          )}

          <article className="plan-content-card">
            <span>{program.shoreLabel}</span><div><h4>{activeDay.eveningTitle}</h4><p>{activeDay.eveningCopy}</p></div>
          </article>
        </div>
      </section>
    </>
  );
}
