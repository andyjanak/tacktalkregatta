import type { Metadata } from "next";
import BoatsPage from "@/app/BoatsPage";
import de from "@/app/i18n/de";
import { boatsAlternates, localeBoats } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: de.boats.metaTitle },
  description: de.boats.metaDescription,
  alternates: { canonical: localeBoats("de"), languages: boatsAlternates },
  openGraph: {
    type: "website",
    locale: de.meta.ogLocale,
    url: localeBoats("de"),
    siteName: "Tack & Talk Regatta 2027",
    title: de.boats.metaTitle,
    description: de.boats.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: de.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <BoatsPage dict={de} locale="de" />;
}
