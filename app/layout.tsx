import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

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
  // maximumScale removed — blocking pinch-to-zoom violates WCAG 1.4.4
};

import { CityProvider } from "@/context/CityContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-zoku-bg text-white antialiased min-h-screen font-sans">
        <CityProvider>
          {children}
        </CityProvider>
      </body>
    </html>
  );
}
