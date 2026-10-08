import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { AppProviders } from "@/components/app-providers";
import { CookieBanner } from "@/components/cookie-banner";
import { bodyFont, headingFont } from "@/components/home-hero/fonts";
import { SITE_DESCRIPTION } from "@/lib/schema";

const SITE_TITLE = "Valinor Systems | SEO, AI Search and Web Design";

export const metadata: Metadata = {
  metadataBase: new URL("https://valinorsystems.co.uk"),
  title: {
    default: SITE_TITLE,
    template: "%s | Valinor Systems",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Valinor Systems",
  openGraph: {
    type: "website",
    siteName: "Valinor Systems",
    locale: "en_GB",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Matches the navy the pages open on, so the browser's own bars blend into it on phones.
  themeColor: "#0b1e33",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
