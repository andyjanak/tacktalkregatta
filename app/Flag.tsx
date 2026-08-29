import type { ReactElement } from "react";
import type { Locale } from "./i18n";

// Malé inline SVG vlajky (viewBox 21×15) pre prepínač jazykov.
// Zámerne nie emoji: vlajkové emoji sa na Windowse zobrazia len ako
// dvojpísmenový kód, SVG vyzerá rovnako na všetkých platformách.
const flags: Record<Locale, ReactElement> = {
  sk: (
    <>
      <rect width="21" height="5" fill="#fff" />
      <rect y="5" width="21" height="5" fill="#0b4ea2" />
      <rect y="10" width="21" height="5" fill="#ee1c25" />
      {/* zjednodušený znak (červený štít s bielym krížom) */}
      <path d="M3 3.2h4.4v4.3c0 2-1 3.4-2.2 4-1.2-.6-2.2-2-2.2-4z" fill="#ee1c25" stroke="#fff" strokeWidth=".5" />
      <path d="M4.8 4.2h.4v1.1h1v.4h-1v1h1.2v.4H5.2v1.5h-.4V7.5H3.6v-.4h1.2v-1h-1v-.4h1z" fill="#fff" />
    </>
  ),
  en: (
    <>
      <rect width="21" height="15" fill="#012169" />
      <path d="M0 0 21 15M21 0 0 15" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 21 15M21 0 0 15" stroke="#c8102e" strokeWidth="1.4" />
      <path d="M10.5 0V15M0 7.5H21" stroke="#fff" strokeWidth="4" />
      <path d="M10.5 0V15M0 7.5H21" stroke="#c8102e" strokeWidth="2.2" />
    </>
  ),
  cs: (
    <>
      <rect width="21" height="7.5" fill="#fff" />
      <rect y="7.5" width="21" height="7.5" fill="#d7141a" />
      <path d="M0 0 10.5 7.5 0 15z" fill="#11457e" />
    </>
  ),
  de: (
    <>
      <rect width="21" height="5" fill="#000" />
      <rect y="5" width="21" height="5" fill="#d00" />
      <rect y="10" width="21" height="5" fill="#ffce00" />
    </>
  ),
  hu: (
    <>
      <rect width="21" height="5" fill="#ce2939" />
      <rect y="5" width="21" height="5" fill="#fff" />
      <rect y="10" width="21" height="5" fill="#477050" />
    </>
  ),
  hr: (
    <>
      <rect width="21" height="5" fill="#ff0000" />
      <rect y="5" width="21" height="5" fill="#fff" />
      <rect y="10" width="21" height="5" fill="#171796" />
      {/* zjednodušená šachovnica */}
      <g fill="#ff0000">
        <rect x="8.5" y="5" width="1.35" height="1.7" />
        <rect x="11.2" y="5" width="1.35" height="1.7" />
        <rect x="9.85" y="6.7" width="1.35" height="1.7" />
        <rect x="8.5" y="8.4" width="1.35" height="1.6" />
        <rect x="11.2" y="8.4" width="1.35" height="1.6" />
      </g>
    </>
  ),
};

// Jedna vlajka pre daný jazyk.
export default function Flag({ locale }: { locale: Locale }) {
  return (
    <svg className="lang-flag" viewBox="0 0 21 15" aria-hidden="true">
      {flags[locale]}
    </svg>
  );
}
