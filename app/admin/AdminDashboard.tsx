"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type {
  BoatInterest,
  EmailPermission,
  InquiryStatus,
  InquiryWithActivities,
} from "@/db/inquiries";
import type {
  CampaignAudience,
  CampaignWithRecipients,
} from "@/db/campaigns";

const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "Nový",
  contacted: "Kontaktovaný",
  qualified: "Kvalifikovaný",
  waiting: "Čaká",
  closed: "Uzavretý",
};

const LICENSE_LABELS = {
  yes: "áno",
  no: "nie",
  unknown: "nevie",
} as const;

const BOAT_LABELS: Record<BoatInterest, string> = {
  undecided: "Nerozhodnuté",
  dufour_460: "Dufour 460 · 8 700 € bez DPH",
  dufour_470: "Dufour 470 · 9 500 € bez DPH",
};

const AUDIENCE_LABELS: Record<CampaignAudience, string> = {
  all_active: "Všetky aktívne kontakty",
  new: "Iba nové dopyty",
  contacted: "Kontaktované kontakty",
  qualified: "Kvalifikované kontakty",
  waiting: "Kontakty v stave čaká",
};

const CAMPAIGN_STATUS_LABELS: Record<CampaignWithRecipients["status"], string> = {
  draft: "Koncept",
  sending: "Odosiela sa",
  sent: "Odoslaná",
  partial: "Čiastočne odoslaná",
  failed: "Neúspešná",
};

const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value: string | null) {
  if (!value) return "—";
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return dateFormatter.format(new Date(normalized));
}

