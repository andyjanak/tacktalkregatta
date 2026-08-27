import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

function page(title: string, message: string, ok: boolean) {
  return new Response(
    `<!doctype html>
<html lang="sk">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${title}</title>
<style>
  body{margin:0;font-family:Poppins,Arial,sans-serif;background:#F6F2E9;color:#0B2545;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
  .card{background:#fff;max-width:460px;padding:40px 32px;border:1px solid #D8DEE6;border-radius:14px;text-align:center}
  h1{font-size:22px;margin:0 0 12px}
  p{color:#5A6472;line-height:1.6;margin:0 0 20px}
  a{color:#C08A2E;font-weight:600;text-decoration:none}
  .mark{font-size:34px;margin-bottom:8px}
</style>
</head>
<body><div class="card">
  <div class="mark">${ok ? "✓" : "✕"}</div>
  <h1>${title}</h1>
  <p>${message}</p>
  <a href="/">← Späť na web</a>
</div></body></html>`,
    {
      status: ok ? 200 : 400,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    },
  );
}

async function processToken(token: string | null): Promise<boolean> {
  if (!token) return false;
  try {
    const payload = await verifyUnsubscribeToken(token);
    if (!payload) return false;
    const { optOutInquiryByEmail } = await import("@/db/inquiries");
    return await optOutInquiryByEmail(payload.id, payload.email);
  } catch (error) {
    console.error("Unsubscribe failed", error);
    return false;
  }
}

// Kliknutie človeka na odkaz v e-maile.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const done = await processToken(token);
  return done
    ? page(
        "Odhlásené",
        "Z hromadných e-mailov o podujatí Tack &amp; Talk Regatta 2027 vás už nebudeme kontaktovať.",
        true,
      )
    : page(
        "Odkaz je neplatný",
        "Tento odhlasovací odkaz je neplatný alebo poškodený. Ak chcete zastaviť e-maily, odpovedzte na ktorýkoľvek náš e-mail slovom ODHLÁSIŤ.",
        false,
      );
}

// RFC 8058 one-click: poskytovateľ (Gmail, Outlook…) pošle POST automaticky.
export async function POST(request: Request) {
  const url = new URL(request.url);
  let token = url.searchParams.get("token");
  if (!token) {
    try {
      const form = await request.formData();
      token = String(form.get("token") ?? "") || null;
    } catch {
      token = null;
    }
  }
  const done = await processToken(token);
  return Response.json({ ok: done }, { status: done ? 200 : 400 });
}
