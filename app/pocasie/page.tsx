import type { Metadata } from "next";
import WeatherPage from "@/app/WeatherPage";
import sk from "@/app/i18n/sk";
import { weatherAlternates } from "@/app/i18n";
import { getWeatherPayload } from "@/lib/weather/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: sk.weather.metaTitle },
  description: sk.weather.metaDescription,
  alternates: { canonical: "/pocasie", languages: weatherAlternates },
  openGraph: {
    type: "website",
    locale: sk.meta.ogLocale,
    url: "/pocasie",
    siteName: "Tack & Talk Regatta 2027",
    title: sk.weather.metaTitle,
    description: sk.weather.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: sk.meta.ogImageAlt }],
  },
};

export default async function WeatherRoute() {
  const payload = await getWeatherPayload();
  return <WeatherPage dict={sk} locale="sk" payload={payload} />;
}
