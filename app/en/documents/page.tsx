import type { Metadata } from "next";
import DocumentsPage from "@/app/DocumentsPage";
import en from "@/app/i18n/en";
import { documentsAlternates, localeDocuments } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: en.documents.metaTitle },
  description: en.documents.metaDescription,
  alternates: { canonical: localeDocuments("en"), languages: documentsAlternates },
  openGraph: {
    type: "website",
    locale: en.meta.ogLocale,
    url: localeDocuments("en"),
    siteName: "Tack & Talk Regatta 2027",
    title: en.documents.metaTitle,
    description: en.documents.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: en.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <DocumentsPage dict={en} locale="en" />;
}
