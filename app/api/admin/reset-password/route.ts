import { getChatGPTUser } from "@/app/chatgpt-auth";
import {
  adminSessionCookie,
  createAdminSessionToken,
  getRecoveryAdminUsers,
  resetAdminPassword,
} from "@/lib/admin-credentials";

function redirectWithError(request: Request, error: string) {
  const target = new URL("/admin/reset-password", request.url);
  target.searchParams.set("error", error);
  return Response.redirect(target, 303);
}

function isStrongPassword(value: string) {
  return value.length >= 12
    && value.length <= 128
    && /[a-z]/.test(value)
    && /[A-Z]/.test(value)
    && /\d/.test(value)
    && /[^A-Za-z0-9]/.test(value);
}

function hasSameOrigin(request: Request) {
  try {
    const origin = request.headers.get("origin");
    return Boolean(origin && new URL(origin).origin === new URL(request.url).origin);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return new Response("Prístup zamietnutý.", { status: 403 });
  }

  const identity = await getChatGPTUser();
  if (!identity) return redirectWithError(request, "denied");

  const allowedTargets = getRecoveryAdminUsers(identity.email);
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const confirmation = String(form.get("confirmation") ?? "");

  if (!allowedTargets.some((target) => target.email === email)) {
    return redirectWithError(request, "denied");
  }
  if (password !== confirmation) return redirectWithError(request, "mismatch");
  if (!isStrongPassword(password)) return redirectWithError(request, "weak");

  try {
    const user = await resetAdminPassword(email, password);
    if (!user) return redirectWithError(request, "denied");

    const token = await createAdminSessionToken(user);
    return new Response(null, {
      status: 303,
      headers: {
        Location: new URL("/admin", request.url).toString(),
        "Set-Cookie": adminSessionCookie(token),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Admin password reset failed", error);
    return redirectWithError(request, "storage");
  }
}
