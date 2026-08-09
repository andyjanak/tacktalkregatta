"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type { InquiryWithActivities, InquiryStatus } from "@/db/inquiries";

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

const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value: string) {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return dateFormatter.format(new Date(normalized));
}

export default function AdminDashboard({
  initialInquiries,
  storageReady,
}: {
  initialInquiries: InquiryWithActivities[];
  storageReady: boolean;
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selectedId, setSelectedId] = useState<number | null>(initialInquiries[0]?.id ?? null);
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const counts = useMemo(() => ({
    all: inquiries.length,
    new: inquiries.filter((item) => item.status === "new").length,
    active: inquiries.filter((item) => ["contacted", "qualified", "waiting"].includes(item.status)).length,
    high: inquiries.filter((item) => item.priority === "high" && item.status !== "closed").length,
  }), [inquiries]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inquiries.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter;
      const matchesQuery = !needle || [item.fullName, item.company, item.email, item.phone]
        .some((value) => value?.toLowerCase().includes(needle));
      return matchesStatus && matchesQuery;
    });
  }, [filter, inquiries, query]);

  const selected = inquiries.find((item) => item.id === selectedId) ?? null;

  async function updateSelected(input: {
    status?: InquiryStatus;
    priority?: "normal" | "high";
    assignedTo?: string | null;
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

  return (
    <>
      <section className="admin-stats" aria-label="Dopyty v číslach">
        <article><p>Všetky dopyty</p><strong>{counts.all}</strong><span>od spustenia formulára</span></article>
        <article><p>Nové</p><strong>{counts.new}</strong><span>čakajú na prvý kontakt</span></article>
        <article><p>Rozpracované</p><strong>{counts.active}</strong><span>v aktívnej komunikácii</span></article>
        <article><p>Vysoká priorita</p><strong>{counts.high}</strong><span>neuzavreté dopyty</span></article>
      </section>

      {!storageReady && (
        <div className="admin-alert" role="alert">
          Databáza sa ešte pripravuje. Panel je hotový, ale ukladanie sa aktivuje po nasadení migrácie.
        </div>
      )}

      <section className="lead-toolbar" aria-label="Filtrovanie dopytov">
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
          placeholder="Hľadať meno, firmu alebo e-mail"
          aria-label="Hľadať v dopytoch"
        />
        <Link className="export-link" href="/api/admin/inquiries/export" prefetch={false}>Export CSV</Link>
      </section>

      <div className="leads-workspace">
        <section className="lead-list" aria-label="Zoznam dopytov">
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
              <time>{formatDate(item.createdAt)}</time>
              {item.priority === "high" && <i>Priorita</i>}
            </button>
          ))}
        </section>

        <aside className="lead-detail" aria-label="Detail dopytu">
          {!selected ? (
            <div className="lead-empty"><strong>Vyberte dopyt.</strong></div>
          ) : (
            <>
              <div className="lead-detail-heading">
                <div><p>Dopyt #{selected.id}</p><h2>{selected.company}</h2><span>{selected.fullName}</span></div>
                <span className={`lead-status status-${selected.status}`}>{STATUS_LABELS[selected.status as InquiryStatus]}</span>
              </div>

              <div className="lead-contact-grid">
                <a href={`mailto:${selected.email}`}><small>E-mail</small>{selected.email}</a>
                <a href={selected.phone ? `tel:${selected.phone}` : undefined}><small>Telefón</small>{selected.phone || "—"}</a>
                <div><small>Počet ľudí</small>{selected.peopleCount ?? "—"}</div>
                <div><small>Kapitánsky preukaz</small>{LICENSE_LABELS[selected.captainLicense]}</div>
              </div>

              {selected.message && <div className="lead-message"><small>Správa</small><p>{selected.message}</p></div>}

              <div className="lead-controls">
                <label><span>Stav</span><select value={selected.status} disabled={saving} onChange={(event) => updateSelected({ status: event.target.value as InquiryStatus })}>{(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></label>
                <label><span>Priorita</span><select value={selected.priority} disabled={saving} onChange={(event) => updateSelected({ priority: event.target.value as "normal" | "high" })}><option value="normal">Normálna</option><option value="high">Vysoká</option></select></label>
                <label><span>Zodpovedá</span><select value={selected.assignedTo ?? ""} disabled={saving} onChange={(event) => updateSelected({ assignedTo: event.target.value || null })}><option value="">Nepriradené</option><option value="Andrej Janák">Andrej Janák</option><option value="Michal Hrivnák">Michal Hrivnák</option></select></label>
              </div>

              <form className="lead-note-form" onSubmit={addNote}>
                <label><span>Interná poznámka</span><textarea name="note" rows={3} placeholder="Čo sme dohodli, ďalší krok, termín…" required /></label>
                <div><label className="contact-check"><input type="checkbox" name="contact" value="yes" /> Zaznamenať ako kontakt</label><button type="submit" disabled={saving}>Uložiť poznámku</button></div>
              </form>
              {notice && <p className="lead-notice" role="status">{notice}</p>}

              <div className="activity-list">
                <h3>História</h3>
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
  );
}
