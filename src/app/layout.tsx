import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getSiteUrl } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Lakes Las Vegas | Real Estate",
    template: "%s | The Lakes Las Vegas",
  },
  description:
    "Homes and real estate in The Lakes, Las Vegas. Local expertise, listings, and neighborhood insight.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "The Lakes Las Vegas",
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} min-h-screen bg-zinc-50 text-zinc-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
