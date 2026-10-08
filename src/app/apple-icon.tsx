import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for phones: the mark on the site's navy. Built once at build time. */
export default async function AppleIcon() {
  const mark = await readFile(join(process.cwd(), "public/assets/brand/valinor-mark-transparent.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b1e33" }}>
        <img src={src} alt="" width={132} height={116} />
      </div>
    ),
    size,
  );
}
