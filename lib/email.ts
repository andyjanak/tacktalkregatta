import { env } from "cloudflare:workers";

type Recipient = {
  id: number;
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
  const runtime = env as unknown as Record<string, string | undefined>;
  return runtime[key] || process.env[key] || "";
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

function renderEmailHtml(content: CampaignContent, recipient: Recipient) {
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
        Tento e-mail súvisí s vaším záujmom o pripravované podujatie. Ak ďalšie e-maily nechcete, odpovedzte slovom ODHLÁSIŤ.
      </footer>
    </main>
  </body>
</html>`;
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
  const text = personalize(input.campaign.body, input.recipient);
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
      html: renderEmailHtml(input.campaign, input.recipient),
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
