import { getAdminUser } from "@/app/chatgpt-auth";
import {
  climatologyYears,
  computeAllClimatology,
  refreshAllForecasts,
} from "@/lib/weather/service";

// Manuálne spustenie úloh počasia (chránené admin prihlásením). Slúži na
// naplnenie dát hneď po nasadení, bez čakania na cron.
//   { "job": "forecast" }     → stiahne čerstvú predpoveď pre všetky body
//   { "job": "climatology" }  → prepočíta klimatológiu z historického archívu
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { job?: string };
  const job = body.job === "climatology" ? "climatology" : "forecast";

  try {
    if (job === "climatology") {
      const year = new Date().getFullYear();
      const result = await computeAllClimatology(climatologyYears(year, 20));
      return Response.json({ job, ...result });
    }
    const result = await refreshAllForecasts();
    return Response.json({ job, ...result });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Chyba úlohy." },
      { status: 500 },
    );
  }
}
