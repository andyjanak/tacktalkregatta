import { asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from ".";
import {
  emailCampaignRecipients,
  emailCampaigns,
  inquiries,
  inquiryActivities,
  type EmailCampaign,
  type EmailCampaignRecipient,
} from "./schema";

export const CAMPAIGN_AUDIENCES = [
  "all_active",
  "new",
  "contacted",
  "qualified",
  "waiting",
] as const;

export type CampaignAudience = (typeof CAMPAIGN_AUDIENCES)[number];
export type CampaignStatus = EmailCampaign["status"];

export type CampaignWithRecipients = EmailCampaign & {
  recipients: EmailCampaignRecipient[];
};

export async function listEmailCampaigns(): Promise<CampaignWithRecipients[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(emailCampaigns)
    .orderBy(desc(emailCampaigns.createdAt), desc(emailCampaigns.id))
    .limit(100);

  if (rows.length === 0) return [];

  const recipientRows = await db
    .select()
    .from(emailCampaignRecipients)
    .where(inArray(emailCampaignRecipients.campaignId, rows.map((row) => row.id)))
    .orderBy(desc(emailCampaignRecipients.createdAt));

  const byCampaign = new Map<number, EmailCampaignRecipient[]>();
  for (const recipient of recipientRows) {
    const items = byCampaign.get(recipient.campaignId) ?? [];
    items.push(recipient);
    byCampaign.set(recipient.campaignId, items);
  }

  return rows.map((row) => ({
    ...row,
    recipients: byCampaign.get(row.id) ?? [],
  }));
}

export async function getEmailCampaign(
  id: number,
): Promise<CampaignWithRecipients | null> {
  const db = getDb();
  const [campaign] = await db
    .select()
    .from(emailCampaigns)
    .where(eq(emailCampaigns.id, id))
    .limit(1);

  if (!campaign) return null;

  const recipients = await db
    .select()
    .from(emailCampaignRecipients)
    .where(eq(emailCampaignRecipients.campaignId, id))
    .orderBy(asc(emailCampaignRecipients.id));

  return { ...campaign, recipients };
}

export async function createEmailCampaign(input: {
  name: string;
  subject: string;
  previewText?: string;
  body: string;
  audience: CampaignAudience;
  actorEmail: string;
}) {
  const db = getDb();
  const [campaign] = await db
    .insert(emailCampaigns)
    .values({
      name: input.name,
      subject: input.subject,
      previewText: input.previewText ?? "",
      body: input.body,
      audience: input.audience,
      createdByEmail: input.actorEmail,
    })
    .returning();

  return { ...campaign, recipients: [] } satisfies CampaignWithRecipients;
}

export async function prepareCampaignRecipients(campaignId: number) {
  const db = getDb();
  const campaign = await getEmailCampaign(campaignId);
  if (!campaign || campaign.status !== "draft") return null;

  const rows = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.updatedAt), desc(inquiries.id));

  const uniqueByEmail = new Map<string, (typeof rows)[number]>();
  for (const inquiry of rows) {
    if (inquiry.emailPermission !== "allowed" || inquiry.status === "closed") {
      continue;
    }
    if (
      campaign.audience !== "all_active"
      && inquiry.status !== campaign.audience
    ) {
      continue;
    }
    uniqueByEmail.set(inquiry.email.trim().toLowerCase(), inquiry);
  }

  const values = [...uniqueByEmail.values()].map((inquiry) => ({
    campaignId,
    inquiryId: inquiry.id,
    email: inquiry.email,
    fullName: inquiry.fullName,
    company: inquiry.company,
  }));

  if (values.length > 0) {
    await db
      .insert(emailCampaignRecipients)
      .values(values)
      .onConflictDoNothing();
  }

  await db
    .update(emailCampaigns)
    .set({ recipientCount: values.length, updatedAt: new Date().toISOString() })
    .where(eq(emailCampaigns.id, campaignId));

  return getEmailCampaign(campaignId);
}

export async function markCampaignSending(
  campaignId: number,
  actorEmail: string,
) {
  const db = getDb();
  const [campaign] = await db
    .update(emailCampaigns)
    .set({
      status: "sending",
      sentByEmail: actorEmail,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(emailCampaigns.id, campaignId))
    .returning();
  return campaign ?? null;
}

export async function recordRecipientResult(input: {
  recipient: EmailCampaignRecipient;
  status: "sent" | "failed";
  providerMessageId?: string | null;
  errorMessage?: string | null;
  actorEmail: string;
  campaignName: string;
}) {
  const db = getDb();
  const now = new Date().toISOString();

  await db
    .update(emailCampaignRecipients)
    .set({
      status: input.status,
      providerMessageId: input.providerMessageId ?? null,
      errorMessage: input.errorMessage ?? null,
      sentAt: input.status === "sent" ? now : null,
      updatedAt: now,
    })
    .where(eq(emailCampaignRecipients.id, input.recipient.id));

  if (input.status === "sent") {
    await db.insert(inquiryActivities).values({
      inquiryId: input.recipient.inquiryId,
      type: "email",
      content: `Odoslaný e-mail z kampane „${input.campaignName}“.`,
      createdByEmail: input.actorEmail,
    });

    await db
      .update(inquiries)
      .set({
        lastContactedAt: now,
        updatedAt: now,
      })
      .where(eq(inquiries.id, input.recipient.inquiryId));
  }
}

export async function finishCampaign(
  campaignId: number,
  sentCount: number,
  failedCount: number,
) {
  const db = getDb();
  const now = new Date().toISOString();
  const status: CampaignStatus = sentCount === 0 && failedCount > 0
    ? "failed"
    : failedCount > 0
      ? "partial"
      : "sent";

  await db
    .update(emailCampaigns)
    .set({
      status,
      sentCount,
      failedCount,
      sentAt: now,
      updatedAt: now,
    })
    .where(eq(emailCampaigns.id, campaignId));

  return getEmailCampaign(campaignId);
}

export async function recordProviderDeliveryEvent(input: {
  providerMessageId: string;
  status: "delivered" | "bounced" | "complained";
}) {
  const db = getDb();
  const now = new Date().toISOString();

  const [recipient] = await db
    .select()
    .from(emailCampaignRecipients)
    .where(eq(emailCampaignRecipients.providerMessageId, input.providerMessageId))
    .limit(1);

  if (!recipient) return null;

  await db
    .update(emailCampaignRecipients)
    .set({
      status: input.status,
      deliveredAt: input.status === "delivered" ? now : recipient.deliveredAt,
      updatedAt: now,
    })
    .where(eq(emailCampaignRecipients.id, recipient.id));

  if (input.status === "bounced" || input.status === "complained") {
    await db
      .update(inquiries)
      .set({
        emailPermission: "opted_out",
        emailOptOutAt: now,
        updatedAt: now,
      })
      .where(eq(inquiries.id, recipient.inquiryId));
  }

  return recipient;
}
