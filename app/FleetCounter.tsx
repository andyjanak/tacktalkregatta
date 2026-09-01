import regatta from "@/data/regatta.json";

// Počítadlo obsadenosti flotily. Za feature flagom (fleet_occupancy.enabled),
// predvolene vypnuté — zapne sa až po podpise charterovej zmluvy, inak by to
// bol sľub kapacity, ktorú nemáme.
export default function FleetCounter({
  eyebrow,
  label,
}: {
  eyebrow: string;
  label: string;
}) {
  const f = regatta.fleet_occupancy;
  if (!f || !f.enabled) return null;

  return (
    <div className="fleet-counter" role="note">
      <p className="fleet-eyebrow">{eyebrow}</p>
      <p className="fleet-count">
        <strong>{f.booked}</strong> <span>/ {f.total}</span>
      </p>
      <p className="fleet-label">{label}</p>
    </div>
  );
}
