import { ImageResponse } from "next/og";
import { getProduct, getProducts } from "@/data/products";
import { loadBrandFonts, loadProductPhoto, ogColors, OgWordmark } from "@/lib/og";

export const alt = "Camiseta da OverSoul";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug) ?? getProducts()[0];
  const variant = product.variants[0];
  const side = product.cover ?? "verso";
  const [fonts, photo] = await Promise.all([
    loadBrandFonts(),
    loadProductPhoto(product.slug, `${variant.color}-${side}`),
  ]);

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: ogColors.page }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          width: 700,
        }}
      >
        <OgWordmark size={48} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "Cormorant", fontSize: 92, lineHeight: 1, color: ogColors.ink }}>
            {product.name}
          </span>
          {product.reference ? (
            <span
              style={{
                fontFamily: "Cormorant",
                fontStyle: "italic",
                fontSize: 44,
                marginTop: 20,
                color: ogColors.muted,
              }}
            >
              {product.reference}
            </span>
          ) : null}
        </div>
        <span style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 34, color: ogColors.brand }}>
          Mais que uma roupa, uma mensagem.
        </span>
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
