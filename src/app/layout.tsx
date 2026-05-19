import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Manrope } from "next/font/google";
import HapticFeedback from "@/components/HapticFeedback";
import { serializeJsonLd } from "@/lib/jsonLd";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  OG_IMAGE_URL,
  OG_IMAGE,
  TWITTER_IMAGE,
} from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Mesa Startup Lab",
    "MSL",
    "startup incubator",
    "student founders",
    "India startups",
    "Ignite",
    "D2C",
    "AI startups",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: OG_IMAGE,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: TWITTER_IMAGE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060a0a" },
    { color: "#060a0a" },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "MSL",
  url: SITE_URL,
  logo: OG_IMAGE_URL,
  image: OG_IMAGE_URL,
  description: DEFAULT_DESCRIPTION,
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  },
  sameAs: [
    "https://www.linkedin.com/company/mesa-school-of-business",
    "https://www.instagram.com/mesaschool",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: OG_IMAGE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className="bg-black text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
        />
        <HapticFeedback />
        {children}
      </body>
    </html>
  );
}
