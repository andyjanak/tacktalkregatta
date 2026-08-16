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
  credentialVersion: string;
};

type SessionPayload = PasswordAdminUser & {
  exp: number;
};

type RecoveryIdentity = {
  identityEmail: string;
  adminEmails: string[];
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

function recoveryIdentities() {
  const raw = runtimeValue("ADMIN_RECOVERY_IDENTITIES_JSON");
  if (!raw || raw.length > 20_000) return [];
  try {
    const parsed = JSON.parse(raw) as RecoveryIdentity[];
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

async function passwordOverride(email: string) {
  try {
    const { getAdminPasswordOverride } = await import("@/db/admin-users");
    return await getAdminPasswordOverride(email);
  } catch (error) {
    const code = error instanceof Error
      ? (error as Error & { code?: string }).code
      : undefined;
    const message = error instanceof Error ? error.message : "";
    if (
      code === "ERR_UNSUPPORTED_ESM_URL_SCHEME"
      || message.includes("D1 binding `DB` is unavailable")
    ) {
      return null;
    }
    throw error;
  }
}

async function credentialVersion(email: string) {
  const override = await passwordOverride(email);
  return override ? `db:${override.updatedAt}` : "env";
}

export async function verifyAdminCredentials(
  rawEmail: string,
  password: string,
): Promise<PasswordAdminUser | null> {
  const email = rawEmail.trim().toLowerCase();
  const records = credentials();
  const record = records.find((item) => item.email.toLowerCase() === email);
  const override = record ? await passwordOverride(email) : null;
  const fallbackSalt = new Uint8Array(16);
  const salt = record ? decodeBase64Url(override?.salt ?? record.salt) : fallbackSalt;
  const iterations = override?.iterations ?? record?.iterations ?? ADMIN_PASSWORD_ITERATIONS;
  if (iterations < 10_000 || iterations > ADMIN_PASSWORD_ITERATIONS) return null;
  const actual = await passwordHash(password.slice(0, 512), salt, iterations);
  const expected = record
    ? decodeBase64Url(override?.hash ?? record.hash)
    : new Uint8Array(32);

  if (!record || !safeEqual(actual, expected)) return null;
  return {
    email: record.email.toLowerCase(),
    displayName: record.displayName,
    credentialVersion: override ? `db:${override.updatedAt}` : "env",
  };
}

export function getRecoveryAdminUsers(identityEmail: string) {
  const identity = recoveryIdentities().find(
    (item) => item.identityEmail.toLowerCase() === identityEmail.toLowerCase(),
  );
  if (!identity) return [];

  const allowed = new Set(identity.adminEmails.map((email) => email.toLowerCase()));
  return credentials()
    .filter((record) => allowed.has(record.email.toLowerCase()))
    .map((record) => ({
      email: record.email.toLowerCase(),
      displayName: record.displayName,
    }));
}

export async function resetAdminPassword(email: string, password: string) {
  const record = credentials().find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );
  if (!record) return null;

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await passwordHash(password.slice(0, 512), salt, ADMIN_PASSWORD_ITERATIONS);
  const { saveAdminPasswordOverride } = await import("@/db/admin-users");
  const updatedAt = await saveAdminPasswordOverride({
    email: record.email.toLowerCase(),
    salt: encodeBase64Url(salt),
    hash: encodeBase64Url(hash),
    iterations: ADMIN_PASSWORD_ITERATIONS,
  });

  return {
    email: record.email.toLowerCase(),
    displayName: record.displayName,
    credentialVersion: `db:${updatedAt}`,
  };
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
  if (!active || !payload.credentialVersion) return null;
  const currentVersion = await credentialVersion(payload.email);
  return currentVersion === payload.credentialVersion
    ? {
        email: payload.email.toLowerCase(),
        displayName: payload.displayName,
        credentialVersion: payload.credentialVersion,
      }
    : null;
}

export function adminSessionCookie(token: string) {
  return `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ADMIN_SESSION_SECONDS}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
