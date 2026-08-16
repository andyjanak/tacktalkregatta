import { getAdminUser } from "@/app/chatgpt-auth";
import type { CampaignAudience } from "@/db/campaigns";

const CAMPAIGN_AUDIENCES: CampaignAudience[] = [
  "all_active",
  "new",
  "contacted",
  "qualified",
  "waiting",
];

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const { listEmailCampaigns } = await import("@/db/campaigns");
  const campaigns = await listEmailCampaigns();
  return Response.json({ campaigns }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const name = cleanText(payload.name, 120);
  const subject = cleanText(payload.subject, 180);
  const previewText = cleanText(payload.previewText, 220);
  const body = cleanText(payload.body, 12_000);
  const audience = cleanText(payload.audience, 30) as CampaignAudience;

  if (!name || !subject || !body) {
    return Response.json(
      { error: "Názov, predmet a text e-mailu sú povinné." },
      { status: 400 },
    );
  }
  if (!CAMPAIGN_AUDIENCES.includes(audience)) {
    return Response.json({ error: "Neplatné publikum." }, { status: 400 });
  }

  const { createEmailCampaign } = await import("@/db/campaigns");
  const campaign = await createEmailCampaign({
    name,
    subject,
    previewText,
    body,
    audience,
    actorEmail: user.email,
  });

  return Response.json(
    { campaign },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
