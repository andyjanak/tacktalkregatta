import type { Metadata } from "next";
import DocumentsPage from "@/app/DocumentsPage";
import hu from "@/app/i18n/hu";
import { documentsAlternates, localeDocuments } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hu.documents.metaTitle },
  description: hu.documents.metaDescription,
  alternates: { canonical: localeDocuments("hu"), languages: documentsAlternates },
  openGraph: {
    type: "website",
    locale: hu.meta.ogLocale,
    url: localeDocuments("hu"),
    siteName: "Tack & Talk Regatta 2027",
    title: hu.documents.metaTitle,
    description: hu.documents.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hu.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <DocumentsPage dict={hu} locale="hu" />;
}
