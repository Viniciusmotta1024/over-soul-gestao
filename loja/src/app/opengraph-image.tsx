import { ImageResponse } from "next/og";
import { getFeaturedProduct } from "@/data/products";
import { loadBrandFonts, loadProductPhoto, ogColors, OgWordmark } from "@/lib/og";

export const alt = "OverSoul — Mais que uma roupa, uma mensagem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const product = getFeaturedProduct();
  const color = product.variants[0].color;
  const [fonts, photo] = await Promise.all([
    loadBrandFonts(),
    loadProductPhoto(product.slug, `${color}-verso`),
  ]);

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: ogColors.page }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 72px",
          width: 700,
        }}
      >
        <OgWordmark size={64} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 48,
            fontFamily: "Cormorant",
            fontSize: 76,
            lineHeight: 1,
            color: ogColors.ink,
          }}
        >
          <span>Mais que uma roupa.</span>
          <span style={{ fontStyle: "italic", color: ogColors.brand }}>Uma palavra.</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 500,
          background: ogColors.surface,
        }}
      >
        <img src={photo} width={504} height={630} alt="" />
      </div>
    </div>,
    { ...size, fonts },
  );
}
