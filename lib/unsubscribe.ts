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
  const secret = runtimeValue("UNSUBSCRIBE_SECRET");
  if (secret.length < 32) {
    throw new Error("UNSUBSCRIBE_SECRET nie je nastavený.");
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

export function siteBaseUrl() {
  const raw =
    runtimeValue("SITE_URL") ||
    runtimeValue("NEXT_PUBLIC_SITE_URL") ||
    "https://tacktalkregatta.com";
  return raw.replace(/\/$/, "");
}

export async function createUnsubscribeToken(inquiryId: number, email: string) {
  const payload = { id: inquiryId, email: email.trim().toLowerCase() };
  const encoded = encodeBase64Url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const signature = encodeBase64Url(await sign(encoded));
  return `${encoded}.${signature}`;
}

export async function unsubscribeUrl(inquiryId: number, email: string) {
  const token = await createUnsubscribeToken(inquiryId, email);
  return `${siteBaseUrl()}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}

export async function verifyUnsubscribeToken(
  token: string,
): Promise<{ id: number; email: string } | null> {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || token.length > 2048) return null;

  const expected = await sign(encoded);
  const actual = decodeBase64Url(signature);
  if (!safeEqual(actual, expected)) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encoded)),
    ) as { id?: number; email?: string };
    if (typeof payload.id !== "number" || typeof payload.email !== "string") {
      return null;
    }
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}
