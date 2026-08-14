export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    "https://tacktalkregatta.janak-db1.workers.dev",
);

// Preview deployments stay out of search results until the final domain is live.
export const indexingEnabled =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const siteTitle =
  "Tack & Talk Regatta 2027 | Svieži vietor v plachtách";

export const siteDescription =
  "Štyri súťažné dni, deväť rozjázd a päť nocí pre 20 firemných posádok. Tack & Talk Regatta, Rogoznica, 25. – 30. 9. 2027.";
