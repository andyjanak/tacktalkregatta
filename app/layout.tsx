import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import {
  indexingEnabled,
  siteDescription,
  siteTitle,
  siteUrl,
} from "./site-config";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: "%s | Tack & Talk Regatta 2027",
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  robots: {
    index: indexingEnabled,
    follow: indexingEnabled,
    googleBot: {
      index: indexingEnabled,
      follow: indexingEnabled,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "/",
    siteName: "Tack & Talk Regatta 2027",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-v2.png",
        width: 1200,
        height: 630,
        alt: "Tack & Talk Regatta 2027 — Svieži vietor v plachtách",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
