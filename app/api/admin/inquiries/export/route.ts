import { getAdminUser } from "@/app/chatgpt-auth";
import { listInquiries } from "@/db/inquiries";

function csvCell(value: unknown) {
  const text = String(value ?? "").replaceAll('"', '""');
  return `"${text}"`;
}

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const rows = await listInquiries();
  const header = [
    "ID",
    "Vytvorené",
    "Stav",
    "Priorita",
    "Meno",
    "Firma",
    "E-mail",
    "Telefón",
    "Počet ľudí",
    "Kapitánsky preukaz",
    "Priradené",
    "Správa",
  ];
  const body = rows.map((row) => [
    row.id,
    row.createdAt,
    row.status,
    row.priority,
    row.fullName,
    row.company,
    row.email,
    row.phone,
    row.peopleCount,
    row.captainLicense,
    row.assignedTo,
    row.message,
  ]);
  const csv = [header, ...body]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=tt27-dopyty.csv",
      "Cache-Control": "no-store",
    },
  });
}
