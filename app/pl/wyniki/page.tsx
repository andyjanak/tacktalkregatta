import type { Metadata } from "next";
import ResultsPage from "@/app/ResultsPage";
import pl from "@/app/i18n/pl";
import { resultsAlternates, localeResults } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: pl.results.metaTitle },
  description: pl.results.metaDescription,
  alternates: { canonical: localeResults("pl"), languages: resultsAlternates },
  openGraph: {
    type: "website",
    locale: pl.meta.ogLocale,
    url: localeResults("pl"),
    siteName: "Tack & Talk Regatta 2027",
    title: pl.results.metaTitle,
    description: pl.results.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: pl.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <ResultsPage dict={pl} locale="pl" />;
}
