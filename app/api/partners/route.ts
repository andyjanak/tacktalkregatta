import { createPartnerInquiry } from "@/db/partners";
import { clientIp, verifyTurnstile } from "@/lib/request-security";
import { consumeRateLimit } from "@/db/rate-limit";
import {
  getEmailConfigurationStatus,
  sendApplicantConfirmation,
  sendInquiryNotification,
  type ApplicantEmailStrings,
} from "@/lib/email";

const MAX_PER_IP = 5;
const WINDOW_SECONDS = 10 * 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    if (cleanText(payload.website, 200)) {
      return Response.json({ ok: true }, { status: 202 });
    }

    const ip = clientIp(request);
    const limit = await consumeRateLimit(`partner:ip:${ip}`, MAX_PER_IP, WINDOW_SECONDS);
    if (!limit.allowed) {
      return Response.json(
        { error: "Priveľa pokusov. Skúste to prosím o chvíľu znova." },
        { status: 429 },
      );
    }

    const turnstileToken = cleanText(payload.turnstileToken, 4000) || null;
    if (!(await verifyTurnstile(turnstileToken, ip))) {
      return Response.json(
        { error: "Overenie, že nie ste robot, zlyhalo. Skúste to prosím znova." },
        { status: 400 },
      );
    }

    const company = cleanText(payload.company, 160);
    const contactName = cleanText(payload.contactName, 120);
    const role = cleanText(payload.role, 120);
    const email = cleanText(payload.email, 200).toLowerCase();
    const phone = cleanText(payload.phone, 60);
    const interestLevel = cleanText(payload.interestLevel, 120);
    const budgetBand = cleanText(payload.budgetBand, 60);
    const message = cleanText(payload.message, 1500);
    const consent = payload.consent === true;

    if (!company || !contactName || !EMAIL_PATTERN.test(email)) {
      return Response.json(
        { error: "Vyplňte firmu, kontaktnú osobu a platný e-mail." },
        { status: 400 },
      );
    }
    if (!consent) {
      return Response.json(
        { error: "Na odoslanie potrebujeme súhlas s kontaktovaním." },
        { status: 400 },
      );
    }

    await createPartnerInquiry({
      company,
      contactName,
      role,
      email,
      phone: phone || null,
      interestLevel,
      budgetBand,
      message,
    });

    // Interná notifikácia (dormant bez Resend kľúčov). Partnerské detaily
    // pribalíme do správy — samostatný label "Nový partnerský dopyt".
    if (getEmailConfigurationStatus().configured) {
      const composed = [
        role ? `Funkcia: ${role}` : "",
        interestLevel ? `Úroveň záujmu: ${interestLevel}` : "",
        budgetBand ? `Rozpočet: ${budgetBand}` : "",
        message ? `Poznámka: ${message}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      try {
        await sendInquiryNotification({
          fullName: contactName,
          company,
          email,
          phone: phone || null,
          peopleCount: null,
          boatInterest: "undecided",
          message: composed,
          kind: "partner",
        });
      } catch (err) {
        console.error("Partner notification failed", err);
      }

      // Potvrdenie žiadateľovi (lokalizované z formulára). Dormant bez kľúčov.
      const rawStrings = (payload.emailStrings ?? {}) as Record<string, unknown>;
      const strings: ApplicantEmailStrings = {
        subject: cleanText(rawStrings.subject, 200) || "Ďakujeme za váš záujem o partnerstvo — Tack & Talk Regatta 2027",
        heading: cleanText(rawStrings.heading, 200),
        intro: cleanText(rawStrings.intro, 600),
        nextTitle: cleanText(rawStrings.nextTitle, 120),
        nextBody: cleanText(rawStrings.nextBody, 600),
        footer: cleanText(rawStrings.footer, 200),
      };
      if (strings.heading && strings.intro) {
        try {
          await sendApplicantConfirmation({ to: email, strings });
        } catch (confirmError) {
          console.error("Partner confirmation failed", confirmError);
        }
      }
    }

    return Response.json(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to create partner inquiry", error);
    return Response.json(
      { error: "Dopyt sa nepodarilo uložiť. Skúste to znova alebo nám napíšte." },
      { status: 500 },
    );
  }
}
