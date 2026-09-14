import type { Metadata } from "next";
import BoatsPage from "@/app/BoatsPage";
import hr from "@/app/i18n/hr";
import { boatsAlternates, localeBoats } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hr.boats.metaTitle },
  description: hr.boats.metaDescription,
  alternates: { canonical: localeBoats("hr"), languages: boatsAlternates },
  openGraph: {
    type: "website",
    locale: hr.meta.ogLocale,
    url: localeBoats("hr"),
    siteName: "Tack & Talk Regatta 2027",
    title: hr.boats.metaTitle,
    description: hr.boats.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hr.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <BoatsPage dict={hr} locale="hr" />;
}
