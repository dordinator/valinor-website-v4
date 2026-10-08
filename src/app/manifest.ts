import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Valinor Systems",
    short_name: "Valinor",
    description: "SEO, AI search, web design and Google Ads from Valinor Systems.",
    start_url: "/",
    display: "browser",
    background_color: "#0b1e33",
    theme_color: "#0b1e33",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
