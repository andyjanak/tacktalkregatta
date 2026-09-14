import { desc } from "drizzle-orm";
import { getDb } from ".";
import { partnerInquiries, type PartnerInquiry } from "./schema";

export async function createPartnerInquiry(input: {
  company: string;
  contactName: string;
  role: string;
  email: string;
  phone: string | null;
  interestLevel: string;
  budgetBand: string;
  message: string;
}): Promise<void> {
  const db = getDb();
  await db.insert(partnerInquiries).values({
    company: input.company,
    contactName: input.contactName,
    role: input.role,
    email: input.email,
    phone: input.phone,
    interestLevel: input.interestLevel,
    budgetBand: input.budgetBand,
    message: input.message,
  });
}

export async function listPartnerInquiries(): Promise<PartnerInquiry[]> {
  const db = getDb();
  return db
    .select()
    .from(partnerInquiries)
    .orderBy(desc(partnerInquiries.createdAt), desc(partnerInquiries.id))
    .limit(500);
}
