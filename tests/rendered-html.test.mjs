import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/", headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", host: "localhost", ...headers },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server renders the finished Slovak landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="sk"/i);
  assert.match(html, /Tack &amp; Talk Regatta 2027/i);
  assert.match(html, /Svieži vietor.*v.*plachtách/is);
  assert.match(html, /Ešte vás nezaväzuje/i);
  assert.match(html, /Bezpečnosť má prednosť pred súťažou/i);
  assert.match(html, /Pod záštitou Michala Hrivnáka/i);
  assert.match(html, /Pre tímy, ktoré spolu rozhodujú/i);
  assert.match(html, /Dve lode.*Kompletný balík/is);
  assert.match(html, /Časté otázky/i);
  assert.match(html, /info@tangreto\.com/i);
  assert.match(html, /Chcem vedieť viac/i);
  assert.match(html, /Meno a priezvisko/i);
  assert.match(html, /Nejde o registráciu ani rezerváciu miesta/i);
  assert.match(html, /player\.vimeo\.com\/video\/229143837/i);
  assert.match(html, /aria-label="Mobilná navigácia"/i);
  assert.match(html, /href="#trasa"/i);
  assert.match(html, /Päť bodov.*Štyri dni/is);
  assert.match(html, /Štyri dni.*Deväť rozjázd/is);
  assert.match(html, /Schematická interaktívna mapa trasy/i);
  assert.match(html, /Vyber deň programu/i);
  assert.match(html, /presný denný rozpis R1–R9/i);
  assert.match(html, /Rogoznica/i);
  assert.match(html, /Tribunj.*Jezera.*Zlarin/is);
  assert.match(html, /8\s*700\s*€.*bez DPH/is);
  assert.match(html, /9\s*500\s*€.*bez DPH/is);
  assert.match(html, /BALI 5\.2.*celý čas s flotilou/is);
  assert.match(html, /src="\/bali-52-promo\.jpg"/i);
  assert.match(html, /15,9\s*m.*8,15\s*m.*12\s*osôb.*2\s*×\s*80\s*HP/is);
  assert.doesNotMatch(html, /boataround\.com/i);
  assert.doesNotMatch(html, /href="\/plan-pretekov"/i);
  assert.doesNotMatch(html, /Jedna trasa.*Jeden platný program/is);
  assert.doesNotMatch(html, /Sukošan|Vodice|125\s*nm|2\.\s*10\.\s*2027|Prevetraj svoj biznis/i);
  assert.match(html, /Nie je navigačným podkladom/i);
  assert.match(html, /property="og:image"/i);
  assert.doesNotMatch(html, /10\s*400\s*€/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Building your site/i);
});

test("admin requires authenticated identity", async () => {
  const response = await render("/admin");
  assert.ok([302, 303, 307, 308].includes(response.status));
  assert.match(
    response.headers.get("location") ?? "",
    /^\/signin-with-chatgpt\?return_to=%2Fadmin$/,
  );
});

test("allowed admin renders the inquiry workspace", async () => {
  const response = await render("/admin", {
    "oai-authenticated-user-id": "test-user",
    "oai-authenticated-user-email": "hrivnak.michal@gmail.com",
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Obchodný prehľad/i);
  assert.match(html, /Dopyty a požiadavky/i);
  assert.match(html, /Export CSV/i);
  assert.match(html, /Právna forma predaja/i);
});

test("authenticated non-admin is denied", async () => {
  const response = await render("/admin", {
    "oai-authenticated-user-id": "other-user",
    "oai-authenticated-user-email": "other@example.com",
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Nemáte prístup/i);
  assert.doesNotMatch(html, /Export CSV/i);
});

test("old race plan URLs redirect to the integrated route", async () => {
  for (const path of ["/plan-pretekov", "/plan-pretekov.html"]) {
    const response = await render(path);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), "http://localhost/#trasa");
  }
});
