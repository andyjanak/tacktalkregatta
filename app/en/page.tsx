import type { Metadata } from "next";
import Landing from "../Landing";
import en from "../i18n/en";
import { languageAlternates } from "../i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: en.meta.title },
  description: en.meta.description,
  keywords: en.meta.keywords,
  alternates: { canonical: "/en", languages: languageAlternates },
  openGraph: {
    type: "website",
    locale: en.meta.ogLocale,
    url: "/en",
    siteName: "Tack & Talk Regatta 2027",
    title: en.meta.title,
    description: en.meta.description,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: en.meta.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: en.meta.title,
    description: en.meta.description,
    images: ["/og-v2.jpg"],
  },
};

export default function HomeEn() {
  return <Landing dict={en} locale="en" />;
}
