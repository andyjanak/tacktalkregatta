import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = new URL("/og.png", `${protocol}://${host}`);

  return {
    title: {
      default: "Tack & Talk Regatta 2027",
      template: "%s | Tack & Talk Regatta 2027",
    },
    description:
      "Firemná plachtárska regata s biznis programom v chorvátskej Dalmácii.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      locale: "sk_SK",
      title: "Tack & Talk Regatta 2027",
      description: "Prevetraj svoj biznis. 25. 9. - 2. 10. 2027, Dalmácia.",
      images: [{ url: imageUrl, width: 1731, height: 909, alt: "Tack & Talk Regatta 2027" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tack & Talk Regatta 2027",
      description: "Prevetraj svoj biznis. 25. 9. - 2. 10. 2027, Dalmácia.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
