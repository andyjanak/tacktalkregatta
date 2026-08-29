import type { Metadata } from "next";
import AdminWeatherButton from "./AdminWeatherButton";
import Link from "next/link";
import regatta from "@/data/regatta.json";
import type { InquiryWithActivities } from "@/db/inquiries";
import type { CampaignWithRecipients } from "@/db/campaigns";
import { requireAdminUser } from "../chatgpt-auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T12:00:00+02:00`));
}

export default async function AdminPage() {
  const user = await requireAdminUser("/admin");

  let storageReady = true;
  let inquiryRows: InquiryWithActivities[] = [];
  let campaignRows: CampaignWithRecipients[] = [];
  let emailConfigured = false;
  try {
    const { listInquiries } = await import("@/db/inquiries");
    const { listEmailCampaigns } = await import("@/db/campaigns");
    [inquiryRows, campaignRows] = await Promise.all([
      listInquiries(),
      listEmailCampaigns(),
    ]);
  } catch (error) {
    storageReady = false;
    if (
      !(error instanceof Error)
      || (error as Error & { code?: string }).code !== "ERR_UNSUPPORTED_ESM_URL_SCHEME"
    ) {
      console.error("Inquiry storage is unavailable", error);
    }
  }

  try {
    const { getEmailConfigurationStatus } = await import("@/lib/email");
    emailConfigured = getEmailConfigurationStatus().configured;
  } catch {
    emailConfigured = false;
  }

  const nextMilestones = regatta.milestones.slice(0, 6);

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link href="/" className="admin-brand">
          TACK <span>&amp;</span> TALK <b>2027</b>
        </Link>
        <nav className="admin-user" aria-label="Používateľské menu">
          <span>{user.displayName}</span>
          <AdminWeatherButton />
          <a href="/" target="_blank" rel="noopener noreferrer">Web ↗</a>
          <a href="/api/admin/logout">Odhlásiť</a>
        </nav>
      </header>

      <div className="admin-content">
        <div className="admin-title-row">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> Potenciálni zákazníci a komunikácia</p>
            <h1>Regatta CRM</h1>
          </div>
          <div className="admin-state"><span /> Interný panel</div>
        </div>

        <AdminDashboard
          initialInquiries={inquiryRows}
          initialCampaigns={campaignRows}
          storageReady={storageReady}
          emailConfigured={emailConfigured}
        />

        <div className="admin-secondary-grid">
          <section className="admin-panel">
            <div className="panel-heading">
              <div><p className="panel-kicker">Launch gates</p><h2>Otvorené témy</h2></div>
              <span>{regatta.open_items.length} otvorených</span>
            </div>
            <div className="issue-list">
              {regatta.open_items.map((item) => (
                <article key={item.id}>
                  <span className={`issue-id severity-${item.severity}`}>{item.id}</span>
                  <div><h3>{item.topic}</h3><p>{item.description}</p></div>
                  <time dateTime={item.deadline}>{formatDate(item.deadline)}</time>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-panel milestones-panel">
            <div className="panel-heading">
              <div><p className="panel-kicker">Najbližšie míľniky</p><h2>Príprava projektu</h2></div>
            </div>
            <div className="milestone-list compact">
              {nextMilestones.map((item, index) => (
                <article key={`${item.date}-${item.task}`}>
                  <span className={`milestone-marker ${item.critical ? "critical" : ""}`}>{index + 1}</span>
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  <p>{item.task}</p>
                  <span className="owner">{item.owner}</span>
                </article>
              ))}
            </div>
          </section>
        </div>

        <p className="admin-source-note">
          Projektové údaje: regatta.json · verzia {regatta.document_version} ·
          aktualizované {formatDate(regatta.generated)}
        </p>
      </div>
    </main>
  );
}
