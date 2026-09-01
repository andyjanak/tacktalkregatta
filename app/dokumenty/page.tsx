import type { Metadata } from "next";
import DocumentsPage from "@/app/DocumentsPage";
import sk from "@/app/i18n/sk";
import { documentsAlternates, localeDocuments } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: sk.documents.metaTitle },
  description: sk.documents.metaDescription,
  alternates: { canonical: localeDocuments("sk"), languages: documentsAlternates },
  openGraph: {
    type: "website",
    locale: sk.meta.ogLocale,
    url: localeDocuments("sk"),
    siteName: "Tack & Talk Regatta 2027",
    title: sk.documents.metaTitle,
    description: sk.documents.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: sk.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <DocumentsPage dict={sk} locale="sk" />;
}
