import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ChatGPTUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

const USER_ID_HEADER = "oai-authenticated-user-id";
const USER_EMAIL_HEADER = "oai-authenticated-user-email";
const USER_FULL_NAME_HEADER = "oai-authenticated-user-full-name";
const USER_FULL_NAME_ENCODING_HEADER =
  "oai-authenticated-user-full-name-encoding";
const PERCENT_ENCODED_UTF8 = "percent-encoded-utf-8";
const SIGN_IN_PATH = "/signin-with-chatgpt";
const SIGN_OUT_PATH = "/signout-with-chatgpt";
const CALLBACK_PATH = "/callback";
const ADMIN_COOKIE_NAME = "tt27_admin_session";
const DEFAULT_ADMIN_USER_IDS = new Set([
  "3a1e2c0b-8f17-448f-b064-95ce2bd86294",
]);
const DEFAULT_ADMIN_EMAILS = new Set([
  "janak@ajservices.sk",
  "hrivnak@tangreto.com",
  "hrivnak.michal@gmail.com",
]);

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  const userId = requestHeaders.get(USER_ID_HEADER);
  const email = requestHeaders.get(USER_EMAIL_HEADER);
  if (!userId || !email) return null;

  const encodedFullName = requestHeaders.get(USER_FULL_NAME_HEADER);
  const fullName =
    encodedFullName &&
    requestHeaders.get(USER_FULL_NAME_ENCODING_HEADER) === PERCENT_ENCODED_UTF8
      ? safeDecodeURIComponent(encodedFullName)
      : null;

  return {
    userId,
    displayName: fullName ?? email,
    email,
    fullName,
  };
}

export async function requireChatGPTUser(
  returnTo: string,
): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;

  redirect(chatGPTSignInPath(returnTo));
}

export async function getAdminUser(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  if (user && isAdminUser(user)) return user;

  const requestHeaders = await headers();
  const token = readCookie(
    requestHeaders.get("cookie") ?? "",
    ADMIN_COOKIE_NAME,
  );
  if (!token) return null;

  const { verifyAdminSessionToken } = await import("@/lib/admin-credentials");
  const sessionUser = await verifyAdminSessionToken(token);
  if (!sessionUser) return null;

  return {
    userId: `password:${sessionUser.email}`,
    displayName: sessionUser.displayName,
    email: sessionUser.email,
    fullName: sessionUser.displayName,
  };
}

export async function requireAdminUser(returnTo: string): Promise<ChatGPTUser> {
  const user = await getAdminUser();
  if (user) return user;

  const safeReturnTo = safeRelativeReturnPath(returnTo);
  redirect(`/admin/login?return_to=${encodeURIComponent(safeReturnTo)}`);
}

export function isAdminUser(user: ChatGPTUser): boolean {
  const normalizedEmail = user.email.trim().toLowerCase();
  return DEFAULT_ADMIN_USER_IDS.has(user.userId)
    || DEFAULT_ADMIN_EMAILS.has(normalizedEmail);
}

export function chatGPTSignInPath(returnTo: string): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  return `${SIGN_IN_PATH}?return_to=${encodeURIComponent(safeReturnTo)}`;
}

export function chatGPTSignOutPath(returnTo = "/"): string {
  const safeReturnTo = safeRelativeReturnPath(returnTo);
  return `${SIGN_OUT_PATH}?return_to=${encodeURIComponent(safeReturnTo)}`;
}

function safeRelativeReturnPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";

  let url: URL;
  try {
    url = new URL(value, "https://app.local");
  } catch {
    return "/";
  }
  if (url.origin !== "https://app.local") return "/";
  if (isReservedAuthPath(url.pathname)) return "/";

  return `${url.pathname}${url.search}${url.hash}`;
}

function isReservedAuthPath(pathname: string): boolean {
  return (
    pathname === SIGN_IN_PATH ||
    pathname === SIGN_OUT_PATH ||
    pathname === CALLBACK_PATH
  );
}

function safeDecodeURIComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function readCookie(cookieHeader: string, name: string) {
  for (const part of cookieHeader.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return value.join("=");
  }
  return null;
}
