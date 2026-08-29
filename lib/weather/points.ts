// Waypointy trasy regaty pre modul počasia. Súradnice sú orientačné
// (rovnaké ako v data/regatta.json) — určené na plánovanie, nie na navigáciu.
export type WeatherPoint = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  // Poradie na trase (0 = základňa/štart).
  order: number;
  legLabelKey: string; // kľúč do i18n slovníka (deň/etapa)
};

export const WEATHER_POINTS: WeatherPoint[] = [
  { id: "rogoznica", name: "Rogoznica", lat: 43.52985, lon: 15.96286, order: 0, legLabelKey: "base" },
  { id: "tribunj", name: "Tribunj", lat: 43.75825, lon: 15.74257, order: 1, legLabelKey: "day1" },
  { id: "jezera", name: "Jezera", lat: 43.78705, lon: 15.64413, order: 2, legLabelKey: "day2" },
  { id: "zlarin", name: "Zlarin", lat: 43.69653, lon: 15.83536, order: 3, legLabelKey: "day3" },
];

export function getPoint(id: string): WeatherPoint | undefined {
  return WEATHER_POINTS.find((p) => p.id === id);
}

// Časové okno regaty v roku pre klimatológiu (koniec septembra, 25.–30. 9.).
export const CLIMATOLOGY_WINDOW = {
  label: "sep-23-30",
  // Deň v roku (mesiac/deň) — inkluzívne.
  startMonth: 9,
  startDay: 23,
  endMonth: 9,
  endDay: 30,
} as const;
