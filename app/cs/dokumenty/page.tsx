import type { Metadata } from "next";
import DocumentsPage from "@/app/DocumentsPage";
import cs from "@/app/i18n/cs";
import { documentsAlternates, localeDocuments } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: cs.documents.metaTitle },
  description: cs.documents.metaDescription,
  alternates: { canonical: localeDocuments("cs"), languages: documentsAlternates },
  openGraph: {
    type: "website",
    locale: cs.meta.ogLocale,
    url: localeDocuments("cs"),
    siteName: "Tack & Talk Regatta 2027",
    title: cs.documents.metaTitle,
    description: cs.documents.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: cs.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <DocumentsPage dict={cs} locale="cs" />;
}
