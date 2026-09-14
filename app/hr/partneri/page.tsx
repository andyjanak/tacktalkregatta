import type { Metadata } from "next";
import PartnersPage from "@/app/PartnersPage";
import hr from "@/app/i18n/hr";
import { partnersAlternates, localePartners } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hr.partners.metaTitle },
  description: hr.partners.metaDescription,
  alternates: { canonical: localePartners("hr"), languages: partnersAlternates },
  openGraph: {
    type: "website",
    locale: hr.meta.ogLocale,
    url: localePartners("hr"),
    siteName: "Tack & Talk Regatta 2027",
    title: hr.partners.metaTitle,
    description: hr.partners.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hr.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <PartnersPage dict={hr} locale="hr" />;
}
