import type { MetadataRoute } from "next";
import regatta from "@/data/regatta.json";
import { siteUrl } from "./site-config";
import { locales, localeHome } from "./i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${regatta.generated}T12:00:00+02:00`);
  const languages = Object.fromEntries(
    locales.map((l) => [l, new URL(localeHome(l), siteUrl).toString()]),
  );

  return locales.map((l) => ({
    url: new URL(localeHome(l), siteUrl).toString(),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: l === "sk" ? 1 : 0.9,
    alternates: { languages },
  }));
}
