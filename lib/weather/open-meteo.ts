// Adaptér poskytovateľa Open-Meteo (zdarma, bez API kľúča). Normalizuje
// odpovede do typov nezávislých od poskytovateľa (lib/weather/types).
// Zámerne používa iba globálny fetch — žiadny import cloudflare:workers,
// aby modul bežal aj v Node test harnesse.
import type { WeatherPoint } from "./points";
import type { PointForecast, WeatherDay, WeatherHour } from "./types";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const MARINE_URL = "https://marine-api.open-meteo.com/v1/marine";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const TZ = "Europe/Zagreb";
const PROVIDER = "open-meteo";

type HourlyBlock = Record<string, (number | null)[]> & { time: string[] };

async function getJson(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`open-meteo ${res.status} ${url}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

function num(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
function numOrNull(v: number | null | undefined): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

// Stiahne 7-dňovú predpoveď (vietor + more) pre jeden bod.
export async function fetchForecast(
  point: WeatherPoint,
  forecastDays = 7,
): Promise<PointForecast> {
  const base = `latitude=${point.lat}&longitude=${point.lon}&wind_speed_unit=kn&timezone=${encodeURIComponent(
    TZ,
  )}&forecast_days=${forecastDays}`;

  const forecastQ =
    `${FORECAST_URL}?${base}` +
    "&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m,temperature_2m,pressure_msl,precipitation" +
    "&daily=wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,temperature_2m_max,temperature_2m_min";
  const marineQ =
    `${MARINE_URL}?latitude=${point.lat}&longitude=${point.lon}&timezone=${encodeURIComponent(TZ)}` +
    `&forecast_days=${forecastDays}&hourly=wave_height,wave_period,wave_direction`;

  // Marine môže pre niektoré body/servery zlyhať — nesmie zhodiť predpoveď.
  const [fc, marine] = await Promise.all([
    getJson(forecastQ),
    getJson(marineQ).catch(() => null),
  ]);

  const fh = (fc.hourly ?? {}) as HourlyBlock;
  const mh = (marine?.hourly ?? null) as HourlyBlock | null;
  const marineByTime = new Map<string, number>();
  if (mh?.time) mh.time.forEach((t, i) => marineByTime.set(t, i));

  const hours: WeatherHour[] = (fh.time ?? []).map((t, i) => {
    const mi = marineByTime.get(t);
    return {
      t,
      windKn: num(fh.wind_speed_10m?.[i]),
      gustKn: num(fh.wind_gusts_10m?.[i]),
      dirDeg: num(fh.wind_direction_10m?.[i]),
      tempC: numOrNull(fh.temperature_2m?.[i]),
      pressureHpa: numOrNull(fh.pressure_msl?.[i]),
      precipMm: numOrNull(fh.precipitation?.[i]),
      waveM: mi != null ? numOrNull(mh?.wave_height?.[mi]) : null,
      wavePeriodS: mi != null ? numOrNull(mh?.wave_period?.[mi]) : null,
      waveDirDeg: mi != null ? numOrNull(mh?.wave_direction?.[mi]) : null,
    };
  });

  const dd = (fc.daily ?? {}) as HourlyBlock;
  const days: WeatherDay[] = (dd.time ?? []).map((date, i) => ({
    date,
    windMaxKn: num(dd.wind_speed_10m_max?.[i]),
    gustMaxKn: num(dd.wind_gusts_10m_max?.[i]),
    dirDominantDeg: num(dd.wind_direction_10m_dominant?.[i]),
    tempMaxC: numOrNull(dd.temperature_2m_max?.[i]),
    tempMinC: numOrNull(dd.temperature_2m_min?.[i]),
  }));

  return {
    pointId: point.id,
    provider: PROVIDER,
    updatedAt: new Date().toISOString(),
    hours,
    days,
  };
}

// Stiahne hodinové archívne dáta pre jeden bod za dané okno (mm-dd až mm-dd)
// naprieč rokmi. Vracia zliate hodiny pre výpočet klimatológie.
export async function fetchArchiveWindow(
  point: WeatherPoint,
  years: number[],
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
): Promise<WeatherHour[]> {
  const pad = (n: number) => String(n).padStart(2, "0");
  const all: WeatherHour[] = [];
  for (const y of years) {
    const start = `${y}-${pad(startMonth)}-${pad(startDay)}`;
    const end = `${y}-${pad(endMonth)}-${pad(endDay)}`;
    const q =
      `${ARCHIVE_URL}?latitude=${point.lat}&longitude=${point.lon}` +
      `&start_date=${start}&end_date=${end}&wind_speed_unit=kn&timezone=${encodeURIComponent(TZ)}` +
      "&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m,temperature_2m";
    const data = await getJson(q).catch(() => null);
    const h = (data?.hourly ?? null) as HourlyBlock | null;
    if (!h?.time) continue;
    h.time.forEach((t, i) => {
      all.push({
        t,
        windKn: num(h.wind_speed_10m?.[i]),
        gustKn: num(h.wind_gusts_10m?.[i]),
        dirDeg: num(h.wind_direction_10m?.[i]),
        tempC: numOrNull(h.temperature_2m?.[i]),
        pressureHpa: null,
        precipMm: null,
        waveM: null,
        wavePeriodS: null,
        waveDirDeg: null,
      });
    });
  }
  return all;
}
