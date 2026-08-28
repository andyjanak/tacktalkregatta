import type { Metadata } from "next";
import Landing from "../Landing";
import hr from "../i18n/hr";
import { languageAlternates } from "../i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hr.meta.title },
  description: hr.meta.description,
  keywords: hr.meta.keywords,
  alternates: { canonical: "/hr", languages: languageAlternates },
  openGraph: {
    type: "website",
    locale: hr.meta.ogLocale,
    url: "/hr",
    siteName: "Tack & Talk Regatta 2027",
    title: hr.meta.title,
    description: hr.meta.description,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hr.meta.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: hr.meta.title,
    description: hr.meta.description,
    images: ["/og-v2.jpg"],
  },
};

export default function HomeHR() {
  return <Landing dict={hr} locale="hr" />;
}
