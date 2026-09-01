import type { Metadata } from "next";
import DocumentsPage from "@/app/DocumentsPage";
import pl from "@/app/i18n/pl";
import { documentsAlternates, localeDocuments } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: pl.documents.metaTitle },
  description: pl.documents.metaDescription,
  alternates: { canonical: localeDocuments("pl"), languages: documentsAlternates },
  openGraph: {
    type: "website",
    locale: pl.meta.ogLocale,
    url: localeDocuments("pl"),
    siteName: "Tack & Talk Regatta 2027",
    title: pl.documents.metaTitle,
    description: pl.documents.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: pl.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <DocumentsPage dict={pl} locale="pl" />;
}
