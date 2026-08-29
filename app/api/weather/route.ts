import { getWeatherPayload } from "@/lib/weather/service";

// Verejné počasie po waypointoch trasy. Číta najnovšie snapshoty + klimatológiu
// z D1. Cachuje sa na edge (dáta sa menia najviac raz za pár hodín).
export async function GET() {
  try {
    const payload = await getWeatherPayload();
    return Response.json(payload, {
      headers: {
        "Cache-Control": "public, max-age=600, s-maxage=1800",
      },
    });
  } catch {
    return Response.json(
      { updatedAt: null, window: null, points: [] },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
}
