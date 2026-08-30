import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Obnova hesla do administrácie",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  throttled: "Priveľa žiadostí. Skúste to prosím o pár minút.",
  system: "Odkaz sa nepodarilo odoslať. Skúste to neskôr.",
};

export default async function AdminResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ? ERROR_MESSAGES[params.error] : null;
  const sent = params.sent === "1";

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <Link href="/" className="admin-brand">
          TACK <span>&amp;</span> TALK
        </Link>
        <p className="panel-kicker">Bezpečná obnova</p>
        <h1>Obnova hesla</h1>

        {sent ? (
          <p role="status">
            Ak k tomuto e-mailu existuje admin účet, poslali sme naň odkaz na
            nastavenie nového hesla. Odkaz platí 30 minút. Skontrolujte aj
            priečinok Spam.
          </p>
        ) : (
          <>
            <p>
              Zadajte e-mail svojho admin účtu. Pošleme naň jednorazový odkaz na
              nastavenie nového hesla.
            </p>
            {error && <div className="admin-login-error" role="alert">{error}</div>}
            <form action="/api/admin/reset-password" method="post">
              <label>
                <span>E-mail admin účtu</span>
                <input name="email" type="email" autoComplete="username" required maxLength={200} />
              </label>
              <button type="submit">Poslať odkaz na obnovu</button>
            </form>
          </>
        )}

        <Link className="admin-login-back" href="/admin/login">← Späť na prihlásenie</Link>
      </section>
    </main>
  );
}
