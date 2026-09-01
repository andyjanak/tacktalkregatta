import type { Metadata } from "next";
import ResultsPage from "@/app/ResultsPage";
import hr from "@/app/i18n/hr";
import { resultsAlternates, localeResults } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hr.results.metaTitle },
  description: hr.results.metaDescription,
  alternates: { canonical: localeResults("hr"), languages: resultsAlternates },
  openGraph: {
    type: "website",
    locale: hr.meta.ogLocale,
    url: localeResults("hr"),
    siteName: "Tack & Talk Regatta 2027",
    title: hr.results.metaTitle,
    description: hr.results.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hr.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <ResultsPage dict={hr} locale="hr" />;
}
