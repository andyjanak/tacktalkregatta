import { getAdminUser } from "@/app/chatgpt-auth";
import { addInquiryNote } from "@/db/inquiries";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return Response.json({ error: "Prístup zamietnutý." }, { status: 403 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  const payload = (await request.json()) as {
    content?: string;
    type?: "note" | "contact";
  };
  const content = payload.content?.trim().slice(0, 3000) ?? "";

  if (!Number.isInteger(id) || id < 1 || !content) {
    return Response.json({ error: "Poznámka je povinná." }, { status: 400 });
  }

  const activity = await addInquiryNote(
    id,
    content,
    user.email,
    payload.type === "contact" ? "contact" : "note",
  );
  if (!activity) {
    return Response.json({ error: "Dopyt neexistuje." }, { status: 404 });
  }

  return Response.json(
    { activity },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
