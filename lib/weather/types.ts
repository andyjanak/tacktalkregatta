// Normalizované typy pre modul počasia (nezávislé od poskytovateľa dát).

export type WeatherHour = {
  t: string; // ISO lokálny čas (Europe/Zagreb)
  windKn: number; // rýchlosť vetra v uzloch
  gustKn: number; // nárazy v uzloch
  dirDeg: number; // smer, ODKIAĽ vietor fúka (0–360)
  tempC: number | null;
  pressureHpa: number | null;
  precipMm: number | null;
  waveM: number | null; // výška vĺn (m)
  wavePeriodS: number | null;
  waveDirDeg: number | null;
};

export type WeatherDay = {
  date: string; // YYYY-MM-DD
  windMaxKn: number;
  gustMaxKn: number;
  dirDominantDeg: number;
  tempMaxC: number | null;
  tempMinC: number | null;
};

export type PointForecast = {
  pointId: string;
  provider: string;
  updatedAt: string;
  hours: WeatherHour[];
  days: WeatherDay[];
};

// Osempočetné smerové kódy (jazykovo neutrálne, prekladajú sa v UI).
export type CompassCode =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW";

// Kategória bezpečnosti odvodená od pravidiel regaty (>25 uzlov ruší etapu).
export type SafetyLevel = "ok" | "caution" | "danger";

export type WindRoseBin = {
  dir: CompassCode;
  // Frekvencia (0–1) v jednotlivých pásmach rýchlosti + celkovo.
  calm: number;
  light: number; // < 11 kn
  moderate: number; // 11–21 kn
  strong: number; // 22–33 kn
  gale: number; // > 33 kn
  total: number;
};

export type ClimatologyStats = {
  pointId: string;
  windowLabel: string;
  years: string;
  samples: number;
  windRose: WindRoseBin[];
  prevailingDir: CompassCode;
  windMeanKn: number;
  windMedianKn: number;
  windP90Kn: number; // 90. percentil rýchlosti
  gustP90Kn: number;
  tempMeanC: number | null;
  // Podiel popoludní (0–1) s termickým SZ vetrom (maestral).
  maestralShare: number;
  // Podiel hodín (0–1) nad prahom 25 uzlov (nárazy) — riziko zrušenia etapy.
  overThresholdShare: number;
};

export type ForecastSummary = {
  pointId: string;
  updatedAt: string;
  nowWindKn: number | null;
  nowGustKn: number | null;
  nowDir: CompassCode | null;
  nowDirDeg: number | null;
  nowBeaufort: number | null;
  nowSafety: SafetyLevel | null;
  // Denné skóre okna na plavbu (0–100) pre najbližšie dni.
  daySailingScores: { date: string; score: number; safety: SafetyLevel }[];
};
