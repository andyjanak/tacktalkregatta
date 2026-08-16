import { env } from "cloudflare:workers";
import { recordProviderDeliveryEvent } from "@/db/campaigns";

function runtimeValue(key: string) {
  const runtime = env as unknown as Record<string, string | undefined>;
  return runtime[key] || process.env[key] || "";
}

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

async function verifyWebhook(request: Request, body: string) {
  const secret = runtimeValue("RESEND_WEBHOOK_SECRET");
  const messageId = request.headers.get("svix-id") ?? "";
  const timestamp = request.headers.get("svix-timestamp") ?? "";
  const signatureHeader = request.headers.get("svix-signature") ?? "";
  if (!secret || !messageId || !timestamp || !signatureHeader) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;
  if (Math.abs(Date.now() / 1000 - timestampNumber) > 300) return false;

  const rawSecret = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const key = await crypto.subtle.importKey(
    "raw",
    decodeBase64(rawSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${messageId}.${timestamp}.${body}`),
  );
  const expected = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return signatureHeader
    .split(" ")
    .some((item) => item.startsWith("v1,") && safeEqual(item.slice(3), expected));
}

export async function POST(request: Request) {
  const body = await request.text();
  if (!(await verifyWebhook(request, body))) {
    return Response.json({ error: "Neplatný podpis." }, { status: 401 });
  }

  const event = JSON.parse(body) as {
    type?: string;
    data?: { email_id?: string };
  };
  const providerMessageId = event.data?.email_id;
  const status = event.type === "email.delivered"
    ? "delivered"
    : event.type === "email.bounced"
      ? "bounced"
      : event.type === "email.complained"
        ? "complained"
        : null;

  if (providerMessageId && status) {
    await recordProviderDeliveryEvent({ providerMessageId, status });
  }

  return Response.json({ received: true });
}
