import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aloha Nova Universe | AI-Powered Avatar Platform by 808_KiNg_MiLkMaN",
  description: "Transform yourself with Aloha Nova Universe - the revolutionary AI-powered avatar creation platform. Built by 808_KiNg_MiLkMaN. Create stunning avatars, deploy AI agents, and unlock unlimited potential.",
  keywords: ["AI avatars", "avatar creation", "AI agents", "generative AI", "digital personas", "808_KiNg_MiLkMaN"],
  creator: "808_KiNg_MiLkMaN (Malcolm Lee)",
  authors: [
    {
      name: "808_KiNg_MiLkMaN",
      url: "mailto:malcolmlee3@gmail.com",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alohanovauniverse.ai",
    siteName: "Aloha Nova Universe",
    title: "Aloha Nova Universe | AI Avatar Platform",
    description: "Create AI-powered avatars and deploy intelligent agents. Built by 808_KiNg_MiLkMaN.",
    images: [
      {
        url: "https://alohanovauniverse.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aloha Nova Universe Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aloha Nova Universe | AI Avatar Platform",
    description: "Create stunning AI avatars. Built by 808_KiNg_MiLkMaN.",
    creator: "@808_KiNg_MiLkMaN",
    images: ["https://alohanovauniverse.ai/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://alohanovauniverse.ai",
  },
  verification: {
    google: "google-site-verification-code",
  },
  metadataBase: new URL("https://alohanovauniverse.ai"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Aloha Nova Universe",
    "description": "AI-powered avatar creation platform with intelligent agents",
    "url": "https://alohanovauniverse.ai",
    "creator": {
      "@type": "Person",
      "name": "808_KiNg_MiLkMaN",
      "givenName": "Malcolm",
      "familyName": "Lee",
      "email": "malcolmlee3@gmail.com",
      "sameAs": ["https://github.com/808MiLkMaN"]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Aloha Nova Universe",
      "email": "malcolmlee3@gmail.com"
    },
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <head>
        <Script
          id="schema-creator"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData)
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
