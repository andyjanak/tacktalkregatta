"use client";

import { FormEvent, useState } from "react";
import Turnstile from "./Turnstile";
import type { Dict } from "./i18n";

type FormState = "idle" | "sending" | "success" | "error";

export default function InterestForm({
  t,
  turnstileSiteKey,
}: {
  t: Dict["form"];
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
      fullName: formData.get("fullName"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      peopleCount: formData.get("peopleCount"),
      captainLicense: formData.get("captainLicense"),
      boatInterest: formData.get("boatInterest"),
      message: formData.get("message"),
      website: formData.get("website"),
      turnstileToken: formData.get("cf-turnstile-response"),
      consent: formData.get("consent") === "yes",
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error ?? t.errorFailed);
      }

      form.reset();
      setState("success");
      setMessage(t.success);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : t.errorFailed);
    }
  }

  return (
    <form className="interest-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>{t.fullName}</span>
          <input name="fullName" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>{t.company}</span>
          <input name="company" autoComplete="organization" required maxLength={160} />
        </label>
        <label>
          <span>{t.email}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label>
          <span>{t.phone}</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={60} />
        </label>
        <label>
          <span>{t.people}</span>
          <input name="peopleCount" type="number" min={1} max={50} inputMode="numeric" />
        </label>
        <label>
          <span>{t.licenseLabel}</span>
          <select name="captainLicense" defaultValue="unknown" required>
            <option value="yes">{t.licenseYes}</option>
            <option value="no">{t.licenseNo}</option>
            <option value="unknown">{t.licenseUnknown}</option>
          </select>
        </label>
        <label>
          <span>{t.boatLabel}</span>
          <select name="boatInterest" defaultValue="undecided">
            <option value="undecided">{t.boatUndecided}</option>
            <option value="dufour_460">Dufour 460</option>
            <option value="dufour_470">Dufour 470</option>
          </select>
        </label>
      </div>

      <label className="form-message">
        <span>{t.message}</span>
        <textarea name="message" rows={4} maxLength={1500} />
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
