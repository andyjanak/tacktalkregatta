"use client";

import { FormEvent, useState } from "react";
import Turnstile from "./Turnstile";
import type { Dict } from "./i18n";

type FormState = "idle" | "sending" | "success" | "error";

// Rezervačný formulár — hlavná konverzia. Po odoslaní zobrazí poradové číslo.
// Lokalizované texty potvrdzovacieho e-mailu posiela serveru (emailStrings).
export default function ReservationForm({
  t,
  turnstileSiteKey,
}: {
  t: Dict["reservation"];
  turnstileSiteKey?: string;
}) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [queueNumber, setQueueNumber] = useState<number | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      company: formData.get("company"),
      contactName: formData.get("contactName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      boatPreference: formData.get("boatPreference"),
      peopleCount: formData.get("peopleCount"),
      message: formData.get("message"),
      website: formData.get("website"),
      turnstileToken: formData.get("cf-turnstile-response"),
      consent: formData.get("consent") === "yes",
      emailStrings: {
        subject: t.emailSubject,
        heading: t.emailHeading,
        intro: t.emailIntro,
        numberLabel: t.emailNumberLabel,
        nextTitle: t.emailNextTitle,
        nextBody: t.emailNextBody,
        footer: t.emailFooter,
      },
    };

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        error?: string;
        queueNumber?: number | null;
      };
      if (!response.ok) throw new Error(result.error ?? t.errorFailed);

      form.reset();
      setQueueNumber(result.queueNumber ?? null);
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : t.errorFailed);
    }
  }

  if (state === "success") {
    return (
      <div className="reserve-success" role="status" aria-live="polite">
        <h3>{t.successTitle}</h3>
        {queueNumber != null ? (
          <p className="reserve-number">
            <span>{t.successNumberLabel}</span>
            <strong>#{String(queueNumber).padStart(3, "0")}</strong>
          </p>
        ) : null}
        <p className="reserve-success-note">{t.successNote}</p>
      </div>
    );
  }

  return (
    <form className="interest-form reserve-form" onSubmit={handleSubmit}>
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
          <span>{t.emailLabel}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label>
          <span>{t.phoneLabel}</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={60} />
        </label>
        <label>
          <span>{t.boatLabel}</span>
          <select name="boatPreference" defaultValue="undecided">
            <option value="undecided">{t.boatUndecided}</option>
            <option value="dufour_460">{t.boat460}</option>
            <option value="dufour_470">{t.boat470}</option>
          </select>
        </label>
        <label>
          <span>{t.peopleLabel}</span>
          <input name="peopleCount" type="number" min={1} max={50} inputMode="numeric" />
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
        {state === "error" ? (
          <p className="form-response error" role="status" aria-live="polite">{message}</p>
        ) : null}
      </div>
    </form>
  );
}
