import type { Metadata } from "next";
import PartnersPage from "@/app/PartnersPage";
import en from "@/app/i18n/en";
import { partnersAlternates, localePartners } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: en.partners.metaTitle },
  description: en.partners.metaDescription,
  alternates: { canonical: localePartners("en"), languages: partnersAlternates },
  openGraph: {
    type: "website",
    locale: en.meta.ogLocale,
    url: localePartners("en"),
    siteName: "Tack & Talk Regatta 2027",
    title: en.partners.metaTitle,
    description: en.partners.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: en.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <PartnersPage dict={en} locale="en" />;
}
