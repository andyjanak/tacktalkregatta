import type { Metadata } from "next";
import Landing from "../Landing";
import cs from "../i18n/cs";
import { languageAlternates } from "../i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: cs.meta.title },
  description: cs.meta.description,
  keywords: cs.meta.keywords,
  alternates: { canonical: "/cs", languages: languageAlternates },
  openGraph: {
    type: "website",
    locale: cs.meta.ogLocale,
    url: "/cs",
    siteName: "Tack & Talk Regatta 2027",
    title: cs.meta.title,
    description: cs.meta.description,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: cs.meta.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: cs.meta.title,
    description: cs.meta.description,
    images: ["/og-v2.jpg"],
  },
};

export default function HomeCS() {
  return <Landing dict={cs} locale="cs" />;
}
