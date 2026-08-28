import type { Metadata } from "next";
import Landing from "../Landing";
import hu from "../i18n/hu";
import { languageAlternates } from "../i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hu.meta.title },
  description: hu.meta.description,
  keywords: hu.meta.keywords,
  alternates: { canonical: "/hu", languages: languageAlternates },
  openGraph: {
    type: "website",
    locale: hu.meta.ogLocale,
    url: "/hu",
    siteName: "Tack & Talk Regatta 2027",
    title: hu.meta.title,
    description: hu.meta.description,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hu.meta.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: hu.meta.title,
    description: hu.meta.description,
    images: ["/og-v2.jpg"],
  },
};

export default function HomeHU() {
  return <Landing dict={hu} locale="hu" />;
}
