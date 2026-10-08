import { ImageResponse } from "next/og";

export const alt = "Valinor Systems. SEO and web design, built around your business.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share card: the homepage hero's own words on its navy. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#f4f8fc",
          background: "linear-gradient(135deg, #17324d 0%, #0b1e33 55%, #081726 100%)",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#c2d0e1" }}>VALINOR SYSTEMS</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.1, letterSpacing: -2 }}>
          <span>SEO and web design.</span>
          <span>Built around your business.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#c2d0e1" }}>
          <span>SEO · AI search · Web design · Google Ads</span>
          <span>valinorsystems.co.uk</span>
        </div>
      </div>
    ),
    size,
  );
}
