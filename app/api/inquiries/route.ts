import { createInquiry, type CaptainLicense } from "@/db/inquiries";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LICENSE_VALUES = new Set<CaptainLicense>(["yes", "no", "unknown"]);

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    // Honeypot. Bots receive a neutral response without creating a record.
    if (cleanText(payload.website, 200)) {
      return Response.json({ ok: true }, { status: 202 });
    }

    const fullName = cleanText(payload.fullName, 120);
    const company = cleanText(payload.company, 160);
    const email = cleanText(payload.email, 200).toLowerCase();
    const phone = cleanText(payload.phone, 60);
    const message = cleanText(payload.message, 1500);
    const captainLicense = cleanText(payload.captainLicense, 20) as CaptainLicense;
    const consent = payload.consent === true;
    const rawPeopleCount = Number(payload.peopleCount);
    const peopleCount = Number.isInteger(rawPeopleCount)
      && rawPeopleCount >= 1
      && rawPeopleCount <= 50
      ? rawPeopleCount
      : null;

    if (!fullName || !company || !EMAIL_PATTERN.test(email)) {
      return Response.json(
        { error: "Vyplňte meno, firmu a platný e-mail." },
        { status: 400 },
      );
    }

    if (!LICENSE_VALUES.has(captainLicense)) {
      return Response.json(
        { error: "Vyberte odpoveď o kapitánskom preukaze." },
        { status: 400 },
      );
    }

    if (!consent) {
      return Response.json(
        { error: "Na odoslanie potrebujeme súhlas s kontaktovaním." },
        { status: 400 },
      );
    }

    await createInquiry({
      fullName,
      company,
      email,
      phone: phone || null,
      peopleCount,
      captainLicense,
      message,
      source: "website",
    });

    return Response.json(
      {
        ok: true,
        message: "Ďakujeme. Dopyt sme prijali a ozveme sa vám.",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to create inquiry", error);
    return Response.json(
      { error: "Dopyt sa nepodarilo uložiť. Skúste to znova alebo nám napíšte." },
      { status: 500 },
    );
  }
}
