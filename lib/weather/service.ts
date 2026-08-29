// Servisná vrstva modulu počasia: refresh predpovede, výpočet klimatológie
// a zostavenie payloadu pre /api/weather. Spája poskytovateľa, analýzu a DB.
import {
  computeClimatology,
  safetyForGust,
  sailingScore,
  toBeaufort,
  toCompass,
} from "./analysis";
import { fetchArchiveWindow, fetchForecast } from "./open-meteo";
import { CLIMATOLOGY_WINDOW, WEATHER_POINTS, type WeatherPoint } from "./points";
import type {
  ClimatologyStats,
  ForecastSummary,
  PointForecast,
  WeatherHour,
} from "./types";

// Nájde hodinu najbližšiu zadanému času (na servírovanie „teraz").
function nearestHour(hours: WeatherHour[], nowMs: number): WeatherHour | null {
  if (hours.length === 0) return null;
  let best = hours[0];
  let bestDiff = Infinity;
  for (const h of hours) {
    const diff = Math.abs(new Date(h.t).getTime() - nowMs);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = h;
    }
  }
  return best;
}

// Zostaví zhrnutie predpovede (aktuálne podmienky + denné skóre okna).
export function buildSummary(
  forecast: PointForecast,
  nowMs: number,
): ForecastSummary {
  const now = nearestHour(forecast.hours, nowMs);

  // Zoskup hodiny podľa dátumu pre denné skóre.
  const byDate = new Map<string, WeatherHour[]>();
  for (const h of forecast.hours) {
    const date = h.t.slice(0, 10);
    const list = byDate.get(date) ?? [];
    list.push(h);
    byDate.set(date, list);
  }
  const daySailingScores = Array.from(byDate.entries())
    .slice(0, 7)
    .map(([date, hrs]) => {
      const gustMax = Math.max(...hrs.map((h) => h.gustKn));
      return {
        date,
        score: sailingScore(hrs),
        safety: safetyForGust(gustMax),
      };
    });

  return {
    pointId: forecast.pointId,
    updatedAt: forecast.updatedAt,
    nowWindKn: now ? Math.round(now.windKn) : null,
    nowGustKn: now ? Math.round(now.gustKn) : null,
    nowDir: now ? toCompass(now.dirDeg) : null,
    nowDirDeg: now ? Math.round(now.dirDeg) : null,
    nowBeaufort: now ? toBeaufort(now.windKn) : null,
    nowSafety: now ? safetyForGust(now.gustKn) : null,
    daySailingScores,
  };
}

// Stiahne a uloží čerstvú predpoveď pre všetky waypointy. Volá cron.
export async function refreshAllForecasts(): Promise<{
  ok: number;
  failed: number;
}> {
  const { saveSnapshot, pruneSnapshots } = await import("@/db/weather");
  let ok = 0;
  let failed = 0;
  for (const point of WEATHER_POINTS) {
    try {
      const forecast = await fetchForecast(point);
      const summary = buildSummary(forecast, Date.now());
      await saveSnapshot({ pointId: point.id, forecast, summary });
      ok++;
    } catch {
      failed++;
    }
  }
  await pruneSnapshots(30).catch(() => {});
  return { ok, failed };
}

// Roky archívu pre klimatológiu (posledných N celých rokov).
export function climatologyYears(currentYear: number, count = 20): number[] {
  const years: number[] = [];
  for (let y = currentYear - 1; y >= currentYear - count; y--) years.push(y);
  return years.reverse();
}

// Vypočíta a uloží klimatológiu pre všetky body z historického archívu.
export async function computeAllClimatology(
  years: number[],
): Promise<{ ok: number; failed: number }> {
  const { upsertClimatology } = await import("@/db/weather");
  const w = CLIMATOLOGY_WINDOW;
  const yearsLabel = `${years[0]}-${years[years.length - 1]}`;
  let ok = 0;
  let failed = 0;
  for (const point of WEATHER_POINTS) {
    try {
      const hours = await fetchArchiveWindow(
        point,
        years,
        w.startMonth,
        w.startDay,
        w.endMonth,
        w.endDay,
      );
      const stats = computeClimatology(point.id, w.label, yearsLabel, hours);
      await upsertClimatology({
        pointId: point.id,
        windowLabel: w.label,
        years: yearsLabel,
        stats,
      });
      ok++;
    } catch {
      failed++;
    }
  }
  return { ok, failed };
}

// Bootstrap: ak klimatológia ešte nie je vypočítaná, dopočíta ju (menší
// počet rokov, aby sa zmestila do limitu subrequestov aj na free pláne).
// Volá pravidelný cron, takže sa modul naplní sám bez manuálneho zásahu.
export async function bootstrapClimatologyIfEmpty(
  year: number,
): Promise<{ skipped: boolean; ok?: number; failed?: number }> {
  const { getClimatologyForWindow } = await import("@/db/weather");
  const existing = await getClimatologyForWindow(CLIMATOLOGY_WINDOW.label).catch(
    () => [] as unknown[],
  );
  if (existing.length > 0) return { skipped: true };
  const result = await computeAllClimatology(climatologyYears(year, 10));
  return { skipped: false, ...result };
}

export type WeatherPointPayload = {
  point: Pick<WeatherPoint, "id" | "name" | "lat" | "lon" | "order">;
  summary: ForecastSummary | null;
  hours: WeatherHour[]; // orezané na najbližších 48 h
  climatology: ClimatologyStats | null;
  forecastAvailable: boolean;
};

export type WeatherPayload = {
  updatedAt: string | null;
  window: string;
  points: WeatherPointPayload[];
};

// Zostaví payload pre /api/weather z najnovších snapshotov + klimatológie.
export async function getWeatherPayload(): Promise<WeatherPayload> {
  const { getLatestSnapshot, getClimatologyPoint } = await import("@/db/weather");
  const nowMs = Date.now();
  let updatedAt: string | null = null;

  const points = await Promise.all(
    WEATHER_POINTS.map(async (point) => {
      const [snap, clim] = await Promise.all([
        getLatestSnapshot(point.id).catch(() => null),
        getClimatologyPoint(point.id, CLIMATOLOGY_WINDOW.label).catch(() => null),
      ]);

      let summary: ForecastSummary | null = null;
      let hours: WeatherHour[] = [];
      let forecastAvailable = false;
      if (snap) {
        try {
          const forecast = JSON.parse(snap.forecastJson) as PointForecast;
          summary = buildSummary(forecast, nowMs);
          hours = forecast.hours
            .filter((h) => new Date(h.t).getTime() >= nowMs - 3600_000)
            .slice(0, 48);
          forecastAvailable = hours.length > 0;
          if (!updatedAt || forecast.updatedAt > updatedAt) {
            updatedAt = forecast.updatedAt;
          }
        } catch {
          /* poškodený snapshot ignorujeme */
        }
      }

      let climatology: ClimatologyStats | null = null;
      if (clim) {
        try {
          climatology = JSON.parse(clim.statsJson) as ClimatologyStats;
        } catch {
          /* ignoruj */
        }
      }

      return {
        point: {
          id: point.id,
          name: point.name,
          lat: point.lat,
          lon: point.lon,
          order: point.order,
        },
        summary,
        hours,
        climatology,
        forecastAvailable,
      } satisfies WeatherPointPayload;
    }),
  );

  return {
    updatedAt,
    window: CLIMATOLOGY_WINDOW.label,
    points,
  };
}
