import { and, desc, eq, lt } from "drizzle-orm";
import { weatherClimatology, weatherSnapshots } from "./schema";
import type { WeatherClimatology, WeatherSnapshot } from "./schema";
import type { ClimatologyStats, ForecastSummary, PointForecast } from "@/lib/weather/types";

// getDb sa importuje dynamicky (rovnako ako v rate-limit.ts), aby sa
// cloudflare:workers nenačítal staticky v Node test harnesse.

export async function saveSnapshot(input: {
  pointId: string;
  forecast: PointForecast;
  summary: ForecastSummary;
}): Promise<void> {
  const { getDb } = await import(".");
  const db = getDb();
  await db.insert(weatherSnapshots).values({
    pointId: input.pointId,
    provider: input.forecast.provider,
    forecastJson: JSON.stringify(input.forecast),
    marineJson: null,
    summaryJson: JSON.stringify(input.summary),
    fetchedAt: new Date().toISOString(),
  });
}

export async function getLatestSnapshot(
  pointId: string,
): Promise<WeatherSnapshot | null> {
  const { getDb } = await import(".");
  const db = getDb();
  const [row] = await db
    .select()
    .from(weatherSnapshots)
    .where(eq(weatherSnapshots.pointId, pointId))
    .orderBy(desc(weatherSnapshots.fetchedAt))
    .limit(1);
  return row ?? null;
}

// Zmaže snapshoty staršie ako `keepDays` (okrem najnovšieho na bod). Volá cron.
export async function pruneSnapshots(keepDays = 30): Promise<void> {
  const { getDb } = await import(".");
  const db = getDb();
  const cutoff = new Date(Date.now() - keepDays * 86400_000).toISOString();
  await db.delete(weatherSnapshots).where(lt(weatherSnapshots.fetchedAt, cutoff));
}

export async function upsertClimatology(input: {
  pointId: string;
  windowLabel: string;
  years: string;
  stats: ClimatologyStats;
}): Promise<void> {
  const { getDb } = await import(".");
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .insert(weatherClimatology)
    .values({
      pointId: input.pointId,
      windowLabel: input.windowLabel,
      years: input.years,
      statsJson: JSON.stringify(input.stats),
      computedAt: now,
    })
    .onConflictDoUpdate({
      target: [weatherClimatology.pointId, weatherClimatology.windowLabel],
      set: {
        years: input.years,
        statsJson: JSON.stringify(input.stats),
        computedAt: now,
      },
    });
}

export async function getClimatologyForWindow(
  windowLabel: string,
): Promise<WeatherClimatology[]> {
  const { getDb } = await import(".");
  const db = getDb();
  return db
    .select()
    .from(weatherClimatology)
    .where(eq(weatherClimatology.windowLabel, windowLabel));
}

export async function getClimatologyPoint(
  pointId: string,
  windowLabel: string,
): Promise<WeatherClimatology | null> {
  const { getDb } = await import(".");
  const db = getDb();
  const [row] = await db
    .select()
    .from(weatherClimatology)
    .where(
      and(
        eq(weatherClimatology.pointId, pointId),
        eq(weatherClimatology.windowLabel, windowLabel),
      ),
    )
    .limit(1);
  return row ?? null;
}
