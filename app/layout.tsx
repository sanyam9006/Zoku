import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZOKU 族 — Find Your Tribe in Every City",
  description: "ZOKU helps students and working professionals who relocate to a new city find verified hostels, gyms, sports clubs, events, and their tribe — all in one place.",
  keywords: "hostels, PG, gyms, sports clubs, events, community, relocate, students, professionals",
  openGraph: {
    title: "ZOKU 族 — Find Your Tribe in Every City",
    description: "Find verified hostels, gyms, sports clubs, events, and your tribe in any city.",
    type: "website",
    locale: "en_IN",
    siteName: "ZOKU",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZOKU 族 — Find Your Tribe in Every City",
    description: "Find verified hostels, gyms, sports clubs, events, and your tribe in any city.",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#080818",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { CityProvider } from "@/context/CityContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-zoku-bg text-white antialiased min-h-screen">
        <CityProvider>
          {children}
        </CityProvider>
      </body>
    </html>
  );
}
