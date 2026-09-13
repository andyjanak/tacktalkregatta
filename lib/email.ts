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

// Interní príjemcovia notifikácie o novom leade. Partnerské a účastnícke
// dopyty sa neskôr rozlíšia tagom/subjectom, príjemcovia ostávajú títo.
const LEAD_NOTIFY_RECIPIENTS = ["janak@ajservices.sk", "hrivnak@tangreto.com"];

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
        AJservices, s.r.o. · Tack &amp; Talk Regatta 2027<br>
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
  const replyTo = runtimeValue("EMAIL_REPLY_TO") || "info@tacktalkregatta.com";

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

// ---------------------------------------------------------------------------
// Notifikácia o novom leade z formulára. Branded HTML (dizajn manuál), posiela
// sa interným príjemcom. Dormant: bez RESEND_API_KEY/EMAIL_FROM vráti skipped
// a formulár funguje ďalej. Volajúci ju spúšťa v try/catch, nezhodí odoslanie.
// ---------------------------------------------------------------------------
export type InquiryNotification = {
  fullName: string;
  company: string;
  email: string;
  phone: string | null;
  peopleCount: number | null;
  boatInterest: "dufour_460" | "dufour_470" | "undecided";
  message: string;
  kind?: "participant" | "partner" | "reservation";
};

function boatLabel(value: InquiryNotification["boatInterest"]) {
  if (value === "dufour_460") return "Dufour 460";
  if (value === "dufour_470") return "Dufour 470";
  return "Zatiaľ nerozhodnuté";
}

export async function sendInquiryNotification(inquiry: InquiryNotification) {
  const apiKey = runtimeValue("RESEND_API_KEY");
  const from = runtimeValue("EMAIL_FROM");
  if (!apiKey || !from) return { skipped: true as const };

  const e = escapeHtml;
  const label =
    inquiry.kind === "partner"
      ? "Nový partnerský dopyt"
      : inquiry.kind === "reservation"
        ? "Nová rezervácia"
        : "Nový záujemca";
  const adminUrl = "https://tacktalkregatta.com/admin";

  const detailRow = (name: string, value: string) =>
    value
      ? `<tr><td style="padding:6px 0;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#5A6472;width:150px;vertical-align:top">${e(name)}</td><td style="padding:6px 0;font-size:14px;color:#0F2034;vertical-align:top">${value}</td></tr>`
      : "";

  const rows = [
    detailRow("Firma", e(inquiry.company)),
    detailRow("Meno", e(inquiry.fullName)),
    detailRow("E-mail", `<a href="mailto:${e(inquiry.email)}" style="color:#0B2545">${e(inquiry.email)}</a>`),
    detailRow("Telefón", inquiry.phone ? e(inquiry.phone) : ""),
    detailRow("Počet osôb", inquiry.peopleCount ? String(inquiry.peopleCount) : ""),
    detailRow("Preferovaná loď", e(boatLabel(inquiry.boatInterest))),
    detailRow("Správa", inquiry.message ? e(inquiry.message).replaceAll("\n", "<br>") : ""),
  ].join("");

  const html = `<!doctype html>
<html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#F6F2E9;font-family:'Poppins',Arial,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden">${e(label)}: ${e(inquiry.company)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F2E9">
    <tr><td align="center" style="padding:28px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#fff;border:1px solid #D8DEE6;border-radius:16px;overflow:hidden">
        <tr><td style="background:#0B2545;padding:24px 30px;font-size:19px;font-weight:700;color:#fff">TACK <span style="color:#C08A2E">&amp;</span> TALK</td></tr>
        <tr><td style="padding:30px 30px 4px">
          <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#C08A2E">${e(label)}</p>
          <h1 style="margin:0;font-size:22px;font-weight:600;color:#0F2034">${e(inquiry.company)}</h1>
        </td></tr>
        <tr><td style="padding:18px 30px 6px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F2E9;border:1px solid #D8DEE6;border-radius:12px">
            <tr><td style="padding:8px 20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 30px 30px">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#C08A2E;border-radius:8px">
            <a href="${adminUrl}" style="display:inline-block;padding:13px 24px;font-size:13px;font-weight:600;color:#0B2545;text-decoration:none">Otvoriť v administrácii →</a>
          </td></tr></table>
          <p style="margin:12px 0 0;font-size:12px;color:#5A6472">Odpovedať môžeš priamo na <a href="mailto:${e(inquiry.email)}" style="color:#0B2545">${e(inquiry.email)}</a>.</p>
        </td></tr>
        <tr><td style="background:#0B2545;padding:18px 30px;font-size:12px;color:#8ea1b6">Tack <span style="color:#C08A2E">&amp;</span> Talk Regatta 2027 · 25.&nbsp;–&nbsp;30.&nbsp;9.&nbsp;2027 · Rogoznica · info@tacktalkregatta.com</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = `${label}: ${inquiry.company}\n\nMeno: ${inquiry.fullName}\nE-mail: ${inquiry.email}\nTelefón: ${inquiry.phone || "-"}\nPočet osôb: ${inquiry.peopleCount ?? "-"}\nPreferovaná loď: ${boatLabel(inquiry.boatInterest)}\nSpráva: ${inquiry.message || "-"}\n\nAdministrácia: ${adminUrl}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: LEAD_NOTIFY_RECIPIENTS,
      reply_to: inquiry.email,
      subject: `${label} — ${inquiry.company}`,
      text,
      html,
    }),
  });

  const result = (await response.json()) as ResendResponse;
  if (!response.ok || !result.id) {
    throw new Error(result.error?.message || result.message || "Poskytovateľ e-mail odmietol.");
  }
  return { providerMessageId: result.id };
}

