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
  assert.match(html, /Prevetraj svoj biznis/i);
  assert.match(html, /Registráciu ešte nie/i);
  assert.match(html, /Bezpečnosť má prednosť pred súťažou/i);
  assert.match(html, /Pod záštitou Michala Hrivnáka/i);
  assert.match(html, /player\.vimeo\.com\/video\/229143837/i);
  assert.match(html, /aria-label="Mobilná navigácia"/i);
  assert.match(html, /href="#program"/i);
  assert.match(html, /property="og:image"/i);
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

test("authenticated admin renders the launch gates", async () => {
  const response = await render("/admin", {
    "oai-authenticated-user-id": "test-user",
    "oai-authenticated-user-email": "admin@example.com",
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Príprava TT27/i);
  assert.match(html, /Registrácia/i);
  assert.match(html, /Zatiaľ uzamknutá/i);
  assert.match(html, /Právna forma predaja/i);
});
