#!/usr/bin/env node
// Vygeneruje PBKDF2 záznam pre ADMIN_CREDENTIALS_JSON a (voliteľne) tajné kľúče.
//
// Použitie:
//   node scripts/hash-admin-password.mjs "janak@ajservices.sk" "Andrej Janák"
//   node scripts/hash-admin-password.mjs --secrets
//
// Heslo sa NEZADÁVA v argumente (ostalo by v histórii shellu) — skript oň
// požiada interaktívne a znak po znaku ho neukazuje. Formát hashu sa musí
// zhodovať s lib/admin-credentials.ts (PBKDF2-SHA256, 100 000 iterácií,
// 16-bajtová soľ, 32-bajtový výstup, base64url bez zarovnania).

import { pbkdf2Sync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

const ITERATIONS = 100_000;

function base64url(buffer) {
  return buffer
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function isStrongPassword(value) {
  return (
    value.length >= 12 &&
    value.length <= 128 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: stdin, output: stdout, terminal: true });
    const onData = (char) => {
      const str = char.toString("utf8");
      if (str === "\n" || str === "\r" || str === "") return;
      stdout.write("[2K[200D" + question + "*".repeat(rl.line.length));
    };
    stdin.on("data", onData);
    rl.question(question, (answer) => {
      stdin.off("data", onData);
      stdout.write("\n");
      rl.close();
      resolve(answer);
    });
  });
}

function printSecrets() {
  const sessionSecret = base64url(randomBytes(48));
  const linkSecret = base64url(randomBytes(48));
  console.log("\nVygenerované tajné kľúče (nastav cez `wrangler secret put`):\n");
  console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
  console.log(`ADMIN_RESET_SECRET=${linkSecret}`);
  console.log(`UNSUBSCRIBE_SECRET=${base64url(randomBytes(48))}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--secrets")) {
    printSecrets();
    return;
  }

  const email = (args[0] ?? "").trim().toLowerCase();
  const displayName = (args[1] ?? "").trim();
  if (!email || !displayName) {
    console.error(
      'Použitie: node scripts/hash-admin-password.mjs "email" "Zobrazené meno"\n' +
        "         node scripts/hash-admin-password.mjs --secrets",
    );
    process.exit(1);
  }

  const password = await askHidden("Nové heslo (min. 12 znakov, veľké+malé+číslo+znak): ");
  const confirm = await askHidden("Zopakuj heslo: ");
  if (password !== confirm) {
    console.error("Heslá sa nezhodujú.");
    process.exit(1);
  }
  if (!isStrongPassword(password)) {
    console.error(
      "Heslo je slabé: potrebných je 12–128 znakov, malé aj veľké písmeno, číslo a špeciálny znak.",
    );
    process.exit(1);
  }

  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password.slice(0, 512), salt, ITERATIONS, 32, "sha256");
  const record = {
    email,
    displayName,
    salt: base64url(salt),
    hash: base64url(hash),
    iterations: ITERATIONS,
  };

  console.log("\nZáznam pridaj do poľa ADMIN_CREDENTIALS_JSON (je to JSON pole):\n");
  console.log(JSON.stringify([record], null, 2));
  console.log(
    "\nCelú premennú nastav cez:\n  wrangler secret put ADMIN_CREDENTIALS_JSON\n" +
      "a vlož jednoriadkovú podobu:\n",
  );
  console.log(JSON.stringify([record]));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
