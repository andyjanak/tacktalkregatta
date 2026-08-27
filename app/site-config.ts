export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tacktalkregatta.com",
);

// Preview deployments stay out of search results until the final domain is live.
export const indexingEnabled =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const siteTitle =
  "Tack & Talk Regatta 2027 – firemná regata v Chorvátsku";

export const siteDescription =
  "Firemná regata v Chorvátsku pre 20 posádok – štyri súťažné dni na vode a biznis program na brehu. Tack & Talk Regatta 2027, Rogoznica, 25. – 30. 9. 2027.";

// Cielené kľúčové slová pre slovenský trh (nie sú rozhodujúce pre Google,
// ale neškodia a pomáhajú niektorým vyhľadávačom a interným nástrojom).
export const siteKeywords = [
  "firemná regata",
  "biznis regata",
  "firemný teambuilding na lodi",
  "firemná plavba",
  "regata Chorvátsko",
  "korporátne podujatie",
  "plachtenie pre firmy",
  "teambuilding Chorvátsko",
];
