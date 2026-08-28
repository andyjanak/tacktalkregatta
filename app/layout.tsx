import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { indexingEnabled, siteTitle, siteUrl } from "./site-config";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// Základné metadáta pre celý web. Jazykovo špecifické polia (title, description,
// keywords, canonical, hreflang, OpenGraph) si nastavuje každá stránka sama.
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: "%s | Tack & Talk Regatta 2027",
  },
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk">
      <body className={poppins.variable}>
        {children}
        {/* Cloudflare Web Analytics – bez cookies, verejný token. */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "53e503eb13654ac7b1287582a5a4d027"}'
        />
      </body>
    </html>
  );
}
