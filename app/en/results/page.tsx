import type { Metadata } from "next";
import ResultsPage from "@/app/ResultsPage";
import en from "@/app/i18n/en";
import { resultsAlternates, localeResults } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: en.results.metaTitle },
  description: en.results.metaDescription,
  alternates: { canonical: localeResults("en"), languages: resultsAlternates },
  openGraph: {
    type: "website",
    locale: en.meta.ogLocale,
    url: localeResults("en"),
    siteName: "Tack & Talk Regatta 2027",
    title: en.results.metaTitle,
    description: en.results.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: en.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <ResultsPage dict={en} locale="en" />;
}
