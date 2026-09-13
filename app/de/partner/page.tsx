import type { Metadata } from "next";
import PartnersPage from "@/app/PartnersPage";
import de from "@/app/i18n/de";
import { partnersAlternates, localePartners } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: de.partners.metaTitle },
  description: de.partners.metaDescription,
  alternates: { canonical: localePartners("de"), languages: partnersAlternates },
  openGraph: {
    type: "website",
    locale: de.meta.ogLocale,
    url: localePartners("de"),
    siteName: "Tack & Talk Regatta 2027",
    title: de.partners.metaTitle,
    description: de.partners.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: de.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <PartnersPage dict={de} locale="de" />;
}
