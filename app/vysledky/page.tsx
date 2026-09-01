import type { Metadata } from "next";
import ResultsPage from "@/app/ResultsPage";
import sk from "@/app/i18n/sk";
import { resultsAlternates, localeResults } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: sk.results.metaTitle },
  description: sk.results.metaDescription,
  alternates: { canonical: localeResults("sk"), languages: resultsAlternates },
  openGraph: {
    type: "website",
    locale: sk.meta.ogLocale,
    url: localeResults("sk"),
    siteName: "Tack & Talk Regatta 2027",
    title: sk.results.metaTitle,
    description: sk.results.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: sk.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <ResultsPage dict={sk} locale="sk" />;
}
