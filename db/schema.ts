import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const inquiries = sqliteTable(
  "inquiries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    fullName: text("full_name").notNull(),
    company: text("company").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    peopleCount: integer("people_count"),
    captainLicense: text("captain_license", {
      enum: ["yes", "no", "unknown"],
    }).notNull().default("unknown"),
    boatInterest: text("boat_interest", {
      enum: ["dufour_460", "dufour_470", "undecided"],
    }).notNull().default("undecided"),
    message: text("message").notNull().default(""),
    source: text("source").notNull().default("website"),
    status: text("status", {
      enum: ["new", "contacted", "qualified", "waiting", "closed"],
    }).notNull().default("new"),
    priority: text("priority", {
      enum: ["normal", "high"],
    }).notNull().default("normal"),
    assignedTo: text("assigned_to"),
    tags: text("tags").notNull().default(""),
    nextFollowUpAt: text("next_follow_up_at"),
    emailPermission: text("email_permission", {
      enum: ["allowed", "opted_out"],
    }).notNull().default("allowed"),
    emailOptOutAt: text("email_opt_out_at"),
    consentAt: text("consent_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    lastContactedAt: text("last_contacted_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_inquiries_status_created_at").on(table.status, table.createdAt),
    index("idx_inquiries_email").on(table.email),
    index("idx_inquiries_follow_up").on(table.nextFollowUpAt),
  ],
);

export const inquiryActivities = sqliteTable(
  "inquiry_activities",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    inquiryId: integer("inquiry_id")
      .notNull()
      .references(() => inquiries.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: ["note", "status", "assignment", "contact", "email", "profile"],
    }).notNull().default("note"),
    content: text("content").notNull(),
    createdByEmail: text("created_by_email").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_inquiry_activities_inquiry_created_at").on(
      table.inquiryId,
      table.createdAt,
    ),
  ],
);

export const emailCampaigns = sqliteTable(
  "email_campaigns",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    previewText: text("preview_text").notNull().default(""),
    body: text("body").notNull(),
    audience: text("audience", {
      enum: ["all_active", "new", "contacted", "qualified", "waiting"],
    }).notNull().default("all_active"),
    status: text("status", {
      enum: ["draft", "sending", "sent", "partial", "failed"],
    }).notNull().default("draft"),
    recipientCount: integer("recipient_count").notNull().default(0),
    sentCount: integer("sent_count").notNull().default(0),
    failedCount: integer("failed_count").notNull().default(0),
    createdByEmail: text("created_by_email").notNull(),
    sentByEmail: text("sent_by_email"),
    sentAt: text("sent_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_email_campaigns_status_created_at").on(
      table.status,
      table.createdAt,
    ),
  ],
);

export const emailCampaignRecipients = sqliteTable(
  "email_campaign_recipients",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    campaignId: integer("campaign_id")
      .notNull()
      .references(() => emailCampaigns.id, { onDelete: "cascade" }),
    inquiryId: integer("inquiry_id")
      .notNull()
      .references(() => inquiries.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    company: text("company").notNull(),
    status: text("status", {
      enum: ["queued", "sent", "delivered", "bounced", "complained", "failed", "skipped"],
    }).notNull().default("queued"),
    providerMessageId: text("provider_message_id"),
    errorMessage: text("error_message"),
    sentAt: text("sent_at"),
    deliveredAt: text("delivered_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_email_recipients_campaign_email").on(
      table.campaignId,
      table.email,
    ),
    index("idx_email_recipients_provider_message").on(table.providerMessageId),
    index("idx_email_recipients_campaign_status").on(
      table.campaignId,
      table.status,
    ),
  ],
);

export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryActivity = typeof inquiryActivities.$inferSelect;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type EmailCampaignRecipient = typeof emailCampaignRecipients.$inferSelect;
