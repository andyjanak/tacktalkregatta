import type { MetadataRoute } from "next";
import regatta from "@/data/regatta.json";
import { siteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.toString(),
      lastModified: new Date(`${regatta.generated}T12:00:00+02:00`),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
