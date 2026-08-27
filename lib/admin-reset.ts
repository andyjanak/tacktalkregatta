import { findAdminAccount, getCredentialVersion } from "./admin-credentials";

const RESET_TTL_SECONDS = 30 * 60;

function runtimeValue(key: string) {
  return process.env[key] || "";
}

function encodeBase64Url(value: Uint8Array) {
  return btoa(String.fromCharCode(...value))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64Url(value: string) {
  const padded = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function safeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left[index] ^ right[index];
  }
  return result === 0;
}

async function sign(value: string) {
  const secret = runtimeValue("ADMIN_RESET_SECRET");
  if (secret.length < 32) {
    throw new Error("ADMIN_RESET_SECRET nie je nastavený.");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return new Uint8Array(signature);
}

type ResetPayload = {
  email: string;
  exp: number;
  v: string; // credentialVersion — odkaz zneplatní zmena hesla
};

/**
 * Vytvorí jednorazový, 30-minútový podpísaný odkaz na obnovu hesla.
 * Vracia null, ak e-mail nepatrí známemu adminovi (bez odhalenia navonok).
 */
export async function createResetToken(rawEmail: string): Promise<string | null> {
  const account = findAdminAccount(rawEmail);
  if (!account) return null;

  const payload: ResetPayload = {
    email: account.email,
    exp: Math.floor(Date.now() / 1000) + RESET_TTL_SECONDS,
    v: await getCredentialVersion(account.email),
  };
  const encoded = encodeBase64Url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const signature = encodeBase64Url(await sign(encoded));
  return `${encoded}.${signature}`;
}

/** Overí reset token. Vracia e-mail, ak je platný, nevypršaný a stále aktuálny. */
export async function verifyResetToken(token: string): Promise<string | null> {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || token.length > 4096) return null;

  const expected = await sign(encoded);
  if (!safeEqual(decodeBase64Url(signature), expected)) return null;

  let payload: ResetPayload;
  try {
    payload = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encoded)),
    ) as ResetPayload;
  } catch {
    return null;
  }

  if (!payload.email || payload.exp <= Date.now() / 1000) return null;
  // Odkaz je jednorazový: po zmene hesla sa credentialVersion zmení.
  const currentVersion = await getCredentialVersion(payload.email);
  if (currentVersion !== payload.v) return null;

  return payload.email;
}
