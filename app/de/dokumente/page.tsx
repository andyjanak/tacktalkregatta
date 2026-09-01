import type { Metadata } from "next";
import DocumentsPage from "@/app/DocumentsPage";
import de from "@/app/i18n/de";
import { documentsAlternates, localeDocuments } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: de.documents.metaTitle },
  description: de.documents.metaDescription,
  alternates: { canonical: localeDocuments("de"), languages: documentsAlternates },
  openGraph: {
    type: "website",
    locale: de.meta.ogLocale,
    url: localeDocuments("de"),
    siteName: "Tack & Talk Regatta 2027",
    title: de.documents.metaTitle,
    description: de.documents.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: de.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <DocumentsPage dict={de} locale="de" />;
}
