# Tack & Talk Regatta 2027

Web podujatia a interné CRM pre správu potenciálnych účastníkov. Aplikácia beží
na [vinext](https://github.com/cloudflare/vinext), používa D1 a Drizzle.

## CRM a komunikácia

- `/admin` je chránený panel pre povolených správcov,
- dopyty z verejného formulára sa ukladajú do D1 a podľa e-mailu sa neduplikujú,
- kontakt eviduje stav, prioritu, zodpovednú osobu, preferovanú loď, tagy,
  ďalší krok, poznámky a históriu komunikácie,
- e-mailové kampane sa najskôr ukladajú ako koncepty; odhlásené a uzavreté
  kontakty sa pri odoslaní automaticky vynechajú,
- výsledok každého e-mailu sa uloží ku kampani aj ku kontaktu,
- webhook Resend eviduje doručenie, bounce a spam complaint.

Odosielanie potrebuje tajné premenné `RESEND_API_KEY`, `EMAIL_FROM` a
`RESEND_WEBHOOK_SECRET`. Názvy a bezpečné príklady sú v `.env.example`.

## Prihlásenie do administrácie

Administrácia na `/admin` používa vlastné prihlásenie na `/admin/login`.
Heslá sa v zdrojovom kóde nenachádzajú: hosting uchováva iba PBKDF2 hashe a
samostatný tajný kľúč na podpis osemhodinovej `HttpOnly` relácie. API pod
`/api/admin/*` overuje rovnakú reláciu na serveri. Prihlásenie je chránené
kontrolou pôvodu (CSRF), rate-limitom podľa IP aj e-mailu a voliteľným
Cloudflare Turnstile.

Prvý admin účet vygeneruješ lokálne:

```bash
npm run admin:hash -- "email@firma.sk" "Zobrazené meno"
npm run admin:secrets   # vypíše ADMIN_SESSION_SECRET, ADMIN_RESET_SECRET, UNSUBSCRIBE_SECRET
```

Obnova hesla beží cez **jednorazový e-mailový odkaz** (platí 30 minút a po
použití sa zneplatní), posiela sa cez Resend. Nevyžaduje prihlásenie cez
ChatGPT — pôvodná väzba na `oai-*` hlavičky sa už nepoužíva.

## Nasadenie na vlastný Cloudflare účet

```bash
# 1. Databáza (ID z výstupu vlož do wrangler.cloudflare.jsonc → d1_databases[0].database_id)
wrangler d1 create tacktalkregatta

# 2. Migrácie
npm run db:migrate            # vzdialená D1
# npm run db:migrate:local    # lokálna D1 pre vývoj

# 3. Tajné premenné (hodnoty pozri v .env.example)
wrangler secret put RESEND_API_KEY
wrangler secret put EMAIL_FROM
wrangler secret put RESEND_WEBHOOK_SECRET
wrangler secret put ADMIN_CREDENTIALS_JSON
wrangler secret put ADMIN_SESSION_SECRET
wrangler secret put ADMIN_RESET_SECRET
wrangler secret put UNSUBSCRIBE_SECRET
# voliteľne: TURNSTILE_SECRET_KEY

# 4. Nasadenie
npm run deploy:cloudflare
```

Doména sa pripája ako **Custom Domain** k Workeru (zóna musí byť aktívna na
Cloudflare). Build-time premenné `NEXT_PUBLIC_SITE_URL` a
`NEXT_PUBLIC_ALLOW_INDEXING=true` (spolu s `NEXT_PUBLIC_TURNSTILE_SITE_KEY`)
sa nastavujú pred `npm run build`.

## Zálohovanie databázy

D1 má zabudované **Time Travel** — automatická obnova do ľubovoľného bodu za
posledných 30 dní (`wrangler d1 time-travel restore tacktalkregatta`).
Manuálny export navyše:

```bash
npm run db:backup   # uloží SQL dump do backups/
```

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Email and name are intended for display or contact purposes.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
