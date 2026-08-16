import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prihlásenie do administrácie",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; return_to?: string }>;
}) {
  const user = await getAdminUser();
  if (user) redirect("/admin");

  const params = await searchParams;
  const returnTo = params.return_to === "/admin" ? "/admin" : "/admin";

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <Link href="/" className="admin-brand">
          TACK <span>&amp;</span> TALK <b>2027</b>
        </Link>
        <p className="panel-kicker">Interný prístup</p>
        <h1>Prihlásenie do administrácie</h1>
        <p>Správa kontaktov, dopytov a e-mailových kampaní.</p>

        {params.error && (
          <div className="admin-login-error" role="alert">
            E-mail alebo heslo nie je správne.
          </div>
        )}

        <form action="/api/admin/login" method="post">
          <input type="hidden" name="returnTo" value={returnTo} />
          <label>
            <span>E-mail</span>
            <input name="email" type="email" autoComplete="username" required maxLength={200} />
          </label>
          <label>
            <span>Heslo</span>
            <input name="password" type="password" autoComplete="current-password" required maxLength={512} />
          </label>
          <button type="submit">Prihlásiť sa</button>
        </form>
        <Link className="admin-login-back" href="/">← Späť na web</Link>
      </section>
    </main>
  );
}
