import type { Metadata } from "next";
import BoatsPage from "@/app/BoatsPage";
import cs from "@/app/i18n/cs";
import { boatsAlternates, localeBoats } from "@/app/i18n";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: cs.boats.metaTitle },
  description: cs.boats.metaDescription,
  alternates: { canonical: localeBoats("cs"), languages: boatsAlternates },
  openGraph: {
    type: "website",
    locale: cs.meta.ogLocale,
    url: localeBoats("cs"),
    siteName: "Tack & Talk Regatta 2027",
    title: cs.boats.metaTitle,
    description: cs.boats.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: cs.meta.ogImageAlt }],
  },
};

export default function Page() {
  return <BoatsPage dict={cs} locale="cs" />;
}
