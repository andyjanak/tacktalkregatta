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
export type BoatInterest = "dufour_460" | "dufour_470" | "undecided";
export type EmailPermission = "allowed" | "opted_out";

export type InquiryWithActivities = Inquiry & {
  activities: InquiryActivity[];
};

export async function getInquiryWithActivities(id: number) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id))
    .limit(1);
  if (!row) return null;

  const activities = await db
    .select()
    .from(inquiryActivities)
    .where(eq(inquiryActivities.inquiryId, id))
    .orderBy(desc(inquiryActivities.createdAt), desc(inquiryActivities.id));

  return { ...row, activities };
}

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
  businessFocus?: string;
  annualTurnover?: string;
  peopleCount?: number | null;
  captainLicense: CaptainLicense;
  boatInterest?: BoatInterest;
  message?: string;
  source?: string;
  actorEmail?: string;
}) {
  const db = getDb();

  const normalizedEmail = input.email.trim().toLowerCase();
  const [existing] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.email, normalizedEmail))
    .orderBy(desc(inquiries.id))
    .limit(1);

  if (existing) {
    const now = new Date().toISOString();
    const [updated] = await db
      .update(inquiries)
      .set({
        fullName: input.fullName,
        company: input.company,
        phone: input.phone || existing.phone,
        businessFocus: input.businessFocus ?? existing.businessFocus,
        annualTurnover: input.annualTurnover ?? existing.annualTurnover,
        peopleCount: input.peopleCount ?? existing.peopleCount,
        captainLicense: input.captainLicense,
        boatInterest: input.boatInterest ?? existing.boatInterest,
        message: input.message || existing.message,
        source: input.source ?? existing.source,
        updatedAt: now,
      })
      .where(eq(inquiries.id, existing.id))
      .returning();

    await db.insert(inquiryActivities).values({
      inquiryId: existing.id,
      type: "contact",
      content: input.source === "manual"
        ? "Kontakt bol ručne aktualizovaný v zozname potenciálnych zákazníkov."
        : input.message
          ? `Opakovaný dopyt z webu: ${input.message}`
          : "Opakovaný dopyt z webu.",
      createdByEmail: input.source === "manual"
        ? (input.actorEmail ?? normalizedEmail)
        : normalizedEmail,
    });

    return updated;
  }

  const [row] = await db
    .insert(inquiries)
    .values({
      fullName: input.fullName,
      company: input.company,
      email: normalizedEmail,
      phone: input.phone || null,
      businessFocus: input.businessFocus ?? "",
      annualTurnover: input.annualTurnover ?? "",
      peopleCount: input.peopleCount ?? null,
      captainLicense: input.captainLicense,
      boatInterest: input.boatInterest ?? "undecided",
      message: input.message ?? "",
      source: input.source ?? "website",
    })
    .returning();

  if (input.source === "manual") {
    await db.insert(inquiryActivities).values({
      inquiryId: row.id,
      type: "profile",
      content: "Kontakt bol ručne pridaný do zoznamu potenciálnych zákazníkov.",
      createdByEmail: input.actorEmail ?? normalizedEmail,
    });
  }

  return row;
}

export async function updateInquiry(
  id: number,
  input: {
    status?: InquiryStatus;
    priority?: InquiryPriority;
    assignedTo?: string | null;
    boatInterest?: BoatInterest;
    tags?: string;
    nextFollowUpAt?: string | null;
    emailPermission?: EmailPermission;
    businessFocus?: string;
    annualTurnover?: string;
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

  if (input.boatInterest && input.boatInterest !== current.boatInterest) {
    changes.boatInterest = input.boatInterest;
    activityValues.push({
      inquiryId: id,
      type: "profile",
      content: `Preferencia lode zmenená na ${input.boatInterest}.`,
      createdByEmail: actorEmail,
    });
  }

  if (input.tags !== undefined) {
    const tags = input.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 20)
      .join(", ");
    if (tags !== current.tags) {
      changes.tags = tags;
      activityValues.push({
        inquiryId: id,
        type: "profile",
        content: tags ? `Tagy: ${tags}.` : "Tagy boli odstránené.",
        createdByEmail: actorEmail,
      });
    }
  }

  if (input.nextFollowUpAt !== undefined) {
    const nextFollowUpAt = input.nextFollowUpAt?.trim() || null;
    if (nextFollowUpAt !== current.nextFollowUpAt) {
      changes.nextFollowUpAt = nextFollowUpAt;
      activityValues.push({
        inquiryId: id,
        type: "profile",
        content: nextFollowUpAt
          ? `Ďalší kontakt naplánovaný na ${nextFollowUpAt}.`
          : "Termín ďalšieho kontaktu bol zrušený.",
        createdByEmail: actorEmail,
      });
    }
  }

  if (input.emailPermission && input.emailPermission !== current.emailPermission) {
    changes.emailPermission = input.emailPermission;
    changes.emailOptOutAt = input.emailPermission === "opted_out" ? now : null;
    activityValues.push({
      inquiryId: id,
      type: "profile",
      content: input.emailPermission === "opted_out"
        ? "Kontakt bol odhlásený z hromadnej e-mailovej komunikácie."
        : "Hromadná e-mailová komunikácia bola opätovne povolená.",
      createdByEmail: actorEmail,
    });
  }

  if (input.businessFocus !== undefined) {
    const businessFocus = input.businessFocus.trim().slice(0, 240);
    if (businessFocus !== current.businessFocus) {
      changes.businessFocus = businessFocus;
      activityValues.push({
        inquiryId: id,
        type: "profile",
        content: businessFocus
          ? `Zameranie firmy: ${businessFocus}.`
          : "Zameranie firmy bolo odstránené.",
        createdByEmail: actorEmail,
      });
    }
  }

  if (input.annualTurnover !== undefined) {
    const annualTurnover = input.annualTurnover.trim().slice(0, 120);
    if (annualTurnover !== current.annualTurnover) {
      changes.annualTurnover = annualTurnover;
      activityValues.push({
        inquiryId: id,
        type: "profile",
        content: annualTurnover
          ? `Ročný obrat: ${annualTurnover}.`
          : "Údaj o ročnom obrate bol odstránený.",
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
