import type { Metadata } from "next";
import WeatherPage from "@/app/WeatherPage";
import cs from "@/app/i18n/cs";
import { weatherAlternates } from "@/app/i18n";
import { getWeatherPayload } from "@/lib/weather/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: cs.weather.metaTitle },
  description: cs.weather.metaDescription,
  alternates: { canonical: "/cs/pocasie", languages: weatherAlternates },
  openGraph: {
    type: "website",
    locale: cs.meta.ogLocale,
    url: "/cs/pocasie",
    siteName: "Tack & Talk Regatta 2027",
    title: cs.weather.metaTitle,
    description: cs.weather.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: cs.meta.ogImageAlt }],
  },
};

export default async function WeatherRoute() {
  const payload = await getWeatherPayload();
  return <WeatherPage dict={cs} locale="cs" payload={payload} />;
}
