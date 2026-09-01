import type { Metadata } from "next";
import WeatherPage from "@/app/WeatherPage";
import en from "@/app/i18n/en";
import { weatherAlternates } from "@/app/i18n";
import { getWeatherPayload } from "@/lib/weather/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: en.weather.metaTitle },
  description: en.weather.metaDescription,
  alternates: { canonical: "/en/weather", languages: weatherAlternates },
  openGraph: {
    type: "website",
    locale: en.meta.ogLocale,
    url: "/en/weather",
    siteName: "Tack & Talk Regatta 2027",
    title: en.weather.metaTitle,
    description: en.weather.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: en.meta.ogImageAlt }],
  },
};

export default async function WeatherRoute() {
  const payload = await getWeatherPayload();
  return <WeatherPage dict={en} locale="en" payload={payload} />;
}
