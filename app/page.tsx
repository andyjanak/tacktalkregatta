import type { Metadata } from "next";
import Landing from "./Landing";
import sk from "./i18n/sk";
import { languageAlternates } from "./i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: sk.meta.title },
  description: sk.meta.description,
  keywords: sk.meta.keywords,
  alternates: { canonical: "/", languages: languageAlternates },
  openGraph: {
    type: "website",
    locale: sk.meta.ogLocale,
    url: "/",
    siteName: "Tack & Talk Regatta 2027",
    title: sk.meta.title,
    description: sk.meta.description,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: sk.meta.ogImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: sk.meta.title,
    description: sk.meta.description,
    images: ["/og-v2.jpg"],
  },
};

export default function Home() {
  return <Landing dict={sk} locale="sk" />;
}
