import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { AppProviders } from "@/components/app-providers";
import { CookieBanner } from "@/components/cookie-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: "400",
});

const studioSerif = Cormorant_Garamond({
  variable: "--font-studio",
  subsets: ["latin"],
  style: "italic",
  weight: "300",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://valinorsystems.co.uk"),
  title: {
    default: "Valinor Systems | Web Design, SEO and Google Ads",
    template: "%s | Valinor Systems",
  },
  description:
    "Valinor Systems is a UK web design and SEO studio. We build fast, high-converting websites and run the Google Ads that grow them.",
  applicationName: "Valinor Systems",
  openGraph: {
    type: "website",
    siteName: "Valinor Systems",
    locale: "en_GB",
    url: "/",
    title: "Valinor Systems | Web Design, SEO and Google Ads",
    description:
      "Valinor Systems is a UK web design and SEO studio. We build fast, high-converting websites and run the Google Ads that grow them.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${studioSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
