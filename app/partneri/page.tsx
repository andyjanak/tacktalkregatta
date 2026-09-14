import type { Metadata } from "next";
import PartnersPage from "@/app/PartnersPage";
import sk from "@/app/i18n/sk";
import { partnersAlternates, localePartners } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: sk.partners.metaTitle },
  description: sk.partners.metaDescription,
  alternates: { canonical: localePartners("sk"), languages: partnersAlternates },
  openGraph: {
    type: "website",
    locale: sk.meta.ogLocale,
    url: localePartners("sk"),
    siteName: "Tack & Talk Regatta 2027",
    title: sk.partners.metaTitle,
    description: sk.partners.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: sk.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <PartnersPage dict={sk} locale="sk" />;
}
