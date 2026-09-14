import regatta from "@/data/regatta.json";
import type { Dict } from "./i18n";

// Právne identifikátory organizátora a spoluorganizátora (IČO + sídlo).
// Hodnoty sú fakty z obchodného registra (regatta.json → organization),
// labely sú lokalizované cez dict. Zobrazuje sa v pätičke pre dôveryhodnosť.
export default function OrganizerLegal({ t }: { t: Dict["footer"] }) {
  const { organizer, co_organizer } = regatta.organization;
  return (
    <p className="footer-legal">
      <span>
        {organizer.name} · {t.regLabel} {organizer.ico} · {t.seatLabel}: {organizer.seat}
      </span>
      <span>
        {co_organizer.name} · {t.regLabel} {co_organizer.ico} · {t.seatLabel}: {co_organizer.seat}
      </span>
    </p>
  );
}
