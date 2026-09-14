import { getAdminUser } from "@/app/chatgpt-auth";
import { listPartnerInquiries } from "@/db/partners";
import { buildCsv, csvResponse } from "@/lib/csv";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const rows = await listPartnerInquiries();
  const header = [
    "ID",
    "Vytvorené",
    "Stav",
    "Firma",
    "Kontaktná osoba",
    "Funkcia",
    "E-mail",
    "Telefón",
    "Úroveň záujmu",
    "Rozpočtové pásmo",
    "Súhlas (čas)",
    "Správa",
  ];
  const body = rows.map((row) => [
    row.id,
    row.createdAt,
    row.status,
    row.company,
    row.contactName,
    row.role,
    row.email,
    row.phone,
    row.interestLevel,
    row.budgetBand,
    row.consentAt,
    row.message,
  ]);

  return csvResponse(buildCsv(header, body), "tt27-partneri.csv");
}
