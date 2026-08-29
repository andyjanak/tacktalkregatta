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
//   { "job": "all" }          → klimatológia aj predpoveď (predvolené)
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { job?: string };
  const job =
    body.job === "climatology" || body.job === "forecast" ? body.job : "all";
  const year = new Date().getFullYear();

  try {
    if (job === "climatology") {
      const climatology = await computeAllClimatology(climatologyYears(year, 10));
      return Response.json({ job, climatology });
    }
    if (job === "forecast") {
      const forecast = await refreshAllForecasts();
      return Response.json({ job, forecast });
    }
    // "all": najprv klimatológia (historický archív), potom predpoveď.
    const climatology = await computeAllClimatology(climatologyYears(year, 10));
    const forecast = await refreshAllForecasts();
    return Response.json({ job, climatology, forecast });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Chyba úlohy." },
      { status: 500 },
    );
  }
}