// ---------------------------------------------------------------------------
// Potvrdenie rezervácie žiadateľovi. Lokalizované — texty prídu z i18n (klient
// ich posiela), server ich escapuje a vloží do brandovanej šablóny; poradové
// číslo generuje server. Dormant bez kľúčov.
// ---------------------------------------------------------------------------
export type ReservationEmailStrings = {
  subject: string;
  heading: string;
  intro: string;
  numberLabel: string;
  nextTitle: string;
  nextBody: string;
  footer: string;
};

export async function sendReservationConfirmation(input: {
  to: string;
  queueNumber: number;
  strings: ReservationEmailStrings;
}) {
  const apiKey = runtimeValue("RESEND_API_KEY");
  const from = runtimeValue("EMAIL_FROM");
  if (!apiKey || !from) return { skipped: true as const };

  const e = escapeHtml;
  const s = input.strings;
  const num = `#${String(input.queueNumber).padStart(3, "0")}`;

  const html = `<!doctype html>
<html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#F6F2E9;font-family:'Poppins',Arial,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden">${e(s.intro)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F2E9">
    <tr><td align="center" style="padding:28px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#fff;border:1px solid #D8DEE6;border-radius:16px;overflow:hidden">
        <tr><td style="background:#0B2545;padding:24px 30px;font-size:19px;font-weight:700;color:#fff">TACK <span style="color:#C08A2E">&amp;</span> TALK</td></tr>
        <tr><td style="padding:32px 30px 8px">
          <h1 style="margin:0 0 12px;font-size:23px;font-weight:600;color:#0F2034">${e(s.heading)}</h1>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#5A6472">${e(s.intro)}</p>
        </td></tr>
        <tr><td style="padding:18px 30px 6px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F2E9;border:1px solid #D8DEE6;border-radius:12px">
            <tr><td style="padding:20px;text-align:center">
              <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#5A6472">${e(s.numberLabel)}</div>
              <div style="font-size:38px;font-weight:700;color:#C08A2E;line-height:1.1;margin-top:4px">${e(num)}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:16px 30px 30px">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#C08A2E">${e(s.nextTitle)}</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#0F2034">${e(s.nextBody)}</p>
        </td></tr>
        <tr><td style="background:#0B2545;padding:18px 30px;font-size:12px;color:#8ea1b6">${e(s.footer)} · info@tacktalkregatta.com</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = `${s.heading}\n\n${s.intro}\n\n${s.numberLabel}: ${num}\n\n${s.nextTitle}\n${s.nextBody}\n\n${s.footer}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.to],
      reply_to: "info@tacktalkregatta.com",
      subject: s.subject,
      text,
      html,
    }),
  });

  const result = (await response.json()) as ResendResponse;
  if (!response.ok || !result.id) {
    throw new Error(result.error?.message || result.message || "Poskytovateľ e-mail odmietol.");
  }
  return { providerMessageId: result.id };
}
