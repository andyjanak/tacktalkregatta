import { desc } from "drizzle-orm";
import { getDb } from ".";
import { reservations, type Reservation } from "./schema";

export type ReservationBoat = "dufour_460" | "dufour_470" | "undecided";

// Vytvorí rezerváciu a vráti jej id — slúži ako poradové číslo v poradovníku.
export async function createReservation(input: {
  company: string;
  contactName: string;
  email: string;
  phone: string | null;
  boatPreference: ReservationBoat;
  peopleCount: number | null;
  message: string;
}): Promise<number> {
  const db = getDb();
  const [row] = await db
    .insert(reservations)
    .values({
      company: input.company,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      boatPreference: input.boatPreference,
      peopleCount: input.peopleCount,
      message: input.message,
    })
    .returning({ id: reservations.id });
  return row.id;
}

export async function listReservations(): Promise<Reservation[]> {
  const db = getDb();
  return db
    .select()
    .from(reservations)
    .orderBy(desc(reservations.createdAt), desc(reservations.id))
    .limit(500);
}
