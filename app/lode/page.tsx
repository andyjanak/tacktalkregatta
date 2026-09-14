import type { Metadata } from "next";
import BoatsPage from "@/app/BoatsPage";
import sk from "@/app/i18n/sk";
import { boatsAlternates, localeBoats } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: sk.boats.metaTitle },
  description: sk.boats.metaDescription,
  alternates: { canonical: localeBoats("sk"), languages: boatsAlternates },
  openGraph: {
    type: "website",
    locale: sk.meta.ogLocale,
    url: localeBoats("sk"),
    siteName: "Tack & Talk Regatta 2027",
    title: sk.boats.metaTitle,
    description: sk.boats.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: sk.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <BoatsPage dict={sk} locale="sk" />;
}
