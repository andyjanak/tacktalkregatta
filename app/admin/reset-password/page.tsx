import type { Metadata } from "next";
import Link from "next/link";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getRecoveryAdminUsers } from "@/lib/admin-credentials";
import PasswordInput from "../login/PasswordInput";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Obnova hesla do administrácie",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  mismatch: "Nové heslá sa nezhodujú.",
  weak: "Použite aspoň 12 znakov, malé a veľké písmeno, číslo a špeciálny znak.",
  denied: "Tento účet nemá oprávnenie obnovovať heslá.",
  storage: "Heslo sa nepodarilo uložiť. Skúste to znova.",
};

export default async function AdminResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const identity = await getChatGPTUser();
  const targets = identity ? getRecoveryAdminUsers(identity.email) : [];
  const params = await searchParams;
  const error = params.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <Link href="/" className="admin-brand">
          TACK <span>&amp;</span> TALK <b>2027</b>
        </Link>
        <p className="panel-kicker">Bezpečná obnova</p>
        <h1>Nastaviť nové heslo</h1>

        {targets.length === 0 ? (
          <>
            <p>Obnova je dostupná iba overenému vlastníkovi webu.</p>
            <div className="admin-login-error" role="alert">
              Otvorte stránku cez účet, ktorý vlastní tento web.
            </div>
          </>
        ) : (
          <>
            <p>Po uložení sa staré heslo zneplatní a prihlásite sa automaticky.</p>
            {error && <div className="admin-login-error" role="alert">{error}</div>}
            <form action="/api/admin/reset-password" method="post">
              <label>
                <span>Admin účet</span>
                <select name="email" required defaultValue={targets[0]?.email}>
                  {targets.map((target) => (
                    <option key={target.email} value={target.email}>
                      {target.displayName} · {target.email}
                    </option>
                  ))}
                </select>
              </label>
              <PasswordInput name="password" label="Nové heslo" autoComplete="new-password" />
              <PasswordInput name="confirmation" label="Zopakovať nové heslo" autoComplete="new-password" />
              <p className="password-rules">Minimálne 12 znakov, veľké a malé písmeno, číslo a špeciálny znak.</p>
              <button type="submit">Uložiť nové heslo</button>
            </form>
          </>
        )}

        <Link className="admin-login-back" href="/admin/login">← Späť na prihlásenie</Link>
      </section>
    </main>
  );
}
