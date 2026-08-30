import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import "./globals.css";

import JsonLd from "@/components/seo/JsonLd";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SiteChrome from "@/components/layout/SiteChrome";
import { absoluteUrl, siteConfig, siteUrl } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GTBS Book Store | Christian Books, Bibles & Faith Resources",
    template: "%s | GTBS Book Store",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteUrl }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  keywords: [...siteConfig.keywords],
  category: "shopping",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.name,
    title: "GTBS Book Store | Christian Books, Bibles & Faith Resources",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.socialImage,
        alt: "Gujarat Tract Book Store Christian books and Bibles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTBS Book Store | Christian Books, Bibles & Faith Resources",
    description: siteConfig.description,
    images: [siteConfig.socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/images/logo/logo.webp",
    apple: "/images/logo/logo.webp",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const storeStructuredData = {
  "@context": "https://schema.org",
  "@type": ["BookStore", "Organization"],
  "@id": `${siteUrl}/#store`,
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  url: siteUrl,
  logo: absoluteUrl("/images/logo/logo.webp"),
  image: absoluteUrl(siteConfig.socialImage),
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    ...siteConfig.address,
  },
  openingHours: "Mo-Sa 10:00-18:00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <JsonLd data={storeStructuredData} />
          <SiteChrome>
            {children}
          </SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
