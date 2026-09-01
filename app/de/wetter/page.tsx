import type { Metadata } from "next";
import WeatherPage from "@/app/WeatherPage";
import de from "@/app/i18n/de";
import { weatherAlternates } from "@/app/i18n";
import { getWeatherPayload } from "@/lib/weather/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: de.weather.metaTitle },
  description: de.weather.metaDescription,
  alternates: { canonical: "/de/wetter", languages: weatherAlternates },
  openGraph: {
    type: "website",
    locale: de.meta.ogLocale,
    url: "/de/wetter",
    siteName: "Tack & Talk Regatta 2027",
    title: de.weather.metaTitle,
    description: de.weather.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: de.meta.ogImageAlt }],
  },
};

export default async function WeatherRoute() {
  const payload = await getWeatherPayload();
  return <WeatherPage dict={de} locale="de" payload={payload} />;
}
