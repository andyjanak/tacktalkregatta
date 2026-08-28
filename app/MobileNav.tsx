"use client";

import { useEffect, useState } from "react";
import type { Dict } from "./i18n";

export default function MobileNav({ nav }: { nav: Dict["nav"] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const links: Array<[string, string]> = [
    [nav.koncept, "#koncept"],
    [nav.preKoho, "#pre-koho"],
    [nav.trasa, "#trasa"],
    [nav.faq, "#faq"],
    [nav.kontakt, "#kontakt"],
  ];

  return (
    <div className={`mobile-nav ${open ? "is-open" : ""}`}>
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobilne-menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{nav.menu}</span>
        <i aria-hidden="true" />
      </button>
      <nav id="mobilne-menu" aria-label={nav.mobileAria} hidden={!open}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
