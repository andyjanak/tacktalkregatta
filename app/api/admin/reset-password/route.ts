import { createResetToken } from "@/lib/admin-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import { siteBaseUrl } from "@/lib/unsubscribe";
import { clientIp, hasSameOrigin } from "@/lib/request-security";
import { consumeRateLimit } from "@/db/rate-limit";

const MAX_REQUESTS_PER_IP = 5;
const MAX_REQUESTS_PER_EMAIL = 3;
const WINDOW_SECONDS = 15 * 60;

function redirect(request: Request, query: string) {
  return Response.redirect(
    new URL(`/admin/reset-password?${query}`, request.url),
    303,
  );
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return new Response("Prístup zamietnutý.", { status: 403 });
  }

  const form = await request.formData();
  const email = String(form.get("email") ?? "").slice(0, 200).trim().toLowerCase();
  const ip = clientIp(request);

  const ipLimit = await consumeRateLimit(`reset:ip:${ip}`, MAX_REQUESTS_PER_IP, WINDOW_SECONDS);
  const emailLimit = email
    ? await consumeRateLimit(`reset:email:${email}`, MAX_REQUESTS_PER_EMAIL, WINDOW_SECONDS)
    : { allowed: true };
  if (!ipLimit.allowed || !emailLimit.allowed) {
    return redirect(request, "error=throttled");
  }

  // Neodhaľujeme, či účet existuje: vždy rovnaká odpoveď.
  try {
    const token = await createResetToken(email);
    if (token) {
      const url = `${siteBaseUrl()}/admin/reset-password/confirm?token=${encodeURIComponent(token)}`;
      await sendPasswordResetEmail(email, url);
    }
  } catch (error) {
    console.error("Password reset request failed", error);
    return redirect(request, "error=system");
  }

  return redirect(request, "sent=1");
}
