import type { Metadata } from "next";
import BoatsPage from "@/app/BoatsPage";
import hu from "@/app/i18n/hu";
import { boatsAlternates, localeBoats } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: hu.boats.metaTitle },
  description: hu.boats.metaDescription,
  alternates: { canonical: localeBoats("hu"), languages: boatsAlternates },
  openGraph: {
    type: "website",
    locale: hu.meta.ogLocale,
    url: localeBoats("hu"),
    siteName: "Tack & Talk Regatta 2027",
    title: hu.boats.metaTitle,
    description: hu.boats.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hu.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <BoatsPage dict={hu} locale="hu" />;
}
