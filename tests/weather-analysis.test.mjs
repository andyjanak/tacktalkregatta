import assert from "node:assert/strict";
import test from "node:test";

// Node 24 vie natívne stripovať typy z .ts (analysis.ts má len type-only importy).
const {
  toCompass,
  toBeaufort,
  safetyForGust,
  sailingScore,
  buildWindRose,
  computeClimatology,
  isMaestralHour,
  GUST_DANGER_KN,
} = await import("../lib/weather/analysis.ts");

test("toCompass mapuje stupne na 8 sektorov", () => {
  assert.equal(toCompass(0), "N");
  assert.equal(toCompass(45), "NE");
  assert.equal(toCompass(90), "E");
  assert.equal(toCompass(180), "S");
  assert.equal(toCompass(315), "NW");
  assert.equal(toCompass(360), "N");
  assert.equal(toCompass(-45), "NW"); // normalizácia záporných
});

test("toBeaufort zaraďuje rýchlosti do stupňov", () => {
  assert.equal(toBeaufort(0), 0);
  assert.equal(toBeaufort(2), 1);
  assert.equal(toBeaufort(12), 4);
  assert.equal(toBeaufort(30), 7);
  assert.equal(toBeaufort(100), 12);
});

test("safetyForGust rešpektuje prahy pravidiel regaty (25 uzlov)", () => {
  assert.equal(safetyForGust(10), "ok");
  assert.equal(safetyForGust(GUST_DANGER_KN - 6), "ok");
  assert.equal(safetyForGust(20), "caution");
  assert.equal(safetyForGust(24), "caution");
  assert.equal(safetyForGust(26), "danger");
});

test("sailingScore uprednostňuje stredný vietor a trestá nebezpečný", () => {
  const ideal = sailingScore([hour({ windKn: 10, gustKn: 12 })]);
  const calm = sailingScore([hour({ windKn: 1, gustKn: 2 })]);
  const dangerous = sailingScore([hour({ windKn: 30, gustKn: 40 })]);
  assert.ok(ideal > 90, `ideál ${ideal}`);
  assert.ok(calm < ideal, `bezvetrie ${calm} < ideál`);
  assert.ok(dangerous < 40, `nebezpečný ${dangerous}`);
  assert.equal(sailingScore([]), 0);
});

test("buildWindRose normalizuje na podiely so súčtom ~1", () => {
  const hours = [
    hour({ dirDeg: 0, windKn: 5 }),
    hour({ dirDeg: 90, windKn: 15 }),
    hour({ dirDeg: 90, windKn: 25 }),
    hour({ dirDeg: 315, windKn: 0 }),
  ];
  const rose = buildWindRose(hours);
  assert.equal(rose.length, 8);
  const totalSum = rose.reduce((s, b) => s + b.total, 0);
  assert.ok(Math.abs(totalSum - 1) < 1e-9, `súčet ${totalSum}`);
  const east = rose.find((b) => b.dir === "E");
  assert.ok(east.moderate > 0 && east.strong > 0);
});

test("isMaestralHour deteguje popoludňajší SZ termický vietor", () => {
  assert.equal(isMaestralHour(hour({ t: "2027-09-25T15:00", dirDeg: 300, windKn: 12 })), true);
  assert.equal(isMaestralHour(hour({ t: "2027-09-25T09:00", dirDeg: 300, windKn: 12 })), false); // ráno
  assert.equal(isMaestralHour(hour({ t: "2027-09-25T15:00", dirDeg: 90, windKn: 12 })), false); // zlý smer
  assert.equal(isMaestralHour(hour({ t: "2027-09-25T15:00", dirDeg: 300, windKn: 4 })), false); // slabý
});

test("computeClimatology vráti konzistentné štatistiky", () => {
  const hours = [];
  for (let d = 0; d < 8; d++) {
    for (let h = 0; h < 24; h++) {
      const afternoon = h >= 12 && h <= 19;
      hours.push(
        hour({
          t: `2024-09-2${d}T${String(h).padStart(2, "0")}:00`,
          dirDeg: afternoon ? 300 : 90,
          windKn: afternoon ? 12 : 6,
          gustKn: afternoon ? 16 : 8,
          tempC: 22,
        }),
      );
    }
  }
  const stats = computeClimatology("rogoznica", "sep-23-30", "2024-2024", hours);
  assert.equal(stats.samples, 192);
  assert.ok(stats.windMeanKn > 6 && stats.windMeanKn < 12);
  assert.ok(stats.maestralShare > 0.5, `maestral ${stats.maestralShare}`);
  assert.equal(stats.tempMeanC, 22);
  assert.ok(["W", "NW", "E"].includes(stats.prevailingDir));
});

function hour(overrides) {
  return {
    t: "2027-09-25T12:00",
    windKn: 0,
    gustKn: 0,
    dirDeg: 0,
    tempC: null,
    pressureHpa: null,
    precipMm: null,
    waveM: null,
    wavePeriodS: null,
    waveDirDeg: null,
    ...overrides,
  };
}
