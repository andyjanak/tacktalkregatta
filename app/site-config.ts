export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    "https://tacktalkregatta.janak-db1.workers.dev",
);

// Preview deployments stay out of search results until the final domain is live.
export const indexingEnabled =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const siteTitle =
  "Firemná regata v Chorvátsku 2027 | Tack & Talk";

export const siteDescription =
  "Sedem dní plachtenia a biznis programu v Dalmácii pre 20 firemných posádok. Tack & Talk Regatta, 25. 9. – 2. 10. 2027.";
