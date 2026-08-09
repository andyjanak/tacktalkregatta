"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

export default function InterestForm() {
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
      message: formData.get("message"),
      website: formData.get("website"),
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
        throw new Error(result.error ?? "Dopyt sa nepodarilo odoslať.");
      }

      form.reset();
      setState("success");
      setMessage(result.message ?? "Ďakujeme. Dopyt sme prijali.");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Dopyt sa nepodarilo odoslať.",
      );
    }
  }

  return (
    <form className="interest-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Meno a priezvisko *</span>
          <input name="fullName" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>Firma *</span>
          <input name="company" autoComplete="organization" required maxLength={160} />
        </label>
        <label>
          <span>E-mail *</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label>
          <span>Telefón</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={60} />
        </label>
        <label>
          <span>Predpokladaný počet ľudí</span>
          <input name="peopleCount" type="number" min={1} max={50} inputMode="numeric" />
        </label>
        <label>
          <span>Máte kapitánsky preukaz? *</span>
          <select name="captainLicense" defaultValue="unknown" required>
            <option value="yes">Áno</option>
            <option value="no">Nie</option>
            <option value="unknown">Neviem</option>
          </select>
        </label>
      </div>

      <label className="form-message">
        <span>Otázka alebo poznámka</span>
        <textarea name="message" rows={4} maxLength={1500} />
      </label>

      <label className="form-honeypot" aria-hidden="true">
        Web
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="form-consent">
        <input name="consent" type="checkbox" value="yes" required />
        <span>
          Súhlasím, aby ma Tangreto s.r.o. kontaktovalo v súvislosti s prípravou
          Tack &amp; Talk Regatta 2027.
        </span>
      </label>

      <div className="form-submit-row">
        <button className="button button-brass" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Odosielam…" : "Chcem vedieť viac"}
          <span aria-hidden="true">→</span>
        </button>
        <p className={`form-response ${state}`} role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  );
}
