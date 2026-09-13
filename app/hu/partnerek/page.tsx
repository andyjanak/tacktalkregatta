import type { Metadata } from "next";
import PartnersPage from "@/app/PartnersPage";
import hu from "@/app/i18n/hu";
import { partnersAlternates, localePartners } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hu.partners.metaTitle },
  description: hu.partners.metaDescription,
  alternates: { canonical: localePartners("hu"), languages: partnersAlternates },
  openGraph: {
    type: "website",
    locale: hu.meta.ogLocale,
    url: localePartners("hu"),
    siteName: "Tack & Talk Regatta 2027",
    title: hu.partners.metaTitle,
    description: hu.partners.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hu.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <PartnersPage dict={hu} locale="hu" />;
}
