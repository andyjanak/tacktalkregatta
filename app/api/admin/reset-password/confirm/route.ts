import {
  adminSessionCookie,
  createAdminSessionToken,
  resetAdminPassword,
} from "@/lib/admin-credentials";
import { verifyResetToken } from "@/lib/admin-reset";
import { clientIp, hasSameOrigin } from "@/lib/request-security";
import { consumeRateLimit } from "@/db/rate-limit";

const MAX_ATTEMPTS_PER_IP = 10;
const WINDOW_SECONDS = 15 * 60;

function isStrongPassword(value: string) {
  return (
    value.length >= 12 &&
    value.length <= 128 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

function redirectConfirm(request: Request, token: string, error: string) {
  const target = new URL("/admin/reset-password/confirm", request.url);
  if (error !== "invalid") target.searchParams.set("token", token);
  target.searchParams.set("error", error);
  return Response.redirect(target, 303);
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return new Response("Prístup zamietnutý.", { status: 403 });
  }

  const ip = clientIp(request);
  const ipLimit = await consumeRateLimit(`reset-confirm:ip:${ip}`, MAX_ATTEMPTS_PER_IP, WINDOW_SECONDS);
  if (!ipLimit.allowed) {
    return redirectConfirm(request, "", "invalid");
  }

  const form = await request.formData();
  const token = String(form.get("token") ?? "").slice(0, 4096);
  const password = String(form.get("password") ?? "").slice(0, 512);
  const confirmation = String(form.get("confirmation") ?? "").slice(0, 512);

  const email = await verifyResetToken(token);
  if (!email) {
    return redirectConfirm(request, "", "invalid");
  }
  if (password !== confirmation) {
    return redirectConfirm(request, token, "mismatch");
  }
  if (!isStrongPassword(password)) {
    return redirectConfirm(request, token, "weak");
  }

  try {
    const user = await resetAdminPassword(email, password);
    if (!user) {
      return redirectConfirm(request, token, "invalid");
    }
    const session = await createAdminSessionToken(user);
    return new Response(null, {
      status: 303,
      headers: {
        Location: new URL("/admin", request.url).toString(),
        "Set-Cookie": adminSessionCookie(session),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Password reset confirm failed", error);
    return redirectConfirm(request, token, "storage");
  }
}
