import { ImageResponse } from "next/og";
import { loadBrandFonts, ogColors } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: ogColors.brand,
        color: ogColors.onBrand,
        fontFamily: "Cormorant",
        fontSize: 104,
        lineHeight: 1,
        paddingBottom: 12,
      }}
    >
      <span>O</span>
      <span style={{ fontStyle: "italic" }}>S</span>
    </div>,
    { ...size, fonts: await loadBrandFonts() },
  );
}
