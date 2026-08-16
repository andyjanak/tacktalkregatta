import { getAdminUser } from "@/app/chatgpt-auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const company = cleanText(payload.company, 160);
  const fullName = cleanText(payload.fullName, 120);
  const email = cleanText(payload.email, 200).toLowerCase();
  const phone = cleanText(payload.phone, 60);
  const businessFocus = cleanText(payload.businessFocus, 240);
  const annualTurnover = cleanText(payload.annualTurnover, 120);

  if (!company || !fullName || !EMAIL_PATTERN.test(email)) {
    return Response.json(
      { error: "Vyplňte firmu, meno a platný e-mail." },
      { status: 400 },
    );
  }

  try {
    const { createInquiry, getInquiryWithActivities } = await import("@/db/inquiries");
    const row = await createInquiry({
      company,
      fullName,
      email,
      phone: phone || null,
      businessFocus,
      annualTurnover,
      captainLicense: "unknown",
      boatInterest: "undecided",
      source: "manual",
      actorEmail: user.email,
    });
    const inquiry = await getInquiryWithActivities(row.id);
    return Response.json(
      { inquiry },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to create manual customer", error);
    return Response.json(
      { error: "Zákazníka sa nepodarilo uložiť." },
      { status: 500 },
    );
  }
}
