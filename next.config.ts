import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // AVIF first: the wordmark and the studio previews are the only optimised
    // images on the marketing pages and all of them shrink under it.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 65, 75, 90],
    minimumCacheTTL: 31_536_000,
  },
  // One headers() only: a second key silently replaces the first, which is
  // exactly what the rebase produced and what would have quietly un-noindexed
  // the reference library.
  // The pricing page used to live at /working-together.
  async redirects() {
    return [{ source: "/working-together", destination: "/pricing", permanent: true }];
  },
  async headers() {
    return [
      ...["/learn/:path*", "/references/:path*"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      })),
      {
        // Safe to hold for a year because every generated derivative carries a
        // version in its filename (valinor-mark-ghost-64.v1.webp).
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
  // Off because its badge sat on top of Sign out. The indicator floats in one
  // of the four viewport corners, and both rails spend all four: the lockup
  // top-left, the account cluster top-right, the assistant bottom-right, and
  // the plan block with Sign out under it bottom-left — where the badge lands
  // by default, eating clicks on the icon and the first half of the label.
  // There is no free corner to move it to, and a dev-only dead zone over the
  // one control you cannot test any other way is worse than no badge. Compile
  // and runtime errors still surface without it.
  devIndicators: false,
};

export default nextConfig;
