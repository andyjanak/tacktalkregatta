"use client";

import { useEffect, useState } from "react";
import { locales, localeHome, type Dict, type Locale } from "./i18n";

export default function MobileNav({
  nav,
  locale,
  langAria,
}: {
  nav: Dict["nav"];
  locale: Locale;
  langAria: string;
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
        <div className="mobile-lang" role="group" aria-label={langAria}>
          {locales.map((l) => (
            <a
              key={l}
              href={`${localeHome(l)}?lang=${l}`}
              hrefLang={l}
              className={l === locale ? "is-active" : ""}
              aria-current={l === locale ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
