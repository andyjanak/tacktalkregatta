export const ADMIN_COOKIE_NAME = "tt27_admin_session";
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;
export const ADMIN_PASSWORD_ITERATIONS = 100_000;

type CredentialRecord = {
  email: string;
  displayName: string;
  salt: string;
  hash: string;
  iterations: number;
};

export type PasswordAdminUser = {
  email: string;
  displayName: string;
};

type SessionPayload = PasswordAdminUser & {
  exp: number;
};

function runtimeValue(key: string) {
  return process.env[key] || "";
}

function credentials() {
  const raw = runtimeValue("ADMIN_CREDENTIALS_JSON");
  if (!raw || raw.length > 20_000) return [];
  try {
    const parsed = JSON.parse(raw) as CredentialRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function decodeBase64Url(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function encodeBase64Url(value: Uint8Array) {
  return btoa(String.fromCharCode(...value))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function safeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left[index] ^ right[index];
  }
  return result === 0;
}

async function passwordHash(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

export async function verifyAdminCredentials(
  rawEmail: string,
  password: string,
): Promise<PasswordAdminUser | null> {
  const email = rawEmail.trim().toLowerCase();
  const records = credentials();
  const record = records.find((item) => item.email.toLowerCase() === email);
  const fallbackSalt = new Uint8Array(16);
  const salt = record ? decodeBase64Url(record.salt) : fallbackSalt;
  const iterations = record?.iterations || ADMIN_PASSWORD_ITERATIONS;
  if (iterations < 10_000 || iterations > ADMIN_PASSWORD_ITERATIONS) return null;
  const actual = await passwordHash(password.slice(0, 512), salt, iterations);
  const expected = record ? decodeBase64Url(record.hash) : new Uint8Array(32);

  if (!record || !safeEqual(actual, expected)) return null;
  return { email: record.email.toLowerCase(), displayName: record.displayName };
}

async function sign(value: string) {
  const secret = runtimeValue("ADMIN_SESSION_SECRET");
  if (secret.length < 32) throw new Error("Admin session secret is not configured.");
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

export async function createAdminSessionToken(user: PasswordAdminUser) {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
  };
  const encoded = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = encodeBase64Url(await sign(encoded));
  return `${encoded}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string,
): Promise<PasswordAdminUser | null> {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || token.length > 4096) return null;

  const expected = await sign(encoded);
  const actual = decodeBase64Url(signature);
  if (!safeEqual(actual, expected)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encoded))) as SessionPayload;
  } catch {
    return null;
  }
  if (!payload.email || !payload.displayName || payload.exp <= Date.now() / 1000) {
    return null;
  }

  const active = credentials().some(
    (item) => item.email.toLowerCase() === payload.email.toLowerCase(),
  );
  return active
    ? { email: payload.email.toLowerCase(), displayName: payload.displayName }
    : null;
}

export function adminSessionCookie(token: string) {
  return `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ADMIN_SESSION_SECONDS}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
