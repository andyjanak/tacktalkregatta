import type { Metadata } from "next";
import ResultsPage from "@/app/ResultsPage";
import cs from "@/app/i18n/cs";
import { resultsAlternates, localeResults } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: cs.results.metaTitle },
  description: cs.results.metaDescription,
  alternates: { canonical: localeResults("cs"), languages: resultsAlternates },
  openGraph: {
    type: "website",
    locale: cs.meta.ogLocale,
    url: localeResults("cs"),
    siteName: "Tack & Talk Regatta 2027",
    title: cs.results.metaTitle,
    description: cs.results.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: cs.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <ResultsPage dict={cs} locale="cs" />;
}
