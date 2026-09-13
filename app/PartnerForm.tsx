"use client";

import { FormEvent, useState } from "react";
import Turnstile from "./Turnstile";
import type { Dict } from "./i18n";

type FormState = "idle" | "sending" | "success" | "error";

// Samostatný partnerský formulár (oddelený lievik od účastníckeho).
export default function PartnerForm({
  t,
  levelNames,
  turnstileSiteKey,
}: {
  t: Dict["partners"];
  levelNames: string[];
  turnstileSiteKey?: string;
}) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      company: formData.get("company"),
      contactName: formData.get("contactName"),
      role: formData.get("role"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      interestLevel: formData.get("interestLevel"),
      budgetBand: formData.get("budgetBand"),
      message: formData.get("message"),
      website: formData.get("website"),
      turnstileToken: formData.get("cf-turnstile-response"),
      consent: formData.get("consent") === "yes",
    };

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? t.errorFailed);
      form.reset();
      setState("success");
      setMessage(t.success);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : t.errorFailed);
    }
  }

  return (
    <form className="interest-form partner-form" onSubmit={handleSubmit}>
      <p className="reserve-form-title">{t.formTitle}</p>
      <div className="form-grid">
        <label>
          <span>{t.companyLabel}</span>
          <input name="company" autoComplete="organization" required maxLength={160} />
        </label>
        <label>
          <span>{t.contactLabel}</span>
          <input name="contactName" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>{t.roleLabel}</span>
          <input name="role" autoComplete="organization-title" maxLength={120} />
        </label>
        <label>
          <span>{t.emailLabel}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label>
          <span>{t.phoneLabel}</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={60} />
        </label>
        <label>
          <span>{t.interestLabel}</span>
          <select name="interestLevel" defaultValue="">
            <option value="">{t.interestUndecided}</option>
            {levelNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>{t.budgetLabel}</span>
          <select name="budgetBand" defaultValue="">
            <option value="">{t.budgetUndecided}</option>
            {t.budgetBands.map((band) => (
              <option key={band} value={band}>{band}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-message">
        <span>{t.messageLabel}</span>
        <textarea name="message" rows={3} maxLength={1500} />
      </label>

      <label className="form-honeypot" aria-hidden="true">
        Web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="form-consent">
        <input name="consent" type="checkbox" value="yes" required />
        <span>{t.consent}</span>
      </label>

      <Turnstile siteKey={turnstileSiteKey} />

      <div className="form-submit-row">
        <button className="button button-brass" type="submit" disabled={state === "sending"}>
          {state === "sending" ? t.submitSending : t.submitIdle}
          <span aria-hidden="true">→</span>
        </button>
        <p className={`form-response ${state}`} role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  );
}
