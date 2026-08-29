import type { Metadata } from "next";
import WeatherPage from "@/app/WeatherPage";
import pl from "@/app/i18n/pl";
import { weatherAlternates } from "@/app/i18n";
import { getWeatherPayload } from "@/lib/weather/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: pl.weather.metaTitle },
  description: pl.weather.metaDescription,
  alternates: { canonical: "/pl/pocasie", languages: weatherAlternates },
  openGraph: {
    type: "website",
    locale: pl.meta.ogLocale,
    url: "/pl/pocasie",
    siteName: "Tack & Talk Regatta 2027",
    title: pl.weather.metaTitle,
    description: pl.weather.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: pl.meta.ogImageAlt }],
  },
};

export default async function WeatherRoute() {
  const payload = await getWeatherPayload();
  return <WeatherPage dict={pl} locale="pl" payload={payload} />;
}
