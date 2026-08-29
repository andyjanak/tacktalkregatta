"use client";

import { useState } from "react";

// Admin tlačidlo na manuálne naplnenie dát počasia (bez čakania na cron).
// Spustí klimatológiu aj predpoveď pre všetky body trasy.
export default function AdminWeatherButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function run() {
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/admin/weather", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ job: "all" }),
      });
      const data = (await res.json()) as {
        error?: string;
        climatology?: { ok: number; failed: number };
        forecast?: { ok: number; failed: number };
      };
      if (!res.ok) throw new Error(data.error || "Chyba");
      setState("done");
      setMessage(
        `Hotovo — predpoveď ${data.forecast?.ok ?? 0}/4, klimatológia ${data.climatology?.ok ?? 0}/4`,
      );
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Chyba");
    }
  }

  return (
    <span className="admin-weather" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button
        type="button"
        onClick={run}
        disabled={state === "loading"}
        title="Stiahne predpoveď a prepočíta klimatológiu pre stránku /pocasie"
      >
        {state === "loading" ? "Napĺňam počasie…" : "Naplniť počasie"}
      </button>
      {message ? (
        <span
          style={{
            fontSize: 12,
            color: state === "error" ? "#b1332f" : "#1f6b4a",
          }}
        >
          {message}
        </span>
      ) : null}
    </span>
  );
}
