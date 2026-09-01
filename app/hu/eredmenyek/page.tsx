import type { Metadata } from "next";
import ResultsPage from "@/app/ResultsPage";
import hu from "@/app/i18n/hu";
import { resultsAlternates, localeResults } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hu.results.metaTitle },
  description: hu.results.metaDescription,
  alternates: { canonical: localeResults("hu"), languages: resultsAlternates },
  openGraph: {
    type: "website",
    locale: hu.meta.ogLocale,
    url: localeResults("hu"),
    siteName: "Tack & Talk Regatta 2027",
    title: hu.results.metaTitle,
    description: hu.results.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hu.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <ResultsPage dict={hu} locale="hu" />;
}
