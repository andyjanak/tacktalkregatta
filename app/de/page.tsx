import type { Metadata } from "next";
import Landing from "../Landing";
import de from "../i18n/de";
import { languageAlternates } from "../i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: de.meta.title },
  description: de.meta.description,
  keywords: de.meta.keywords,
  alternates: { canonical: "/de", languages: languageAlternates },
  openGraph: {
    type: "website",
    locale: de.meta.ogLocale,
    url: "/de",
    siteName: "Tack & Talk Regatta 2027",
    title: de.meta.title,
    description: de.meta.description,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: de.meta.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: de.meta.title,
    description: de.meta.description,
    images: ["/og-v2.jpg"],
  },
};

export default function HomeDE() {
  return <Landing dict={de} locale="de" />;
}
