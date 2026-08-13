import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(html, /Prevetraj svoj biznis/i);
  assert.match(html, /Ešte nezaväzuje/i);
  assert.match(html, /Bezpečnosť má prednosť pred súťažou/i);
  assert.match(html, /Pod záštitou Michala Hrivnáka/i);
  assert.match(html, /Pre tímy, ktoré spolu rozhodujú/i);
  assert.match(html, /Dve platby/i);
  assert.match(html, /Časté otázky/i);
  assert.match(html, /info@tangreto\.com/i);
  assert.match(html, /Chcem vedieť viac/i);
  assert.match(html, /Meno a priezvisko/i);
  assert.match(html, /Nejde o registráciu ani rezerváciu miesta/i);
  assert.match(html, /player\.vimeo\.com\/video\/229143837/i);
  assert.match(html, /aria-label="Mobilná navigácia"/i);
  assert.match(html, /href="#program"/i);
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

test("standalone race plan contains the complete interactive specification", async () => {
  const plan = await readFile(
    new URL("../public/plan-pretekov.html", import.meta.url),
    "utf8",
  );

  assert.match(plan, /Marina Frapa/i);
  assert.match(plan, /Rogoznica.*Tribunj.*Vodice.*Zlarin/is);
  assert.match(plan, /Dufour 460/i);
  assert.match(plan, /Dufour 470 GL/i);
  assert.match(plan, /R7/i);
  assert.match(plan, /NEŠKRTÁ SA/i);
  assert.match(plan, /Bezpečnostné odstúpenie/i);
  assert.match(plan, /Nie je navigačným podkladom/i);
  assert.match(plan, /data-key="arrival"/i);
  assert.match(plan, /data-key="day4"/i);
  assert.match(plan, /const days =/i);
  assert.match(plan, /setInterval\(updateCountdown/i);
  assert.match(plan, /class="section-nav"/i);
  assert.match(plan, /id="page-progress"/i);
  assert.match(plan, /href="#trasa"/i);
  assert.doesNotMatch(plan, /localStorage|sessionStorage/i);
  assert.doesNotMatch(plan, /<script[^>]+src=/i);

  const ids = [...plan.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, "standalone page IDs must be unique");
});

test("clean race plan URL is routed to the standalone page", async () => {
  const worker = await readFile(
    new URL("../worker/index.ts", import.meta.url),
    "utf8",
  );

  assert.match(worker, /url\.pathname === "\/plan-pretekov"/);
  assert.match(worker, /new URL\("\/plan-pretekov\.html", request\.url\)/);
});
