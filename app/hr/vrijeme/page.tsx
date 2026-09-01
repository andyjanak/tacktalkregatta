import type { Metadata } from "next";
import WeatherPage from "@/app/WeatherPage";
import hr from "@/app/i18n/hr";
import { weatherAlternates } from "@/app/i18n";
import { getWeatherPayload } from "@/lib/weather/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: hr.weather.metaTitle },
  description: hr.weather.metaDescription,
  alternates: { canonical: "/hr/vrijeme", languages: weatherAlternates },
  openGraph: {
    type: "website",
    locale: hr.meta.ogLocale,
    url: "/hr/vrijeme",
    siteName: "Tack & Talk Regatta 2027",
    title: hr.weather.metaTitle,
    description: hr.weather.metaDescription,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: hr.meta.ogImageAlt }],
  },
};

export default async function WeatherRoute() {
  const payload = await getWeatherPayload();
  return <WeatherPage dict={hr} locale="hr" payload={payload} />;
}
