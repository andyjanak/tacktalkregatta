import { unsubscribeUrl } from "./unsubscribe";

type Recipient = {
  id: number;
  inquiryId: number;
  email: string;
  fullName: string;
  company: string;
};

type CampaignContent = {
  id: number;
  subject: string;
  previewText: string;
  body: string;
};

type ResendResponse = {
  id?: string;
  message?: string;
  error?: { message?: string };
};

function runtimeValue(key: string) {
  return process.env[key] || "";
}

export function getEmailConfigurationStatus() {
  const apiKey = runtimeValue("RESEND_API_KEY");
  const from = runtimeValue("EMAIL_FROM");
  return {
    configured: Boolean(apiKey && from),
    from: from || null,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function personalize(value: string, recipient: Recipient) {
  const firstName = recipient.fullName.trim().split(/\s+/)[0] || recipient.fullName;
  return value
    .replaceAll("{{meno}}", recipient.fullName)
    .replaceAll("{{krstne_meno}}", firstName)
    .replaceAll("{{firma}}", recipient.company);
}

function renderEmailHtml(content: CampaignContent, recipient: Recipient, unsubUrl: string) {
  const body = personalize(content.body, recipient);
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 18px;line-height:1.7">${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");

  return `<!doctype html>
<html lang="sk">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;background:#F6F2E9;color:#0B2545;font-family:Arial,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(content.previewText)}</div>
    <main style="max-width:640px;margin:0 auto;padding:32px 18px">
      <header style="padding:26px 30px;background:#0B2545;color:#fff;font-weight:700;letter-spacing:.04em">
        TACK <span style="color:#C08A2E">&amp;</span> TALK <span style="color:#9AABBC;font-weight:400">2027</span>
      </header>
      <section style="padding:34px 30px;background:#fff;font-size:15px">
        ${paragraphs}
      </section>
      <footer style="padding:22px 30px;color:#5A6472;font-size:11px;line-height:1.6">
        Tangreto s.r.o. · Tack &amp; Talk Regatta 2027<br>
        Tento e-mail súvisí s vaším záujmom o pripravované podujatie.
        Ak ďalšie e-maily nechcete, <a href="${unsubUrl}" style="color:#5A6472">kliknutím sa odhláste</a>.
      </footer>
    </main>
  </body>
</html>`;
}

/** Transakčný e-mail s odkazom na obnovu admin hesla. */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = runtimeValue("RESEND_API_KEY");
  const from = runtimeValue("EMAIL_FROM");
  if (!apiKey || !from) {
    throw new Error("Odosielanie e-mailov ešte nie je nakonfigurované.");
  }

  const safeUrl = escapeHtml(resetUrl);
  const html = `<!doctype html>
<html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#F6F2E9;color:#0B2545;font-family:Arial,sans-serif">
  <main style="max-width:520px;margin:0 auto;padding:32px 18px">
    <header style="padding:22px 26px;background:#0B2545;color:#fff;font-weight:700">
      TACK <span style="color:#C08A2E">&amp;</span> TALK <span style="color:#9AABBC;font-weight:400">2027</span>
    </header>
    <section style="padding:30px 26px;background:#fff;font-size:15px;line-height:1.7">
      <p style="margin:0 0 18px">Dostali sme žiadosť o obnovu hesla do administrácie.</p>
      <p style="margin:0 0 22px"><a href="${safeUrl}" style="display:inline-block;background:#C08A2E;color:#0B2545;font-weight:700;padding:12px 22px;border-radius:8px;text-decoration:none">Nastaviť nové heslo</a></p>
      <p style="margin:0 0 10px;color:#5A6472;font-size:13px">Odkaz platí 30 minút a dá sa použiť raz. Ak ste žiadosť neposlali vy, tento e-mail ignorujte — heslo sa nezmení.</p>
    </section>
  </main>
</body></html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Obnova hesla — Tack & Talk Regatta 2027",
      text: `Obnova hesla do administrácie.\n\nNastavte nové heslo (odkaz platí 30 minút): ${resetUrl}\n\nAk ste o obnovu nežiadali, e-mail ignorujte.`,
      html,
    }),
  });

  const result = (await response.json()) as ResendResponse;
  if (!response.ok || !result.id) {
    throw new Error(
      result.error?.message || result.message || "Poskytovateľ e-mail odmietol.",
    );
  }
  return { providerMessageId: result.id };
}

export async function sendCampaignEmail(input: {
  campaign: CampaignContent;
  recipient: Recipient;
}) {
  const apiKey = runtimeValue("RESEND_API_KEY");
  const from = runtimeValue("EMAIL_FROM");
  const replyTo = runtimeValue("EMAIL_REPLY_TO") || "info@tangreto.com";

  if (!apiKey || !from) {
    throw new Error("Odosielanie e-mailov ešte nie je nakonfigurované.");
  }

  const subject = personalize(input.campaign.subject, input.recipient);
  const unsubUrl = await unsubscribeUrl(
    input.recipient.inquiryId,
    input.recipient.email,
  );
  const text = `${personalize(input.campaign.body, input.recipient)}\n\n—\nOdhlásiť sa z ďalších e-mailov: ${unsubUrl}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `tt27-campaign-${input.campaign.id}-recipient-${input.recipient.id}`,
    },
    body: JSON.stringify({
      from,
      to: [input.recipient.email],
      reply_to: replyTo,
      subject,
      text,
      html: renderEmailHtml(input.campaign, input.recipient, unsubUrl),
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });

  const result = (await response.json()) as ResendResponse;
  if (!response.ok || !result.id) {
    throw new Error(
      result.error?.message || result.message || "Poskytovateľ e-mail odmietol.",
    );
  }

  return { providerMessageId: result.id };
}
