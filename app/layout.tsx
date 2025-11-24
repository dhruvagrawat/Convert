import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Inter, JetBrains_Mono, DM_Sans as V0_Font_DM_Sans, Space_Mono as V0_Font_Space_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _dmSans = V0_Font_DM_Sans({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900","1000"] })
const _spaceMono = V0_Font_Space_Mono({ subsets: ['latin'], weight: ["400","700"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://convert.dhruvagrawat.com"),
  title: {
    default: "ConvertHub - Free Online File Converter & Photo Editor | Privacy-First",
    template: "%s | ConvertHub - Free File Converter",
  },
  description:
    "Free online file converter and photo editor. Convert images (JPG, PNG, WEBP), documents (PDF, DOCX, PPTX), create passport photos, app icons, and banners. 100% private - all processing in your browser.",
  keywords: [
    "file converter",
    "image converter",
    "PDF converter",
    "photo editor",
    "passport photo maker",
    "app icon generator",
    "favicon maker",
    "JPG to PNG",
    "PDF to Word",
    "online converter",
    "free converter",
    "privacy-first converter",
    "client-side converter",
  ],
  authors: [{ name: "Dhruv Agrawat", url: "https://dhruvagrawat.com" }],
  creator: "Dhruv Agrawat",
  publisher: "Dhruv Agrawat",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://convert.dhruvagrawat.com",
    title: "ConvertHub - Free Online File Converter & Photo Editor",
    description:
      "Convert images, documents, and create professional graphics. 100% private with all processing in your browser.",
    siteName: "ConvertHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvertHub - Free Online File Converter",
    description: "Convert images, documents, create passport photos & app icons. 100% privacy-first.",
    creator: "@dhruvagrawat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ConvertHub",
              url: "https://convert.dhruvagrawat.com",
              description: "Free online file converter and photo editor with privacy-first approach",
              applicationCategory: "UtilityApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              operatingSystem: "Any",
              author: {
                "@type": "Person",
                name: "Dhruv Agrawat",
                url: "https://dhruvagrawat.com",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
