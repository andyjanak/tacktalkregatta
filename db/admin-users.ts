import { eq } from "drizzle-orm";
import { getDb } from "./index";
import { adminPasswordOverrides } from "./schema";

export type StoredAdminPassword = {
  email: string;
  salt: string;
  hash: string;
  iterations: number;
  updatedAt: string;
};

export async function getAdminPasswordOverride(email: string) {
  const [record] = await getDb()
    .select()
    .from(adminPasswordOverrides)
    .where(eq(adminPasswordOverrides.email, email.toLowerCase()))
    .limit(1);

  return record ?? null;
}

export async function saveAdminPasswordOverride(
  record: Omit<StoredAdminPassword, "updatedAt">,
) {
  const updatedAt = new Date().toISOString();
  await getDb()
    .insert(adminPasswordOverrides)
    .values({ ...record, email: record.email.toLowerCase(), updatedAt })
    .onConflictDoUpdate({
      target: adminPasswordOverrides.email,
      set: {
        salt: record.salt,
        hash: record.hash,
        iterations: record.iterations,
        updatedAt,
      },
    });

  return updatedAt;
}
