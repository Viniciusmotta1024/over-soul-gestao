import { ImageResponse } from "next/og";
import { loadBrandFonts, ogColors } from "@/lib/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
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
        fontSize: 300,
        lineHeight: 1,
        borderRadius: 112,
        paddingBottom: 36,
      }}
    >
      <span>O</span>
      <span style={{ fontStyle: "italic" }}>S</span>
    </div>,
    { ...size, fonts: await loadBrandFonts() },
  );
}
