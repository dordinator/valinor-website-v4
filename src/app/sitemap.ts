import type { MetadataRoute } from "next";

const ORIGIN = "https://valinorsystems.co.uk";

const pages = ["/", "/seo", "/web-design", "/google-ads", "/google-ad-grants", "/pricing", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: `${ORIGIN}${path === "/" ? "" : path}` }));
}
