/**
 *  Copyright (c) 2026 khrotu. Apache License 2.0.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import SettingsManager from "@/components/SettingsManager";
import { AutoRedirect } from "@/components/AutoRedirect";
import "./globals.css";
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};
export const metadata: Metadata = {
  metadataBase: new URL('https://www.bloxdforge.com'),
  title: {
    template: '%s | BloxdForge',
    default: 'BloxdForge: #1 Bloxd.io Texture Packs, Scripts & World Tools',
  },
  description: "Create custom texture packs, write scripts with AI assistance, and download community mods for Bloxd.io. Free browser-based tools for builders, modders, and players. FPS boost, world edit, and more.",
  keywords: [
    "bloxd.io",
    "bloxd.io texture packs",
    "bloxd.io scripts", 
    "bloxd.io mods",
    "how to make bloxd texture pack",
    "bloxd texture editor",
    "bloxd world edit",
    "bloxd.io fps boost",
    "bloxd.io hacks",
    "bloxd mcpack",
    "bloxd resource pack",
    "minecraft web games",
    "browser minecraft",
    "bloxd building tips",
    "bloxd pvp tips",
    "bloxd survival guide",
    "bloxd hop strategies",
    "bloxd bedwars",
    "bloxd skywars",
    "bloxd infection mode",
    "world edit commands",
    "texture studio",
    "bloxd forge",
    "bloxdforge"
  ],
  authors: [{ name: 'KHROTU', url: 'https://khrotu.org' }],
  creator: 'KHROTU',
  publisher: 'BloxdForge',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "BloxdForge - The Ultimate Bloxd.io Utility Suite",
    description: "Create texture packs, write scripts with AI, and download community mods for Bloxd.io. Free browser-based tools trusted by thousands of players.",
    url: 'https://www.bloxdforge.com',
    siteName: "BloxdForge",
    locale: "en_US",
    type: "website",
    images: [{
      url: 'https://www.bloxdforge.com/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'BloxdForge - The Ultimate Bloxd.io Utility Suite',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BloxdForge - Free Bloxd.io Tools & Community Mods',
    description: 'Create custom texture packs, write scripts with AI, and explore community mods. The #1 platform for Bloxd.io players.',
    creator: '@khrotubutms',
    site: '@khrotubutms',
    images: ['https://www.bloxdforge.com/opengraph-image.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "BloxdForge",
    startupImage: '/logo.svg',
  },
  formatDetection: {
    telephone: false,
  },
  classification: 'Gaming Tools, Game Mods, Texture Editor',
  referrer: 'origin-when-cross-origin',
};
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BloxdForge",
  "alternateName": "Bloxd Forge",
  "url": "https://www.bloxdforge.com/",
  "description": "The ultimate utility suite for Bloxd.io - Create texture packs, write scripts, and download community mods.",
  "inLanguage": "en-US",
  "publisher": {
    "@type": "Organization",
    "name": "BloxdForge",
    "url": "https://www.bloxdforge.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.bloxdforge.com/logo.svg",
      "width": 500,
      "height": 500
    },
    "sameAs": [
      "https://khrotu.org",
      "https://github.com/KHROTU",
      "https://twitter.com/khrotubutms"
    ]
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.bloxdforge.com/studio/workshop?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};
const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "BloxdForge",
  "description": "Browser-based utility suite for Bloxd.io with texture editor, script writer, and community workshop.",
  "url": "https://www.bloxdforge.com",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Any (Web Browser)",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1834",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "Texture Pack Creator",
    "Script Editor with AI",
    "Community Workshop",
    "World Tools",
    "Game Overlay",
    "Schematic Viewer"
  ]
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.bloxdforge.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Studio",
      "item": "https://www.bloxdforge.com/studio"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Workshop",
      "item": "https://www.bloxdforge.com/studio/workshop"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Creator",
      "item": "https://www.bloxdforge.com/studio/creator"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Resources",
      "item": "https://www.bloxdforge.com/studio/wiki"
    }
  ]
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <link rel="author" href="/humans.txt" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="canonical" href="https://www.bloxdforge.com/" />
        <meta name="theme-color" content="#ff6b39" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <AutoRedirect />
        <SettingsManager />
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1b1a1a',
              color: '#e0e0e0',
              border: '1px solid #2c2b2b',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}