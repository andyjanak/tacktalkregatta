import { eq, lt } from "drizzle-orm";
import { rateLimits } from "./schema";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Jednoduchý fixed-window limiter nad D1. Kľúč je akcia + identifikátor
 * (IP alebo e-mail). V okne `windowSeconds` povolí najviac `limit` pokusov.
 * Zámerne fail-open pri chybe DB, aby výpadok úložiska nezablokoval web.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const windowStart = nowSeconds - (nowSeconds % windowSeconds);

  try {
    const { getDb } = await import(".");
    const db = getDb();
    const [existing] = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.key, key))
      .limit(1);

    if (!existing || existing.windowStart !== windowStart) {
      await db
        .insert(rateLimits)
        .values({
          key,
          count: 1,
          windowStart,
          updatedAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: rateLimits.key,
          set: { count: 1, windowStart, updatedAt: new Date().toISOString() },
        });
      return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    if (existing.count >= limit) {
      const retryAfterSeconds = windowStart + windowSeconds - nowSeconds;
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    await db
      .update(rateLimits)
      .set({ count: existing.count + 1, updatedAt: new Date().toISOString() })
      .where(eq(rateLimits.key, key));

    return {
      allowed: true,
      remaining: limit - existing.count - 1,
      retryAfterSeconds: 0,
    };
  } catch {
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

/** Uvoľní počítadlo (napr. po úspešnom prihlásení). */
export async function resetRateLimit(key: string): Promise<void> {
  try {
    const { getDb } = await import(".");
    await getDb().delete(rateLimits).where(eq(rateLimits.key, key));
  } catch {
    // fail-open
  }
}

/** Občasné upratanie starých okien, aby tabuľka nerástla donekonečna. */
export async function pruneRateLimits(olderThanSeconds = 86_400): Promise<void> {
  try {
    const cutoff = Math.floor(Date.now() / 1000) - olderThanSeconds;
    const { getDb } = await import(".");
    await getDb().delete(rateLimits).where(lt(rateLimits.windowStart, cutoff));
  } catch {
    // fail-open
  }
}
