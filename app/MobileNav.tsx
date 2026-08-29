"use client";

import { useEffect, useState } from "react";
import type { Dict } from "./i18n";

export default function MobileNav({
  nav,
  homePrefix = "",
  weatherHref,
}: {
  nav: Dict["nav"];
  // Predpona pre odkazy na sekcie domovskej stránky (prázdna na domovskej,
  // cesta domov na iných stránkach ako /pocasie).
  homePrefix?: string;
  // Odkaz na stránku počasia; ak je zadaný, pridá sa do menu.
  weatherHref?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const links: Array<[string, string]> = [
    [nav.koncept, `${homePrefix}#koncept`],
    [nav.preKoho, `${homePrefix}#pre-koho`],
    [nav.trasa, `${homePrefix}#trasa`],
    ...(weatherHref
      ? ([[nav.pocasie, weatherHref]] as Array<[string, string]>)
      : []),
    [nav.faq, `${homePrefix}#faq`],
    [nav.kontakt, `${homePrefix}#kontakt`],
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
