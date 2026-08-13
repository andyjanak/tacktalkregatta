"use client";

import { useEffect, useState } from "react";

const links = [
  ["Koncept", "#koncept"],
  ["Pre koho", "#pre-koho"],
  ["Trasa a program", "#trasa"],
  ["Časté otázky", "#faq"],
  ["Kontakt", "#kontakt"],
] as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className={`mobile-nav ${open ? "is-open" : ""}`}>
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobilne-menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span>Menu</span>
        <i aria-hidden="true" />
      </button>
      <nav id="mobilne-menu" aria-label="Mobilná navigácia" hidden={!open}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
