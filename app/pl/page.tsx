import type { Metadata } from "next";
import Landing from "../Landing";
import pl from "../i18n/pl";
import { languageAlternates } from "../i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: pl.meta.title },
  description: pl.meta.description,
  keywords: pl.meta.keywords,
  alternates: { canonical: "/pl", languages: languageAlternates },
  openGraph: {
    type: "website",
    locale: pl.meta.ogLocale,
    url: "/pl",
    siteName: "Tack & Talk Regatta 2027",
    title: pl.meta.title,
    description: pl.meta.description,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: pl.meta.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: pl.meta.title,
    description: pl.meta.description,
    images: ["/og-v2.jpg"],
  },
};

export default function HomePl() {
  return <Landing dict={pl} locale="pl" />;
}
