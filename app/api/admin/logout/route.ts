import { clearAdminSessionCookie } from "@/lib/admin-credentials";

export async function GET(request: Request) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/admin/login", request.url).toString(),
      "Set-Cookie": clearAdminSessionCookie(),
      "Cache-Control": "no-store",
    },
  });
}
