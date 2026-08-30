import type { Metadata } from "next";
import Link from "next/link";
import { verifyResetToken } from "@/lib/admin-reset";
import PasswordInput from "../../login/PasswordInput";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nastavenie nového hesla",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  mismatch: "Nové heslá sa nezhodujú.",
  weak: "Použite aspoň 12 znakov, malé a veľké písmeno, číslo a špeciálny znak.",
  invalid: "Odkaz je neplatný alebo vypršal. Vyžiadajte si nový.",
  storage: "Heslo sa nepodarilo uložiť. Skúste to znova.",
};

export default async function AdminResetConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";
  const error = params.error ? ERROR_MESSAGES[params.error] : null;

  let valid = false;
  try {
    valid = token ? (await verifyResetToken(token)) !== null : false;
  } catch {
    valid = false;
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <Link href="/" className="admin-brand">
          TACK <span>&amp;</span> TALK
        </Link>
        <p className="panel-kicker">Bezpečná obnova</p>
        <h1>Nastaviť nové heslo</h1>

        {!valid ? (
          <>
            <div className="admin-login-error" role="alert">
              Tento odkaz je neplatný alebo vypršal (platí 30 minút a dá sa
              použiť raz).
            </div>
            <Link className="admin-reset-link" href="/admin/reset-password">
              Vyžiadať nový odkaz
            </Link>
          </>
        ) : (
          <>
            <p>Po uložení sa staré heslo zneplatní a prihlásite sa automaticky.</p>
            {error && <div className="admin-login-error" role="alert">{error}</div>}
            <form action="/api/admin/reset-password/confirm" method="post">
              <input type="hidden" name="token" value={token} />
              <PasswordInput name="password" label="Nové heslo" autoComplete="new-password" />
              <PasswordInput name="confirmation" label="Zopakovať nové heslo" autoComplete="new-password" />
              <p className="password-rules">
                Minimálne 12 znakov, veľké a malé písmeno, číslo a špeciálny znak.
              </p>
              <button type="submit">Uložiť nové heslo</button>
            </form>
          </>
        )}

        <Link className="admin-login-back" href="/admin/login">← Späť na prihlásenie</Link>
      </section>
    </main>
  );
}
