import type { Metadata } from "next";
import ResultsPage from "@/app/ResultsPage";
import de from "@/app/i18n/de";
import { resultsAlternates, localeResults } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: de.results.metaTitle },
  description: de.results.metaDescription,
  alternates: { canonical: localeResults("de"), languages: resultsAlternates },
  openGraph: {
    type: "website",
    locale: de.meta.ogLocale,
    url: localeResults("de"),
    siteName: "Tack & Talk Regatta 2027",
    title: de.results.metaTitle,
    description: de.results.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: de.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <ResultsPage dict={de} locale="de" />;
}
