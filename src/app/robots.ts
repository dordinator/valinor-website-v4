import type { MetadataRoute } from "next";

const ORIGIN = "https://valinorsystems.co.uk";

// Open to every crawler, AI crawlers included. /login is kept out with a noindex on
// the page itself, which only works if crawlers are allowed to fetch it — so it is
// not disallowed here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${ORIGIN}/sitemap.xml`,
    host: ORIGIN,
  };
}
