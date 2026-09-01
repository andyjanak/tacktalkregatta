/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

// Obsahová bezpečnostná politika. Povolené výnimky:
// - player.vimeo.com: pozadové video v hero sekcii,
// - challenges.cloudflare.com: widget Cloudflare Turnstile (login + formulár),
// - *.cloudflareinsights.com: Cloudflare Web Analytics (bez cookies) – beacon
//   sa vkladá automaticky na edge, preto musí prejsť cez CSP.
// Inline skripty/štýly generuje vinext (RSC bootstrap), preto 'unsafe-inline'.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src https://player.vimeo.com https://challenges.cloudflare.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join("; ");

function withSecurityHeaders(response: Response, isHttps: boolean): Response {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  if (isHttps) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Podporované jazyky webu (slovenčina je na "/", ostatné pod "/<locale>").
const LOCALES = new Set(["sk", "en", "cs", "de", "hu", "hr", "pl"]);

// Staré (nelokalizované) slugy počasia → lokalizované. 301 zachová SEO.
// SK "/pocasie" ostáva, preto v mape nie je.
const OLD_WEATHER_REDIRECTS: Record<string, string> = {
  "/en/pocasie": "/en/weather",
  "/cs/pocasie": "/cs/pocasi",
  "/de/pocasie": "/de/wetter",
  "/hu/pocasie": "/hu/idojaras",
  "/hr/pocasie": "/hr/vrijeme",
  "/pl/pocasie": "/pl/pogoda",
};

// Jazyk podľa krajiny návštevníka (Cloudflare hlavička CF-IPCountry).
// Ostatné krajiny dostanú angličtinu.
const LOCALE_BY_COUNTRY: Record<string, string> = {
  SK: "sk",
  CZ: "cs",
  DE: "de",
  AT: "de",
  HU: "hu",
  HR: "hr",
  PL: "pl",
};

function localeForCountry(country: string | null): string {
  if (!country) return "sk";
  return LOCALE_BY_COUNTRY[country.toUpperCase()] ?? "en";
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return value.join("=");
  }
  return null;
}

// Vyhľadávacie a náhľadové roboty nepresmerúvame — nech vidia všetky jazykové
// verzie (indexovanie prebieha cez hreflang, nie cez presmerovanie podľa IP).
const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|slackbot|discordbot|embedly|preview|pinterest|google-inspectiontool|lighthouse/i;

function isBot(ua: string | null): boolean {
  return ua ? BOT_UA.test(ua) : false;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const isHttps = url.protocol === "https:";

    // Prepínač jazykov: ?lang=xx uloží voľbu do cookie a presmeruje na čistú
    // URL. Cieľ je aktuálna cesta (odkaz už smeruje na lokalizovaný slug danej
    // stránky), takže prepnutie jazyka zachová stránku, neskočí na titulku.
    const setLang = url.searchParams.get("lang");
    if (setLang && LOCALES.has(setLang)) {
      const dest = url.pathname || "/";
      return new Response(null, {
        status: 302,
        headers: {
          Location: new URL(dest, url).toString(),
          "Set-Cookie": `tt_lang=${setLang}; Path=/; Max-Age=31536000; SameSite=Lax`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Automatický jazyk na koreňovom "/": uložená voľba má prednosť, inak podľa
    // krajiny IP. Roboty ani explicitne zvolený jazyk nepresmerúvame.
    // RSC/prefetch requesty (klientská navigácia v rámci appky) nepresmerúvame
    // — inak by klik na odkaz na "/" (napr. „Web" v admine) skončil 302-kou na
    // /xx, ktorú klientský router nevie nasledovať, a „nič sa nestane".
    const isRscRequest =
      request.headers.get("RSC") === "1" ||
      request.headers.has("Next-Router-Prefetch");
    if (
      url.pathname === "/" &&
      !isRscRequest &&
      !isBot(request.headers.get("user-agent"))
    ) {
      const pref = readCookie(request.headers.get("cookie"), "tt_lang");
      const chosen =
        pref && LOCALES.has(pref)
          ? pref
          : localeForCountry(request.headers.get("CF-IPCountry"));
      if (chosen !== "sk") {
        return new Response(null, {
          status: 302,
          headers: {
            Location: new URL(`/${chosen}`, url).toString(),
            "Cache-Control": "no-store",
            Vary: "Cookie",
          },
        });
      }
    }

    if (url.pathname === "/plan-pretekov" || url.pathname === "/plan-pretekov.html") {
      return Response.redirect(new URL("/#trasa", request.url), 308);
    }

    // 301 zo starých nelokalizovaných slugov počasia na lokalizované.
    const oldWeather = OLD_WEATHER_REDIRECTS[url.pathname];
    if (oldWeather) {
      return Response.redirect(new URL(oldWeather, url).toString(), 301);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const response = await handler.fetch(request, env, ctx);
    return withSecurityHeaders(response, isHttps);
  },

  // Cron: pravidelný refresh predpovede počasia po waypointoch. Mesačný beh
  // (1. deň o 03:00) prepočíta aj klimatológiu z historického archívu.
  // Službu importujeme dynamicky, aby sa DB/env nezaťahovali pri načítaní.
  async scheduled(
    event: { cron?: string },
    _env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    const cron = event.cron ?? "";
    ctx.waitUntil(
      (async () => {
        const {
          refreshAllForecasts,
          computeAllClimatology,
          climatologyYears,
          bootstrapClimatologyIfEmpty,
        } = await import("../lib/weather/service");
        const year = new Date().getFullYear();
        await refreshAllForecasts();
        if (cron.startsWith("0 3 1 ")) {
          // Mesačný beh: kompletný prepočet klimatológie.
          await computeAllClimatology(climatologyYears(year, 10));
        } else {
          // Pravidelný beh: dopočíta klimatológiu, ak ešte chýba (bootstrap).
          await bootstrapClimatologyIfEmpty(year);
        }
      })(),
    );
  },
};

export default worker;
