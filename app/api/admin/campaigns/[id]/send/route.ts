import { getAdminUser } from "@/app/chatgpt-auth";
const MAX_RECIPIENTS_PER_CAMPAIGN = 200;

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
  const payload = (await request.json()) as { confirmation?: string };
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Neplatná kampaň." }, { status: 400 });
  }
  if (payload.confirmation !== "ODOSLAŤ") {
    return Response.json(
      { error: "Odoslanie nebolo potvrdené." },
      { status: 400 },
    );
  }
  const {
    finishCampaign,
    getEmailCampaign,
    markCampaignSending,
    prepareCampaignRecipients,
    recordRecipientResult,
  } = await import("@/db/campaigns");
  const {
    getEmailConfigurationStatus,
    sendCampaignEmail,
  } = await import("@/lib/email");

  if (!getEmailConfigurationStatus().configured) {
    return Response.json(
      { error: "Najprv treba nastaviť odosielaciu doménu a e-mailový účet." },
      { status: 503 },
    );
  }

  const existing = await getEmailCampaign(id);
  if (!existing) {
    return Response.json({ error: "Kampaň neexistuje." }, { status: 404 });
  }
  if (existing.status !== "draft") {
    return Response.json(
      { error: "Odoslať možno iba koncept kampane." },
      { status: 409 },
    );
  }

  const campaign = await prepareCampaignRecipients(id);
  if (!campaign || campaign.recipients.length === 0) {
    return Response.json(
      { error: "Pre vybrané publikum nie sú žiadni povolení príjemcovia." },
      { status: 400 },
    );
  }
  if (campaign.recipients.length > MAX_RECIPIENTS_PER_CAMPAIGN) {
    return Response.json(
      { error: `Jedna kampaň môže mať najviac ${MAX_RECIPIENTS_PER_CAMPAIGN} príjemcov.` },
      { status: 400 },
    );
  }

  await markCampaignSending(id, user.email);

  let sentCount = 0;
  let failedCount = 0;

  for (let offset = 0; offset < campaign.recipients.length; offset += 8) {
    const chunk = campaign.recipients.slice(offset, offset + 8);
    const results = await Promise.all(chunk.map(async (recipient) => {
      try {
        const result = await sendCampaignEmail({ campaign, recipient });
        return { recipient, ok: true as const, ...result };
      } catch (error) {
        return {
          recipient,
          ok: false as const,
          errorMessage: error instanceof Error ? error.message : "Neznáma chyba.",
        };
      }
    }));

    for (const result of results) {
      if (result.ok) {
        sentCount += 1;
        await recordRecipientResult({
          recipient: result.recipient,
          status: "sent",
          providerMessageId: result.providerMessageId,
          actorEmail: user.email,
          campaignName: campaign.name,
        });
      } else {
        failedCount += 1;
        await recordRecipientResult({
          recipient: result.recipient,
          status: "failed",
          errorMessage: result.errorMessage,
          actorEmail: user.email,
          campaignName: campaign.name,
        });
      }
    }
  }

  const updated = await finishCampaign(id, sentCount, failedCount);
  return Response.json(
    { campaign: updated, sentCount, failedCount },
    { headers: { "Cache-Control": "no-store" } },
  );
}
