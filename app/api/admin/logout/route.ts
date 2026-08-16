import { clearAdminSessionCookie } from "@/lib/admin-credentials";

export async function GET(request: Request) {
  const response = Response.redirect(new URL("/admin/login", request.url), 303);
  response.headers.set("Set-Cookie", clearAdminSessionCookie());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
