import type { Metadata } from "next";
import BoatsPage from "@/app/BoatsPage";
import en from "@/app/i18n/en";
import { boatsAlternates, localeBoats } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: en.boats.metaTitle },
  description: en.boats.metaDescription,
  alternates: { canonical: localeBoats("en"), languages: boatsAlternates },
  openGraph: {
    type: "website",
    locale: en.meta.ogLocale,
    url: localeBoats("en"),
    siteName: "Tack & Talk Regatta 2027",
    title: en.boats.metaTitle,
    description: en.boats.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: en.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <BoatsPage dict={en} locale="en" />;
}
