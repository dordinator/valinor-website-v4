import type { Metadata } from "next";

/**
 * Title, description, canonical and share tags for one page. A page-level
 * openGraph replaces the root one outright, so the site-wide fields are
 * repeated here, the share image included; without this every page shares as the homepage.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Valinor Systems",
      locale: "en_GB",
      url: path,
      title: `${title} | Valinor Systems`,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Valinor Systems. SEO and web design, built around your business." }],
    },
  };
}
