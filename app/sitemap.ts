import type { MetadataRoute } from "next";
import regatta from "@/data/regatta.json";
import { siteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${regatta.generated}T12:00:00+02:00`);
  const home = new URL("/", siteUrl).toString();
  const en = new URL("/en", siteUrl).toString();
  const languages = { sk: home, en };

  return [
    {
      url: home,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: en,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
