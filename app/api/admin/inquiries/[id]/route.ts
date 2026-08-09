import { getAdminUser } from "@/app/chatgpt-auth";
import {
  INQUIRY_STATUSES,
  updateInquiry,
  type InquiryPriority,
  type InquiryStatus,
} from "@/db/inquiries";

const PRIORITIES = new Set<InquiryPriority>(["normal", "high"]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Neplatný dopyt." }, { status: 400 });
  }

  const payload = (await request.json()) as {
    status?: InquiryStatus;
    priority?: InquiryPriority;
    assignedTo?: string | null;
  };

  if (payload.status && !INQUIRY_STATUSES.includes(payload.status)) {
    return Response.json({ error: "Neplatný stav." }, { status: 400 });
  }
  if (payload.priority && !PRIORITIES.has(payload.priority)) {
    return Response.json({ error: "Neplatná priorita." }, { status: 400 });
  }
  if (payload.assignedTo && payload.assignedTo.length > 160) {
    return Response.json({ error: "Priradenie je príliš dlhé." }, { status: 400 });
  }

  const inquiry = await updateInquiry(id, payload, user.email);
  if (!inquiry) {
    return Response.json({ error: "Dopyt neexistuje." }, { status: 404 });
  }

  return Response.json({ inquiry }, { headers: { "Cache-Control": "no-store" } });
}
