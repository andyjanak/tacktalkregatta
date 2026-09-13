import { createReservation, type ReservationBoat } from "@/db/reservations";
import { clientIp, verifyTurnstile } from "@/lib/request-security";
import { consumeRateLimit } from "@/db/rate-limit";
import {
  getEmailConfigurationStatus,
  sendInquiryNotification,
  sendReservationConfirmation,
  type ReservationEmailStrings,
} from "@/lib/email";

const MAX_PER_IP = 5;
const WINDOW_SECONDS = 10 * 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BOAT_VALUES = new Set<ReservationBoat>([
  "dufour_460",
  "dufour_470",
  "undecided",
]);

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    // Honeypot.
    if (cleanText(payload.website, 200)) {
      return Response.json({ ok: true, queueNumber: null }, { status: 202 });
    }

    const ip = clientIp(request);
    const limit = await consumeRateLimit(`reservation:ip:${ip}`, MAX_PER_IP, WINDOW_SECONDS);
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
    const email = cleanText(payload.email, 200).toLowerCase();
    const phone = cleanText(payload.phone, 60);
    const message = cleanText(payload.message, 1500);
    const boatPreference = cleanText(payload.boatPreference, 30) as ReservationBoat;
    const consent = payload.consent === true;
    const rawPeople = Number(payload.peopleCount);
    const peopleCount =
      Number.isInteger(rawPeople) && rawPeople >= 1 && rawPeople <= 50
        ? rawPeople
        : null;

    if (!company || !contactName || !EMAIL_PATTERN.test(email)) {
      return Response.json(
        { error: "Vyplňte firmu, kontaktnú osobu a platný e-mail." },
        { status: 400 },
      );
    }
    if (!BOAT_VALUES.has(boatPreference)) {
      return Response.json(
        { error: "Vyberte preferovaný typ lode." },
        { status: 400 },
      );
    }
    if (!consent) {
      return Response.json(
        { error: "Na odoslanie potrebujeme súhlas s kontaktovaním." },
        { status: 400 },
      );
    }

    const queueNumber = await createReservation({
      company,
      contactName,
      email,
      phone: phone || null,
      boatPreference,
      peopleCount,
      message,
    });

    // E-maily (dormant bez Resend kľúčov; chyba nikdy nezhodí rezerváciu).
    if (getEmailConfigurationStatus().configured) {
      const rawStrings = (payload.emailStrings ?? {}) as Record<string, unknown>;
      const strings: ReservationEmailStrings = {
        subject: cleanText(rawStrings.subject, 200) || "Rezervácia prijatá — Tack & Talk Regatta 2027",
        heading: cleanText(rawStrings.heading, 200),
        intro: cleanText(rawStrings.intro, 600),
        numberLabel: cleanText(rawStrings.numberLabel, 120),
        nextTitle: cleanText(rawStrings.nextTitle, 120),
        nextBody: cleanText(rawStrings.nextBody, 600),
        footer: cleanText(rawStrings.footer, 200),
      };
      try {
        await sendReservationConfirmation({ to: email, queueNumber, strings });
      } catch (err) {
        console.error("Reservation confirmation failed", err);
      }
      try {
        await sendInquiryNotification({
          fullName: contactName,
          company,
          email,
          phone: phone || null,
          peopleCount,
          boatInterest: boatPreference,
          message,
          kind: "reservation",
        });
      } catch (err) {
        console.error("Reservation internal notification failed", err);
      }
    }

    return Response.json(
      { ok: true, queueNumber },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to create reservation", error);
    return Response.json(
      { error: "Rezerváciu sa nepodarilo uložiť. Skúste to znova alebo nám napíšte." },
      { status: 500 },
    );
  }
}
