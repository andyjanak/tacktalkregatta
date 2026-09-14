import type { Metadata } from "next";
import PartnersPage from "@/app/PartnersPage";
import pl from "@/app/i18n/pl";
import { partnersAlternates, localePartners } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: pl.partners.metaTitle },
  description: pl.partners.metaDescription,
  alternates: { canonical: localePartners("pl"), languages: partnersAlternates },
  openGraph: {
    type: "website",
    locale: pl.meta.ogLocale,
    url: localePartners("pl"),
    siteName: "Tack & Talk Regatta 2027",
    title: pl.partners.metaTitle,
    description: pl.partners.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: pl.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <PartnersPage dict={pl} locale="pl" />;
}
