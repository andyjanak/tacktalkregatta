import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from ".";
import {
  inquiries,
  inquiryActivities,
  type Inquiry,
  type InquiryActivity,
} from "./schema";

export const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "waiting",
  "closed",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
export type InquiryPriority = "normal" | "high";
export type CaptainLicense = "yes" | "no" | "unknown";

export type InquiryWithActivities = Inquiry & {
  activities: InquiryActivity[];
};

export async function listInquiries(): Promise<InquiryWithActivities[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt), desc(inquiries.id))
    .limit(500);

  if (rows.length === 0) return [];

  const activityRows = await db
    .select()
    .from(inquiryActivities)
    .where(inArray(inquiryActivities.inquiryId, rows.map((row) => row.id)))
    .orderBy(desc(inquiryActivities.createdAt), desc(inquiryActivities.id));

  const byInquiry = new Map<number, InquiryActivity[]>();
  for (const activity of activityRows) {
    const items = byInquiry.get(activity.inquiryId) ?? [];
    items.push(activity);
    byInquiry.set(activity.inquiryId, items);
  }

  return rows.map((row) => ({
    ...row,
    activities: byInquiry.get(row.id) ?? [],
  }));
}

export async function createInquiry(input: {
  fullName: string;
  company: string;
  email: string;
  phone?: string | null;
  peopleCount?: number | null;
  captainLicense: CaptainLicense;
  message?: string;
  source?: string;
}) {
  const db = getDb();
  const [row] = await db
    .insert(inquiries)
    .values({
      fullName: input.fullName,
      company: input.company,
      email: input.email,
      phone: input.phone || null,
      peopleCount: input.peopleCount ?? null,
      captainLicense: input.captainLicense,
      message: input.message ?? "",
      source: input.source ?? "website",
    })
    .returning();

  return row;
}

export async function updateInquiry(
  id: number,
  input: {
    status?: InquiryStatus;
    priority?: InquiryPriority;
    assignedTo?: string | null;
  },
  actorEmail: string,
) {
  const db = getDb();
  const [current] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id))
    .limit(1);

  if (!current) return null;

  const now = new Date().toISOString();

  const changes: Partial<typeof inquiries.$inferInsert> = {
    updatedAt: now,
  };
  const activityValues: Array<typeof inquiryActivities.$inferInsert> = [];

  if (input.status && input.status !== current.status) {
    changes.status = input.status;
    if (input.status === "contacted" && !current.lastContactedAt) {
      changes.lastContactedAt = now;
    }
    activityValues.push({
      inquiryId: id,
      type: "status",
      content: `Stav zmenený z ${current.status} na ${input.status}.`,
      createdByEmail: actorEmail,
    });
  }

  if (input.priority && input.priority !== current.priority) {
    changes.priority = input.priority;
    activityValues.push({
      inquiryId: id,
      type: "status",
      content: `Priorita zmenená na ${input.priority}.`,
      createdByEmail: actorEmail,
    });
  }

  if (input.assignedTo !== undefined) {
    const assignedTo = input.assignedTo?.trim() || null;
    if (assignedTo !== current.assignedTo) {
      changes.assignedTo = assignedTo;
      activityValues.push({
        inquiryId: id,
        type: "assignment",
        content: assignedTo
          ? `Dopyt priradený: ${assignedTo}.`
          : "Priradenie dopytu bolo zrušené.",
        createdByEmail: actorEmail,
      });
    }
  }

  const [updated] = await db
    .update(inquiries)
    .set(changes)
    .where(eq(inquiries.id, id))
    .returning();

  if (activityValues.length > 0) {
    await db.insert(inquiryActivities).values(activityValues);
  }

  return updated;
}

export async function addInquiryNote(
  inquiryId: number,
  content: string,
  actorEmail: string,
  type: "note" | "contact" = "note",
) {
  const db = getDb();
  const [exists] = await db
    .select({ id: inquiries.id })
    .from(inquiries)
    .where(and(eq(inquiries.id, inquiryId)))
    .limit(1);

  if (!exists) return null;

  const now = new Date().toISOString();

  const [activity] = await db
    .insert(inquiryActivities)
    .values({ inquiryId, content, type, createdByEmail: actorEmail })
    .returning();

  await db
    .update(inquiries)
    .set({
      updatedAt: now,
      ...(type === "contact" ? { lastContactedAt: now } : {}),
    })
    .where(eq(inquiries.id, inquiryId));

  return activity;
}
