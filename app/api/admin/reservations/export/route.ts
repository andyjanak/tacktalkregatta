import { getAdminUser } from "@/app/chatgpt-auth";
import { listReservations } from "@/db/reservations";
import { buildCsv, csvResponse } from "@/lib/csv";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const rows = await listReservations();
  const header = [
    "Poradové číslo",
    "Vytvorené",
    "Stav",
    "Firma",
    "Kontaktná osoba",
    "E-mail",
    "Telefón",
    "Preferovaná loď",
    "Počet ľudí",
    "Súhlas (čas)",
    "Správa",
  ];
  const body = rows.map((row) => [
    row.id,
    row.createdAt,
    row.status,
    row.company,
    row.contactName,
    row.email,
    row.phone,
    row.boatPreference,
    row.peopleCount,
    row.consentAt,
    row.message,
  ]);

  return csvResponse(buildCsv(header, body), "tt27-rezervacie.csv");
}
