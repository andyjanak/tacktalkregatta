import type { Metadata } from "next";
import DocumentsPage from "@/app/DocumentsPage";
import hr from "@/app/i18n/hr";
import { documentsAlternates, localeDocuments } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hr.documents.metaTitle },
  description: hr.documents.metaDescription,
  alternates: { canonical: localeDocuments("hr"), languages: documentsAlternates },
  openGraph: {
    type: "website",
    locale: hr.meta.ogLocale,
    url: localeDocuments("hr"),
    siteName: "Tack & Talk Regatta 2027",
    title: hr.documents.metaTitle,
    description: hr.documents.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hr.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <DocumentsPage dict={hr} locale="hr" />;
}
