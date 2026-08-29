// Čisté analytické funkcie pre modul počasia. Bez závislostí, testovateľné.
import type {
  CompassCode,
  SafetyLevel,
  WeatherHour,
  WindRoseBin,
  ClimatologyStats,
} from "./types";

const COMPASS: CompassCode[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

// Prahové hodnoty naviazané na bezpečnostné pravidlá regaty (nárazy v uzloch).
export const GUST_CAUTION_KN = 20;
export const GUST_DANGER_KN = 25; // > 25 uzlov = veliteľ flotily ruší etapu

// Smer (odkiaľ fúka) → 8-početný kompasový kód.
export function toCompass(deg: number): CompassCode {
  const norm = ((deg % 360) + 360) % 360;
  const idx = Math.round(norm / 45) % 8;
  return COMPASS[idx];
}

// Rýchlosť v uzloch → stupeň Beaufortovej stupnice (0–12).
export function toBeaufort(kn: number): number {
  const limits = [1, 3, 6, 10, 16, 21, 27, 33, 40, 47, 55, 63];
  for (let i = 0; i < limits.length; i++) {
    if (kn < limits[i]) return i;
  }
  return 12;
}

// Kategória bezpečnosti podľa nárazov.
export function safetyForGust(gustKn: number): SafetyLevel {
  if (gustKn > GUST_DANGER_KN) return "danger";
  if (gustKn >= GUST_CAUTION_KN) return "caution";
  return "ok";
}

// km/h → uzly (pre poskytovateľov, čo nevracajú uzly priamo).
export function kmhToKn(kmh: number): number {
  return kmh * 0.539957;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

// Skóre okna na plavbu (0–100) pre množinu hodín jedného dňa.
// Optimum je stredný vietor 8–18 uzlov; slabý aj nebezpečný vietor znižujú skóre.
export function sailingScore(hours: WeatherHour[]): number {
  if (hours.length === 0) return 0;
  const scores = hours.map((h) => {
    const w = h.windKn;
    let s: number;
    if (w < 4) s = 30 + w * 5; // príliš slabý — nuda
    else if (w <= 12) s = 100; // ideál
    else if (w <= 18) s = 100 - (w - 12) * 3; // stále dobrý
    else if (w <= 25) s = 82 - (w - 18) * 6; // silný, opatrne
    else s = Math.max(0, 40 - (w - 25) * 5); // nebezpečný
    if (h.gustKn > GUST_DANGER_KN) s = Math.min(s, 35);
    return Math.max(0, Math.min(100, s));
  });
  return Math.round(mean(scores));
}

// Detekcia termického vetra (maestral): popoludní (12–19 h) vietor zo
// sektora Z–SZ (240–330°) s rýchlosťou aspoň 8 uzlov.
export function isMaestralHour(h: WeatherHour): boolean {
  const hour = new Date(h.t).getHours();
  if (hour < 12 || hour > 19) return false;
  const d = ((h.dirDeg % 360) + 360) % 360;
  return d >= 240 && d <= 330 && h.windKn >= 8;
}

// Zostaví ružicu vetra (8 sektorov × pásma rýchlosti) z hodinových dát.
export function buildWindRose(hours: WeatherHour[]): WindRoseBin[] {
  const bins: WindRoseBin[] = COMPASS.map((dir) => ({
    dir,
    calm: 0,
    light: 0,
    moderate: 0,
    strong: 0,
    gale: 0,
    total: 0,
  }));
  const n = hours.length || 1;
  for (const h of hours) {
    const bin = bins[COMPASS.indexOf(toCompass(h.dirDeg))];
    const w = h.windKn;
    if (w < 1) bin.calm++;
    else if (w < 11) bin.light++;
    else if (w < 22) bin.moderate++;
    else if (w < 34) bin.strong++;
    else bin.gale++;
    bin.total++;
  }
  // Normalizuj na podiel (0–1).
  for (const b of bins) {
    b.calm /= n;
    b.light /= n;
    b.moderate /= n;
    b.strong /= n;
    b.gale /= n;
    b.total /= n;
  }
  return bins;
}

// Vypočíta klimatologické štatistiky z hodinových dát archívu pre jeden bod.
export function computeClimatology(
  pointId: string,
  windowLabel: string,
  years: string,
  hours: WeatherHour[],
): ClimatologyStats {
  const rose = buildWindRose(hours);
  const prevailing = rose.reduce((max, b) => (b.total > max.total ? b : max), rose[0]);
  const winds = hours.map((h) => h.windKn).sort((a, b) => a - b);
  const gusts = hours.map((h) => h.gustKn).sort((a, b) => a - b);
  const temps = hours.map((h) => h.tempC).filter((t): t is number => t != null);

  // Maestral: podiel popoludňajších hodín (12–19h) spĺňajúcich kritérium,
  // vztiahnutý k počtu popoludňajších hodín.
  const afternoons = hours.filter((h) => {
    const hr = new Date(h.t).getHours();
    return hr >= 12 && hr <= 19;
  });
  const maestralHits = afternoons.filter(isMaestralHour).length;
  const maestralShare = afternoons.length ? maestralHits / afternoons.length : 0;

  const overThreshold = hours.filter((h) => h.gustKn > GUST_DANGER_KN).length;

  return {
    pointId,
    windowLabel,
    years,
    samples: hours.length,
    windRose: rose,
    prevailingDir: prevailing.dir,
    windMeanKn: round1(mean(winds)),
    windMedianKn: round1(percentile(winds, 0.5)),
    windP90Kn: round1(percentile(winds, 0.9)),
    gustP90Kn: round1(percentile(gusts, 0.9)),
    tempMeanC: temps.length ? round1(mean(temps)) : null,
    maestralShare: round2(maestralShare),
    overThresholdShare: round2(hours.length ? overThreshold / hours.length : 0),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
