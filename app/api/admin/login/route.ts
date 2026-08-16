import {
  adminSessionCookie,
  createAdminSessionToken,
  verifyAdminCredentials,
} from "@/lib/admin-credentials";

function safeReturnTo(value: FormDataEntryValue | null) {
  return value === "/admin" ? "/admin" : "/admin";
}

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 512);
  const returnTo = safeReturnTo(form.get("returnTo"));
  let user;
  try {
    user = await verifyAdminCredentials(email, password);
  } catch (error) {
    console.error("Admin login storage failed", error);
    const failure = new URL("/admin/login", request.url);
    failure.searchParams.set("error", "system");
    failure.searchParams.set("return_to", returnTo);
    return Response.redirect(failure, 303);
  }

  if (!user) {
    const failure = new URL("/admin/login", request.url);
    failure.searchParams.set("error", "1");
    failure.searchParams.set("return_to", returnTo);
    return Response.redirect(failure, 303);
  }

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
