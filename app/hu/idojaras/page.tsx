import type { Metadata } from "next";
import WeatherPage from "@/app/WeatherPage";
import hu from "@/app/i18n/hu";
import { weatherAlternates } from "@/app/i18n";
import { getWeatherPayload } from "@/lib/weather/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: hu.weather.metaTitle },
  description: hu.weather.metaDescription,
  alternates: { canonical: "/hu/idojaras", languages: weatherAlternates },
  openGraph: {
    type: "website",
    locale: hu.meta.ogLocale,
    url: "/hu/idojaras",
    siteName: "Tack & Talk Regatta 2027",
    title: hu.weather.metaTitle,
    description: hu.weather.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hu.meta.ogImageAlt }],
  },
};

export default async function WeatherRoute() {
  const payload = await getWeatherPayload();
  return <WeatherPage dict={hu} locale="hu" payload={payload} />;
}
