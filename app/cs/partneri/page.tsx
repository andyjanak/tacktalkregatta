import type { Metadata } from "next";
import PartnersPage from "@/app/PartnersPage";
import cs from "@/app/i18n/cs";
import { partnersAlternates, localePartners } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: cs.partners.metaTitle },
  description: cs.partners.metaDescription,
  alternates: { canonical: localePartners("cs"), languages: partnersAlternates },
  openGraph: {
    type: "website",
    locale: cs.meta.ogLocale,
    url: localePartners("cs"),
    siteName: "Tack & Talk Regatta 2027",
    title: cs.partners.metaTitle,
    description: cs.partners.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: cs.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <PartnersPage dict={cs} locale="cs" />;
}