export default function AdminDashboard({
  initialInquiries,
  initialCampaigns,
  storageReady,
  emailConfigured,
}: {
  initialInquiries: InquiryWithActivities[];
  initialCampaigns: CampaignWithRecipients[];
  storageReady: boolean;
  emailConfigured: boolean;
}) {
  const [view, setView] = useState<"contacts" | "campaigns">("contacts");
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selectedId, setSelectedId] = useState<number | null>(initialInquiries[0]?.id ?? null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(initialCampaigns[0]?.id ?? null);
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [campaignAudience, setCampaignAudience] = useState<CampaignAudience>("all_active");
  const [notice, setNotice] = useState("");
  const [campaignNotice, setCampaignNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const counts = useMemo(() => ({
    all: inquiries.length,
    new: inquiries.filter((item) => item.status === "new").length,
    active: inquiries.filter((item) => ["contacted", "qualified", "waiting"].includes(item.status)).length,
    high: inquiries.filter((item) => item.priority === "high" && item.status !== "closed").length,
  }), [inquiries]);

  const campaignCounts = useMemo(() => ({
    drafts: campaigns.filter((item) => item.status === "draft").length,
    completed: campaigns.filter((item) => ["sent", "partial"].includes(item.status)).length,
    sent: campaigns.reduce((total, item) => total + item.sentCount, 0),
    optedOut: inquiries.filter((item) => item.emailPermission === "opted_out").length,
  }), [campaigns, inquiries]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inquiries.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter;
      const matchesQuery = !needle || [item.fullName, item.company, item.email, item.phone, item.tags]
        .some((value) => value?.toLowerCase().includes(needle));
      return matchesStatus && matchesQuery;
    });
  }, [filter, inquiries, query]);

  const eligibleRecipientCount = useMemo(() => {
    const emails = new Set<string>();
    for (const item of inquiries) {
      if (item.emailPermission !== "allowed" || item.status === "closed") continue;
      if (campaignAudience !== "all_active" && item.status !== campaignAudience) continue;
      emails.add(item.email.toLowerCase());
    }
    return emails.size;
  }, [campaignAudience, inquiries]);

  const selected = inquiries.find((item) => item.id === selectedId) ?? null;
  const selectedCampaign = campaigns.find((item) => item.id === selectedCampaignId) ?? null;

  async function updateSelected(input: {
    status?: InquiryStatus;
    priority?: "normal" | "high";
    assignedTo?: string | null;
    boatInterest?: BoatInterest;
    tags?: string;
    nextFollowUpAt?: string | null;
    emailPermission?: EmailPermission;
  }) {
    if (!selected) return;
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/inquiries/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as { inquiry?: InquiryWithActivities; error?: string };
      if (!response.ok || !result.inquiry) throw new Error(result.error ?? "Zmenu sa nepodarilo uložiť.");
      setInquiries((current) => current.map((item) => (
        item.id === selected.id ? { ...item, ...result.inquiry } : item
      )));
      setNotice("Zmena uložená.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Zmenu sa nepodarilo uložiť.");
    } finally {
      setSaving(false);
    }
  }

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const content = String(data.get("note") ?? "").trim();
    const type = data.get("contact") === "yes" ? "contact" : "note";
    if (!content) return;

    setSaving(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/inquiries/${selected.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type }),
      });
      const result = (await response.json()) as { activity?: InquiryWithActivities["activities"][number]; error?: string };
      if (!response.ok || !result.activity) throw new Error(result.error ?? "Poznámku sa nepodarilo uložiť.");
      setInquiries((current) => current.map((item) => item.id === selected.id
        ? { ...item, activities: [result.activity!, ...item.activities] }
        : item));
      form.reset();
      setNotice("Poznámka uložená.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Poznámku sa nepodarilo uložiť.");
    } finally {
      setSaving(false);
    }
  }

  async function createCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true);
    setCampaignNotice("");
    try {
      const response = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          subject: data.get("subject"),
          previewText: data.get("previewText"),
          body: data.get("body"),
          audience: campaignAudience,
        }),
      });
      const result = (await response.json()) as { campaign?: CampaignWithRecipients; error?: string };
      if (!response.ok || !result.campaign) throw new Error(result.error ?? "Kampaň sa nepodarilo uložiť.");
      setCampaigns((current) => [result.campaign!, ...current]);
      setSelectedCampaignId(result.campaign.id);
      form.reset();
      setCampaignAudience("all_active");
      setCampaignNotice("Koncept kampane je uložený.");
    } catch (error) {
      setCampaignNotice(error instanceof Error ? error.message : "Kampaň sa nepodarilo uložiť.");
    } finally {
      setSaving(false);
    }
  }

  async function sendCampaign() {
    if (!selectedCampaign || selectedCampaign.status !== "draft") return;
    const approved = window.confirm(
      `Naozaj odoslať kampaň „${selectedCampaign.name}“? Príjemcovia sa vyberú podľa uloženého segmentu a odhlásené kontakty sa automaticky vynechajú.`,
    );
    if (!approved) return;

    setSaving(true);
    setCampaignNotice("");
    try {
      const response = await fetch(`/api/admin/campaigns/${selectedCampaign.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "ODOSLAŤ" }),
      });
      const result = (await response.json()) as {
        campaign?: CampaignWithRecipients;
        sentCount?: number;
        failedCount?: number;
        error?: string;
      };
      if (!response.ok || !result.campaign) throw new Error(result.error ?? "Kampaň sa nepodarilo odoslať.");
      setCampaigns((current) => current.map((item) => (
        item.id === result.campaign!.id ? result.campaign! : item
      )));
      setCampaignNotice(`Odoslané: ${result.sentCount ?? 0}. Chyby: ${result.failedCount ?? 0}.`);
    } catch (error) {
      setCampaignNotice(error instanceof Error ? error.message : "Kampaň sa nepodarilo odoslať.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <nav className="crm-tabs" aria-label="Sekcie CRM">
        <button className={view === "contacts" ? "active" : ""} onClick={() => setView("contacts")}>Kontakty <span>{inquiries.length}</span></button>
        <button className={view === "campaigns" ? "active" : ""} onClick={() => setView("campaigns")}>E-mailové kampane <span>{campaigns.length}</span></button>
      </nav>

      {!storageReady && (
        <div className="admin-alert" role="alert">
          Databáza sa ešte pripravuje. Panel je hotový, ale ukladanie sa aktivuje po nasadení migrácie.
        </div>
      )}

      {view === "contacts" ? (
        <>
          <section className="admin-stats" aria-label="Kontakty v číslach">
            <article><p>Potenciálni účastníci</p><strong>{counts.all}</strong><span>unikátne dopyty v CRM</span></article>
            <article><p>Nové</p><strong>{counts.new}</strong><span>čakajú na prvý kontakt</span></article>
            <article><p>Rozpracované</p><strong>{counts.active}</strong><span>v aktívnej komunikácii</span></article>
            <article><p>Vysoká priorita</p><strong>{counts.high}</strong><span>neuzavreté dopyty</span></article>
          </section>

          <section className="lead-toolbar" aria-label="Filtrovanie kontaktov">
            <div className="lead-filters">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Všetky</button>
              {(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((status) => (
                <button key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status)}>
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Hľadať meno, firmu, e-mail alebo tag"
              aria-label="Hľadať v kontaktoch"
            />
            <Link className="export-link" href="/api/admin/inquiries/export" prefetch={false}>Export CSV</Link>
          </section>

          <div className="leads-workspace">
            <section className="lead-list" aria-label="Zoznam potenciálnych účastníkov">
              {filtered.length === 0 ? (
                <div className="lead-empty">
                  <strong>Zatiaľ tu nič nie je.</strong>
                  <p>Nové nezáväzné dopyty z webu sa objavia automaticky.</p>
                </div>
              ) : filtered.map((item) => (
                <button
                  key={item.id}
                  className={`lead-row ${selectedId === item.id ? "selected" : ""}`}
                  onClick={() => { setSelectedId(item.id); setNotice(""); }}
                >
                  <span className={`lead-status status-${item.status}`}>{STATUS_LABELS[item.status as InquiryStatus]}</span>
                  <strong>{item.company}</strong>
                  <span>{item.fullName} · {item.email}</span>
                  <time>{item.nextFollowUpAt ? `Ďalší krok ${formatDate(item.nextFollowUpAt)}` : formatDate(item.createdAt)}</time>
                  {item.priority === "high" && <i>Priorita</i>}
                </button>
              ))}
            </section>

            <aside className="lead-detail" aria-label="Detail kontaktu">
              {!selected ? (
                <div className="lead-empty"><strong>Vyberte kontakt.</strong></div>
              ) : (
                <>
                  <div className="lead-detail-heading">
                    <div><p>Kontakt #{selected.id}</p><h2>{selected.company}</h2><span>{selected.fullName}</span></div>
                    <span className={`lead-status status-${selected.status}`}>{STATUS_LABELS[selected.status as InquiryStatus]}</span>
                  </div>

                  <div className="lead-contact-grid">
                    <a href={`mailto:${selected.email}`}><small>E-mail</small>{selected.email}</a>
                    <a href={selected.phone ? `tel:${selected.phone}` : undefined}><small>Telefón</small>{selected.phone || "—"}</a>
                    <div><small>Počet ľudí</small>{selected.peopleCount ?? "—"}</div>
                    <div><small>Kapitánsky preukaz</small>{LICENSE_LABELS[selected.captainLicense]}</div>
                    <div><small>Preferovaná loď</small>{BOAT_LABELS[selected.boatInterest]}</div>
                    <div><small>Posledný kontakt</small>{formatDate(selected.lastContactedAt)}</div>
                  </div>

                  {selected.message && <div className="lead-message"><small>Správa</small><p>{selected.message}</p></div>}

                  <div className="lead-controls">
                    <label><span>Stav</span><select value={selected.status} disabled={saving} onChange={(event) => updateSelected({ status: event.target.value as InquiryStatus })}>{(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></label>
                    <label><span>Priorita</span><select value={selected.priority} disabled={saving} onChange={(event) => updateSelected({ priority: event.target.value as "normal" | "high" })}><option value="normal">Normálna</option><option value="high">Vysoká</option></select></label>
                    <label><span>Zodpovedá</span><select value={selected.assignedTo ?? ""} disabled={saving} onChange={(event) => updateSelected({ assignedTo: event.target.value || null })}><option value="">Nepriradené</option><option value="Andrej Janák">Andrej Janák</option><option value="Michal Hrivnák">Michal Hrivnák</option></select></label>
                    <label><span>Preferovaná loď</span><select value={selected.boatInterest} disabled={saving} onChange={(event) => updateSelected({ boatInterest: event.target.value as BoatInterest })}>{(Object.keys(BOAT_LABELS) as BoatInterest[]).map((boat) => <option key={boat} value={boat}>{BOAT_LABELS[boat]}</option>)}</select></label>
                    <label><span>Ďalší kontakt</span><input type="date" value={selected.nextFollowUpAt ?? ""} disabled={saving} onChange={(event) => updateSelected({ nextFollowUpAt: event.target.value || null })} /></label>
                    <label><span>Hromadné e-maily</span><select value={selected.emailPermission} disabled={saving} onChange={(event) => updateSelected({ emailPermission: event.target.value as EmailPermission })}><option value="allowed">Povolené</option><option value="opted_out">Odhlásený</option></select></label>
                  </div>

                  <label className="lead-tags"><span>Tagy oddelené čiarkou</span><input key={`${selected.id}-${selected.tags}`} defaultValue={selected.tags} disabled={saving} placeholder="partner, Bratislava, Dufour 470" onBlur={(event) => updateSelected({ tags: event.target.value })} /></label>

                  <form className="lead-note-form" onSubmit={addNote}>
                    <label><span>Interná poznámka</span><textarea name="note" rows={3} placeholder="Čo sme dohodli, ďalší krok, termín…" required /></label>
                    <div><label className="contact-check"><input type="checkbox" name="contact" value="yes" /> Zaznamenať ako kontakt</label><button type="submit" disabled={saving}>Uložiť poznámku</button></div>
                  </form>
                  {notice && <p className="lead-notice" role="status">{notice}</p>}

                  <div className="activity-list">
                    <h3>História komunikácie</h3>
                    {selected.activities.length === 0 ? <p>Bez poznámok.</p> : selected.activities.map((activity) => (
                      <article key={activity.id}>
                        <span>{activity.type}</span><p>{activity.content}</p>
                        <small>{formatDate(activity.createdAt)} · {activity.createdByEmail}</small>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </aside>
          </div>
        </>
      ) : (
        <>
          <section className="admin-stats campaign-stats" aria-label="E-mailové kampane v číslach">
            <article><p>Koncepty</p><strong>{campaignCounts.drafts}</strong><span>pripravené na kontrolu</span></article>
            <article><p>Odoslané kampane</p><strong>{campaignCounts.completed}</strong><span>vrátane čiastočných</span></article>
            <article><p>Odoslané e-maily</p><strong>{campaignCounts.sent}</strong><span>evidované správy</span></article>
            <article><p>Odhlásení</p><strong>{campaignCounts.optedOut}</strong><span>automaticky sa vynechajú</span></article>
          </section>

          <div className={`email-setup ${emailConfigured ? "ready" : "pending"}`}>
            <strong>{emailConfigured ? "Odosielanie je pripravené" : "Odosielanie zatiaľ nie je aktívne"}</strong>
            <p>{emailConfigured ? "Kampane možno po kontrole odoslať. Každý výsledok sa zapíše ku kontaktu." : "Koncepty môžete pripravovať už teraz. Pred prvým odoslaním nastavíme overenú doménu, odosielaciu adresu a bezpečný API kľúč."}</p>
          </div>

          <div className="campaign-workspace">
            <form className="campaign-form" onSubmit={createCampaign}>
              <p className="panel-kicker">Nová kampaň</p>
              <h2>Pripraviť e-mail</h2>
              <label><span>Interný názov *</span><input name="name" required maxLength={120} placeholder="September · prvé informácie" /></label>
              <label><span>Predmet *</span><input name="subject" required maxLength={180} placeholder="{{krstne_meno}}, pripravujeme Tack & Talk Regatta 2027" /></label>
              <label><span>Krátky náhľad</span><input name="previewText" maxLength={220} placeholder="Termín, flotila a ďalší postup" /></label>
              <label><span>Publikum</span><select value={campaignAudience} onChange={(event) => setCampaignAudience(event.target.value as CampaignAudience)}>{(Object.keys(AUDIENCE_LABELS) as CampaignAudience[]).map((audience) => <option key={audience} value={audience}>{AUDIENCE_LABELS[audience]}</option>)}</select></label>
              <div className="campaign-recipient-preview"><strong>{eligibleRecipientCount}</strong><span>aktuálne vhodných príjemcov</span></div>
              <label><span>Text e-mailu *</span><textarea name="body" rows={12} required maxLength={12000} placeholder={"Dobrý deň, {{krstne_meno}},\n\npripravujeme...\n\nS pozdravom"} /></label>
              <p className="campaign-help">Môžete použiť: {"{{krstne_meno}}"}, {"{{meno}}"}, {"{{firma}}"}. E-mail sa uloží ako koncept a nič sa neodošle.</p>
              <button type="submit" disabled={saving || !storageReady}>Uložiť koncept</button>
            </form>

            <section className="campaign-list-panel">
              <div className="campaign-list" aria-label="Zoznam kampaní">
                {campaigns.length === 0 ? <div className="lead-empty"><strong>Zatiaľ bez kampaní.</strong><p>Prvý koncept vytvoríte vo formulári.</p></div> : campaigns.map((campaign) => (
                  <button key={campaign.id} className={selectedCampaignId === campaign.id ? "selected" : ""} onClick={() => { setSelectedCampaignId(campaign.id); setCampaignNotice(""); }}>
                    <span className={`campaign-status campaign-${campaign.status}`}>{CAMPAIGN_STATUS_LABELS[campaign.status]}</span>
                    <strong>{campaign.name}</strong>
                    <small>{campaign.subject}</small>
                    <time>{formatDate(campaign.createdAt)}</time>
                  </button>
                ))}
              </div>

              <aside className="campaign-detail">
                {!selectedCampaign ? <div className="lead-empty"><strong>Vyberte kampaň.</strong></div> : (
                  <>
                    <p className="panel-kicker">Kampaň #{selectedCampaign.id}</p>
                    <h2>{selectedCampaign.name}</h2>
                    <div className="campaign-meta">
                      <div><small>Stav</small><strong>{CAMPAIGN_STATUS_LABELS[selectedCampaign.status]}</strong></div>
                      <div><small>Publikum</small><strong>{AUDIENCE_LABELS[selectedCampaign.audience]}</strong></div>
                      <div><small>Príjemcovia</small><strong>{selectedCampaign.recipientCount}</strong></div>
                      <div><small>Odoslané / chyby</small><strong>{selectedCampaign.sentCount} / {selectedCampaign.failedCount}</strong></div>
                    </div>
                    <div className="campaign-preview">
                      <small>Predmet</small><strong>{selectedCampaign.subject}</strong>
                      {selectedCampaign.previewText && <p className="campaign-preheader">{selectedCampaign.previewText}</p>}
                      <p>{selectedCampaign.body}</p>
                    </div>
                    {selectedCampaign.recipients.length > 0 && (
                      <div className="recipient-list">
                        <h3>Príjemcovia</h3>
                        {selectedCampaign.recipients.slice(0, 12).map((recipient) => <p key={recipient.id}><span>{recipient.email}</span><b className={`recipient-${recipient.status}`}>{recipient.status}</b></p>)}
                      </div>
                    )}
                    {selectedCampaign.status === "draft" && (
                      <button className="campaign-send" type="button" disabled={saving || !emailConfigured} onClick={sendCampaign}>Skontrolovať a odoslať</button>
                    )}
                    {campaignNotice && <p className="lead-notice" role="status">{campaignNotice}</p>}
                  </>
                )}
              </aside>
            </section>
          </div>
        </>
      )}
    </>
  );
}
