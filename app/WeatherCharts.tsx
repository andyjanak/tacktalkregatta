// Čisté SVG grafy pre modul počasia (server komponenty, bez JS).
// Farby cez CSS tokeny webu; dáta prichádzajú už spočítané zo servisu.
import type {
  CompassCode,
  SafetyLevel,
  WeatherHour,
  WindRoseBin,
} from "@/lib/weather/types";

const BAND_COLORS = {
  light: "#3f8f6a", // < 11 kn
  moderate: "#c08a2e", // 11–21 kn (brass)
  strong: "#b8532c", // 22–33 kn
  gale: "#8f2224", // > 33 kn
} as const;

const SAFETY_COLORS: Record<SafetyLevel, string> = {
  ok: "#2f8f63",
  caution: "#c08a2e",
  danger: "#b1332f",
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Anulárny sektor (prstencový výsek) medzi polomermi a uhlami.
function annularSector(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  a0: number,
  a1: number,
) {
  const p0 = polar(cx, cy, rOuter, a0);
  const p1 = polar(cx, cy, rOuter, a1);
  const p2 = polar(cx, cy, rInner, a1);
  const p3 = polar(cx, cy, rInner, a0);
  const large = a1 - a0 <= 180 ? 0 : 1;
  return [
    `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

const ROSE_DIRS: CompassCode[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

// Ružica vetra: 8 smerov, radiálne stohované pásma rýchlosti.
export function WindRose({
  bins,
  compassLabels,
}: {
  bins: WindRoseBin[];
  compassLabels: Record<CompassCode, string>;
}) {
  const size = 200;
  const c = size / 2;
  const rInner = 16;
  const rMax = 86;
  const byDir = new Map(bins.map((b) => [b.dir, b]));
  const maxTotal = Math.max(0.0001, ...bins.map((b) => b.total));
  const half = 20; // uhlová polšírka výseku

  const rings = [0.25, 0.5, 0.75, 1].map((f) => rInner + (rMax - rInner) * f);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="wx-rose" role="img">
      {rings.map((r, i) => (
        <circle key={i} cx={c} cy={c} r={r} className="wx-rose-grid" />
      ))}
      {ROSE_DIRS.map((dir, i) => {
        const b = byDir.get(dir);
        if (!b) return null;
        const angle = i * 45;
        const bands: [keyof typeof BAND_COLORS, number][] = [
          ["light", b.light],
          ["moderate", b.moderate],
          ["strong", b.strong],
          ["gale", b.gale],
        ];
        let acc = 0;
        return (
          <g key={dir}>
            {bands.map(([band, freq]) => {
              if (freq <= 0) return null;
              const r0 = rInner + (rMax - rInner) * (acc / maxTotal);
              acc += freq;
              const r1 = rInner + (rMax - rInner) * (acc / maxTotal);
              return (
                <path
                  key={band}
                  d={annularSector(c, c, r0, r1, angle - half, angle + half)}
                  fill={BAND_COLORS[band]}
                />
              );
            })}
          </g>
        );
      })}
      {ROSE_DIRS.filter((_, i) => i % 2 === 0).map((dir, i) => {
        const p = polar(c, c, rMax + 10, i * 90);
        return (
          <text key={dir} x={p.x} y={p.y} className="wx-rose-label">
            {compassLabels[dir]}
          </text>
        );
      })}
    </svg>
  );
}

// Kompasový smerník: šípka podľa smeru, ODKIAĽ fúka vietor.
export function CompassArrow({ dirDeg }: { dirDeg: number }) {
  const size = 46;
  const c = size / 2;
  const tail = polar(c, c, 15, dirDeg);
  const head = polar(c, c, 15, dirDeg + 180);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="wx-arrow" aria-hidden="true">
      <circle cx={c} cy={c} r={c - 1} className="wx-arrow-ring" />
      <line
        x1={tail.x}
        y1={tail.y}
        x2={head.x}
        y2={head.y}
        className="wx-arrow-line"
      />
      <circle cx={head.x} cy={head.y} r="3.4" className="wx-arrow-head" />
    </svg>
  );
}

// Časový graf vetra a nárazov (najbližšie hodiny). Prahová čiara na 25 uzloch.
export function WindTimeline({
  hours,
  gustLabel,
  windLabel,
}: {
  hours: WeatherHour[];
  gustLabel: string;
  windLabel: string;
}) {
  const w = 720;
  const h = 190;
  const padL = 30;
  const padR = 12;
  const padT = 12;
  const padB = 26;
  const data = hours.slice(0, 48);
  const n = Math.max(1, data.length - 1);
  const maxY = Math.max(28, ...data.map((d) => d.gustKn)) * 1.1;
  const x = (i: number) => padL + (i / n) * (w - padL - padR);
  const y = (v: number) => padT + (1 - v / maxY) * (h - padT - padB);

  const windLine = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.windKn).toFixed(1)}`).join(" ");
  const gustLine = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.gustKn).toFixed(1)}`).join(" ");
  const windArea = `${windLine} L ${x(n).toFixed(1)} ${y(0).toFixed(1)} L ${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;
  const yThresh = y(25);

  // Popisy dní (00:00 hranice).
  const dayTicks = data
    .map((d, i) => ({ i, d }))
    .filter(({ d }) => d.t.slice(11, 16) === "00:00");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="wx-timeline" role="img">
      {[0, 10, 20, 30].filter((v) => v < maxY).map((v) => (
        <g key={v}>
          <line x1={padL} y1={y(v)} x2={w - padR} y2={y(v)} className="wx-tl-grid" />
          <text x={padL - 6} y={y(v) + 3} className="wx-tl-ytick">{v}</text>
        </g>
      ))}
      <line x1={padL} y1={yThresh} x2={w - padR} y2={yThresh} className="wx-tl-thresh" />
      <path d={windArea} className="wx-tl-windarea" />
      <path d={windLine} className="wx-tl-wind" />
      <path d={gustLine} className="wx-tl-gust" />
      {dayTicks.map(({ i, d }) => (
        <text key={i} x={x(i)} y={h - 8} className="wx-tl-xtick">
          {d.t.slice(8, 10)}.{d.t.slice(5, 7)}.
        </text>
      ))}
      <g className="wx-tl-legend" transform={`translate(${padL + 4}, ${padT + 2})`}>
        <line x1="0" y1="0" x2="16" y2="0" className="wx-tl-wind" />
        <text x="20" y="3">{windLabel}</text>
        <line x1="90" y1="0" x2="106" y2="0" className="wx-tl-gust" />
        <text x="110" y="3">{gustLabel}</text>
      </g>
    </svg>
  );
}

// Vodorovný ukazovateľ skóre okna na plavbu (0–100), farba podľa bezpečnosti.
export function ScoreBar({ score, safety }: { score: number; safety: SafetyLevel }) {
  return (
    <svg viewBox="0 0 100 8" className="wx-scorebar" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="100" height="8" rx="4" className="wx-scorebar-track" />
      <rect x="0" y="0" width={Math.max(2, score)} height="8" rx="4" fill={SAFETY_COLORS[safety]} />
    </svg>
  );
}

export { SAFETY_COLORS };
