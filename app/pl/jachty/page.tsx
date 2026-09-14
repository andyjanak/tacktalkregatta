import type { Metadata } from "next";
import BoatsPage from "@/app/BoatsPage";
import pl from "@/app/i18n/pl";
import { boatsAlternates, localeBoats } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: pl.boats.metaTitle },
  description: pl.boats.metaDescription,
  alternates: { canonical: localeBoats("pl"), languages: boatsAlternates },
  openGraph: {
    type: "website",
    locale: pl.meta.ogLocale,
    url: localeBoats("pl"),
    siteName: "Tack & Talk Regatta 2027",
    title: pl.boats.metaTitle,
    description: pl.boats.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: pl.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <BoatsPage dict={pl} locale="pl" />;
}
