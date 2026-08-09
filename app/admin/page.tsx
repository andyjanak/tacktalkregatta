import type { Metadata } from "next";
import Link from "next/link";
import regatta from "@/data/regatta.json";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";

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
  const user = await requireChatGPTUser("/admin");
  const nextMilestones = regatta.milestones.slice(0, 8);
  const criticalOpenItems = regatta.open_items.filter(
    (item) => item.severity === "high",
  ).length;

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link href="/" className="admin-brand">
          TACK <span>&amp;</span> TALK <b>2027</b>
        </Link>
        <div className="admin-user">
          <span>{user.displayName}</span>
          <a href={chatGPTSignOutPath("/")}>Odhlásiť</a>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-title-row">
          <div>
            <p className="eyebrow eyebrow-dark"><span /> Interný prehľad</p>
            <h1>Príprava TT27</h1>
          </div>
          <div className="admin-state"><span /> Fáza: príprava</div>
        </div>

        <section className="admin-stats" aria-label="Základné ukazovatele">
          <article><p>Model flotily</p><strong>12 + 8</strong><span>lodí pevne + opcia</span></article>
          <article><p>Cieľová kapacita</p><strong>{regatta.fleet.participants_total}</strong><span>účastníkov</span></article>
          <article><p>Test dopytu</p><strong>8</strong><span>lodí do 30. 11. 2026</span></article>
          <article><p>Otvorené témy</p><strong>{regatta.open_items.length}</strong><span>z toho {criticalOpenItems} kritické</span></article>
        </section>

        <div className="admin-grid">
          <section className="admin-panel">
            <div className="panel-heading">
              <div><p className="panel-kicker">Launch gates</p><h2>Čo musí byť uzavreté</h2></div>
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

          <aside className="admin-panel admin-registration">
            <div className="lock-mark">×</div>
            <p className="panel-kicker">Registrácia</p>
            <h2>Zatiaľ uzamknutá</h2>
            <p>
              Formulár, zmluvné súhlasy a databázu registrácií spustíme až po
              právnom posúdení balíčka a podpise charterovej zmluvy.
            </p>
            <dl>
              <div><dt>Právna forma</dt><dd>otvorená</dd></div>
              <div><dt>Charter 12 + 8</dt><dd>do 12/2026</dd></div>
              <div><dt>Plánované otvorenie</dt><dd>po podpise</dd></div>
            </dl>
          </aside>
        </div>

        <section className="admin-panel milestones-panel">
          <div className="panel-heading">
            <div><p className="panel-kicker">Najbližšie míľniky</p><h2>Príprava do podpisu</h2></div>
          </div>
          <div className="milestone-list">
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

        <p className="admin-source-note">
          Zdroj pravdy: regatta.json · verzia {regatta.document_version} · údaje
          aktualizované {formatDate(regatta.generated)}
        </p>
      </div>
    </main>
  );
}
