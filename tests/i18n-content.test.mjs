import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// Kontrola zakázaných slov v jazykových slovníkoch (právna poistka podľa
// zadania, časť 3 + terminológia časť 6). Skenuje sa verejný obsah —
// slovníky app/i18n/*.ts. Nájdený výskyt = zlyhanie buildu.
//
// Slová sú stopky (matchujú aj skloňované tvary) a matchujú sa na hranici
// slova, takže napr. nemecké „Anreise" (príchod) NEspustí zákaz „Reise".

const ROOT = new URL("../app/i18n/", import.meta.url);

// Spoločné pre všetky jazyky.
const COMMON = ["all-?inclusive"];

// Per-jazyk zakázané výrazy (stopky). Dôvod je právny (zákon o zájazdoch),
// nie štylistický.
const FORBIDDEN = {
  sk: ["zájazd", "pobyt", "dovolenka", "plachtárs"], // plachtárs = terminológia (pravidlo 6)
  cs: ["zájezd", "dovolen[áé]", "plachtářs"],
  en: ["package holiday", "vacation"],
  de: ["Reise", "Pauschalreise", "Urlaub"],
  pl: ["wycieczk", "wakacj"],
  hu: ["utazás", "nyaralás"],
  hr: ["putovanj", "odmor"],
};

function scan(lang) {
  const text = readFileSync(new URL(`${lang}.ts`, ROOT), "utf8");
  const words = [...COMMON, ...(FORBIDDEN[lang] ?? [])];
  const hits = [];
  for (const w of words) {
    // Hranica slova pred výrazom zabráni zásahom vnútri slova (napr. Anreise).
    const re = new RegExp(`\\b${w}\\w*`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      hits.push(m[0]);
    }
  }
  return hits;
}

for (const lang of ["sk", "cs", "en", "de", "pl", "hu", "hr"]) {
  test(`i18n ${lang}: žiadne zakázané slová`, () => {
    const hits = scan(lang);
    assert.deepEqual(
      hits,
      [],
      `V app/i18n/${lang}.ts sa našli zakázané výrazy: ${hits.join(", ")}`,
    );
  });
}
