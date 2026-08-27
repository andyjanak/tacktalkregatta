"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Cloudflare Turnstile widget. Renderuje sa iba ak je zadaný `siteKey`
 * (t. j. NEXT_PUBLIC_TURNSTILE_SITE_KEY je nastavený). Widget sám vloží
 * skryté pole `cf-turnstile-response`, ktoré server overí.
 */
export default function Turnstile({ siteKey }: { siteKey?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey) return;
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [siteKey]);

  if (!siteKey) return null;

  return (
    <div
      ref={ref}
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-theme="light"
      style={{ marginBottom: "8px" }}
    />
  );
}
