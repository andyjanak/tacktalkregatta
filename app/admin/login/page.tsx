import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/app/chatgpt-auth";
import Turnstile from "@/app/Turnstile";
import PasswordInput from "./PasswordInput";

const ERROR_MESSAGES: Record<string, string> = {
  system: "Prihlásenie je dočasne nedostupné. Skúste to o chvíľu znova.",
  throttled: "Príliš veľa pokusov. Skúste to o pár minút znova.",
  captcha: "Overenie, že nie ste robot, zlyhalo. Skúste to znova.",
  "1": "E-mail alebo heslo nie je správne. Heslo rozlišuje veľké a malé písmená.",
};

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
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <Link href="/" className="admin-brand">
          TACK <span>&amp;</span> TALK
        </Link>
        <p className="panel-kicker">Interný prístup</p>
        <h1>Prihlásenie do administrácie</h1>
        <p>Správa kontaktov, dopytov a e-mailových kampaní.</p>

        {params.error && (
          <div className="admin-login-error" role="alert">
            {ERROR_MESSAGES[params.error] ?? ERROR_MESSAGES["1"]}
          </div>
        )}

        <form action="/api/admin/login" method="post">
          <input type="hidden" name="returnTo" value={returnTo} />
          <label>
            <span>E-mail</span>
            <input name="email" type="email" autoComplete="username" required maxLength={200} />
          </label>
          <PasswordInput name="password" label="Heslo" autoComplete="current-password" />
          <Turnstile siteKey={turnstileSiteKey} />
          <button type="submit">Prihlásiť sa</button>
        </form>
        <Link className="admin-reset-link" href="/admin/reset-password">
          Zabudol som heslo
        </Link>
        <Link className="admin-login-back" href="/">← Späť na web</Link>
      </section>
    </main>
  );
}
