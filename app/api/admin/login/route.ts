import {
  adminSessionCookie,
  createAdminSessionToken,
  verifyAdminCredentials,
} from "@/lib/admin-credentials";
import { clientIp, hasSameOrigin, verifyTurnstile } from "@/lib/request-security";
import { consumeRateLimit, resetRateLimit } from "@/db/rate-limit";

const MAX_ATTEMPTS_PER_IP = 10;
const MAX_ATTEMPTS_PER_EMAIL = 6;
const WINDOW_SECONDS = 15 * 60;

function safeReturnTo(value: FormDataEntryValue | null) {
  return value === "/admin" ? "/admin" : "/admin";
}

function loginFailure(request: Request, returnTo: string, error: string) {
  const failure = new URL("/admin/login", request.url);
  failure.searchParams.set("error", error);
  failure.searchParams.set("return_to", returnTo);
  return Response.redirect(failure, 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const returnTo = safeReturnTo(form.get("returnTo"));

  // Obrana proti CSRF: POST musí prísť z rovnakého pôvodu.
  if (!hasSameOrigin(request)) {
    return new Response("Prístup zamietnutý.", { status: 403 });
  }

  const email = String(form.get("email") ?? "").slice(0, 200).trim().toLowerCase();
  const password = String(form.get("password") ?? "").slice(0, 512);
  const turnstileToken = String(form.get("cf-turnstile-response") ?? "") || null;
  const ip = clientIp(request);

  // Rate-limit podľa IP aj podľa e-mailu (obrana proti brute-force).
  const ipLimit = await consumeRateLimit(`login:ip:${ip}`, MAX_ATTEMPTS_PER_IP, WINDOW_SECONDS);
  const emailLimit = email
    ? await consumeRateLimit(`login:email:${email}`, MAX_ATTEMPTS_PER_EMAIL, WINDOW_SECONDS)
    : { allowed: true };
  if (!ipLimit.allowed || !emailLimit.allowed) {
    return loginFailure(request, returnTo, "throttled");
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return loginFailure(request, returnTo, "captcha");
  }

  let user;
  try {
    user = await verifyAdminCredentials(email, password);
  } catch (error) {
    console.error("Admin login storage failed", error);
    return loginFailure(request, returnTo, "system");
  }

  if (!user) {
    return loginFailure(request, returnTo, "1");
  }

  // Úspech → uvoľni počítadlá pre tento účet.
  await resetRateLimit(`login:email:${email}`);
  await resetRateLimit(`login:ip:${ip}`);

  const token = await createAdminSessionToken(user);
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(returnTo, request.url).toString(),
      "Set-Cookie": adminSessionCookie(token),
      "Cache-Control": "no-store",
    },
  });
}
