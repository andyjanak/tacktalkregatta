function runtimeValue(key: string) {
  return process.env[key] || "";
}

/**
 * Prísna kontrola pôvodu pre POST z prehliadača (obrana proti CSRF).
 * Vyžaduje hlavičku Origin zhodnú s cieľovým pôvodom. Ak Origin chýba
 * (napr. niektoré staršie klienty), povolí zhodný Referer ako záložnú kontrolu.
 */
export function hasSameOrigin(request: Request): boolean {
  const target = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).origin === target;
    } catch {
      return false;
    }
  }
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === target;
    } catch {
      return false;
    }
  }
  return false;
}

/** IP klienta z Cloudflare hlavičiek, s bezpečným fallbackom. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

/**
 * Overenie Cloudflare Turnstile tokenu. Ak `TURNSTILE_SECRET_KEY` nie je
 * nastavený (lokálny vývoj, ešte nenakonfigurované), overenie sa preskočí.
 */
export async function verifyTurnstile(
  token: string | null,
  ip: string,
): Promise<boolean> {
  const secret = runtimeValue("TURNSTILE_SECRET_KEY");
  if (!secret) return true; // nie je nakonfigurované → nepovinné
  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token, remoteip: ip }),
      },
    );
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

export function isTurnstileConfigured(): boolean {
  return Boolean(runtimeValue("TURNSTILE_SECRET_KEY"));
}
