import assert from "node:assert/strict";
import { createHmac, pbkdf2Sync } from "node:crypto";
import test from "node:test";

const TEST_ADMIN_EMAIL = "admin@example.test";
const TEST_ADMIN_NAME = "Test Admin";
const TEST_ADMIN_PASSWORD = "test-password-not-used-in-production";
const TEST_ADMIN_SECRET = "test-session-secret-that-is-longer-than-thirty-two-characters";
const TEST_ADMIN_SALT = Buffer.alloc(16, 7);

process.env.ADMIN_CREDENTIALS_JSON = JSON.stringify([{
  email: TEST_ADMIN_EMAIL,
  displayName: TEST_ADMIN_NAME,
  salt: TEST_ADMIN_SALT.toString("base64url"),
  hash: pbkdf2Sync(TEST_ADMIN_PASSWORD, TEST_ADMIN_SALT, 100_000, 32, "sha256").toString("base64url"),
  iterations: 100_000,
}]);
process.env.ADMIN_SESSION_SECRET = TEST_ADMIN_SECRET;
process.env.ADMIN_RECOVERY_IDENTITIES_JSON = JSON.stringify([{
  identityEmail: "owner@example.test",
  adminEmails: [TEST_ADMIN_EMAIL],
}]);

function testAdminCookie() {
  const payload = Buffer.from(JSON.stringify({
    email: TEST_ADMIN_EMAIL,
    displayName: TEST_ADMIN_NAME,
    credentialVersion: "env",
    exp: Math.floor(Date.now() / 1000) + 3600,
  })).toString("base64url");
  const signature = createHmac("sha256", TEST_ADMIN_SECRET)
    .update(payload)
    .digest("base64url");
  return `tt27_admin_session=${payload}.${signature}`;
}

async function render(path = "/", headers = {}, options = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", host: "localhost", ...headers },
      ...options,
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
  assert.match(html, /info@tacktalkregatta\.com/i);
  assert.match(html, /Chcem vedieť viac/i);
  assert.match(html, /Meno a priezvisko/i);
  assert.match(html, /Nejde o registráciu ani rezerváciu miesta/i);
  assert.match(html, /player\.vimeo\.com\/video\/229143837/i);
  assert.match(html, /aria-label="Mobilná navigácia"/i);
  assert.match(html, /href="#trasa"/i);
  assert.match(html, /href="\/admin"[^>]*>Admin/i);
  assert.match(html, /Päť bodov.*Štyri dni/is);
  assert.match(html, /Štyri dni.*Deväť rozjázd/is);
  assert.match(html, /Schematická interaktívna mapa trasy/i);
  assert.match(html, /Vyber deň programu/i);
  assert.match(html, /presný denný rozpis R1–R9/i);
  assert.match(html, /Rogoznica/i);
  assert.match(html, /Tribunj.*Jezera.*Zlarin/is);
  // Ceny sú zámerne stiahnuté z webu (uložené v regatta.json), zverejnia sa 15. 10. 2026.
  assert.match(html, /Ceny lodí zverejníme 15\. 10\. 2026/i);
  assert.doesNotMatch(html, /8\s*700\s*€/i);
  assert.doesNotMatch(html, /9\s*500\s*€/i);
  assert.match(html, /Hlavný organizátor/i);
  assert.match(html, /Spoluorganizátor: Tangreto, s\.r\.o\./i);
  // Followed odkaz na organizátora (bez nofollow) + prepojenie entity cez @id.
  assert.match(html, /href="https:\/\/www\.ajservices\.sk\/"/i);
  assert.match(html, /Kto to organizuje/i);
  assert.match(html, /"@id":"https:\/\/www\.ajservices\.sk\/#organization"/);
  // FAQ štruktúrované dáta pre slovenský trh (rich snippets).
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /firemná regata v Chorvátsku/i);
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
    /^\/admin\/login\?return_to=%2Fadmin$/,
  );
});

test("admin login page renders the credential form", async () => {
  const response = await render("/admin/login");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Prihlásenie do administrácie/i);
  assert.match(html, /action="\/api\/admin\/login"/i);
  assert.match(html, /autocomplete="username"/i);
  assert.match(html, /autocomplete="current-password"/i);
  assert.match(html, /Zabudol som heslo/i);
});

test("password recovery page requests the account e-mail", async () => {
  const response = await render("/admin/reset-password");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Obnova hesla/i);
  assert.match(html, /action="\/api\/admin\/reset-password"/i);
  assert.match(html, /Poslať odkaz na obnovu/i);
});

test("password reset rejects a request without same-origin proof", async () => {
  const response = await render(
    "/api/admin/reset-password",
    {
      "content-type": "application/x-www-form-urlencoded",
      "oai-authenticated-user-id": "owner-1",
      "oai-authenticated-user-email": "owner@example.test",
    },
    { method: "POST", body: new URLSearchParams() },
  );
  assert.equal(response.status, 403);
});

test("valid admin credentials create a protected session", async () => {
  const body = new URLSearchParams({
    email: TEST_ADMIN_EMAIL,
    password: TEST_ADMIN_PASSWORD,
    returnTo: "/admin",
  });
  const response = await render(
    "/api/admin/login",
    {
      "content-type": "application/x-www-form-urlencoded",
      origin: "http://localhost",
    },
    { method: "POST", body },
  );
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "http://localhost/admin");
  assert.match(response.headers.get("set-cookie") ?? "", /tt27_admin_session=.*HttpOnly.*Secure.*SameSite=Lax/i);
});

test("admin login rejects a cross-origin request (CSRF)", async () => {
  const body = new URLSearchParams({
    email: TEST_ADMIN_EMAIL,
    password: TEST_ADMIN_PASSWORD,
    returnTo: "/admin",
  });
  const response = await render(
    "/api/admin/login",
    {
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://evil.example",
    },
    { method: "POST", body },
  );
  assert.equal(response.status, 403);
});

test("responses carry hardening security headers", async () => {
  const response = await render("/admin/login");
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
});

test("allowed admin renders the inquiry workspace", async () => {
  const response = await render("/admin", {
    cookie: testAdminCookie(),
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Regatta CRM/i);
  assert.match(html, /Potenciálni zákazníci a komunikácia/i);
  assert.match(html, /E-mailové kampane/i);
  assert.match(html, /Potenciálni zákazníci/i);
  assert.match(html, /Pridať potenciálneho zákazníka/i);
  assert.match(html, /Firma.*Meno.*E-mail.*Telefón.*Zameranie.*Obrat/is);
  assert.match(html, /Export CSV/i);
  assert.match(html, /Právna forma predaja/i);
});

test("invalid admin session is denied", async () => {
  const response = await render("/admin", {
    cookie: "tt27_admin_session=invalid.invalid",
  });
  assert.ok([302, 303, 307, 308].includes(response.status));
  assert.match(response.headers.get("location") ?? "", /^\/admin\/login/);
});

test("campaign API rejects anonymous access", async () => {
  const response = await render("/api/admin/campaigns");
  assert.equal(response.status, 403);
  const payload = await response.json();
  assert.match(payload.error, /Prístup zamietnutý/i);
});

test("manual customer API rejects anonymous access", async () => {
  const response = await render(
    "/api/admin/inquiries",
    { "content-type": "application/json" },
    { method: "POST", body: JSON.stringify({}) },
  );
  assert.equal(response.status, 403);
});

test("old race plan URLs redirect to the integrated route", async () => {
  for (const path of ["/plan-pretekov", "/plan-pretekov.html"]) {
    const response = await render(path);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), "http://localhost/#trasa");
  }
});
