import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
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
    message: text("message").notNull().default(""),
    source: text("source").notNull().default("website"),
    status: text("status", {
      enum: ["new", "contacted", "qualified", "waiting", "closed"],
    }).notNull().default("new"),
    priority: text("priority", {
      enum: ["normal", "high"],
    }).notNull().default("normal"),
    assignedTo: text("assigned_to"),
    consentAt: text("consent_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    lastContactedAt: text("last_contacted_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_inquiries_status_created_at").on(table.status, table.createdAt),
    index("idx_inquiries_email").on(table.email),
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
      enum: ["note", "status", "assignment", "contact"],
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

export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryActivity = typeof inquiryActivities.$inferSelect;
