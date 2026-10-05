"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { getVariant } from "@/data/products";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import type { Product, ProductColor, ProductSide } from "@/types/product";
import { ColorPicker } from "./ColorPicker";
import { Gallery } from "./Gallery";
import { NewBadge } from "./NewBadge";
import { OrderButton } from "./OrderButton";
import { SizePicker } from "./SizePicker";

type ProductViewProps = {
  product: Product;
  initialColor?: string | null;
  /** Server-rendered extras below the order button (specifications). */
  children?: ReactNode;
};

export function ProductView({ product, initialColor, children }: ProductViewProps) {
  const [color, setColor] = useState<ProductColor>(getVariant(product, initialColor).color);
  const [side, setSide] = useState<ProductSide>(product.cover ?? "verso");
  const [size, setSize] = useState<string>();
  const [sizeError, setSizeError] = useState(false);
  const sizeRef = useRef<HTMLFieldSetElement>(null);

  const variant = getVariant(product, color);
  const requiresSize = site.sizes.length > 0;

  function changeColor(next: ProductColor) {
    setColor(next);
    const url = new URL(window.location.href);
    url.searchParams.set("cor", next);
    window.history.replaceState(null, "", url);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
      <Gallery product={product} variant={variant} side={side} onSideChange={setSide} />

      <div className="lg:sticky lg:top-24 lg:self-start lg:pt-4">
        {product.isNew ? <NewBadge className="mb-4" /> : null}
        <h1 className="font-serif text-h1 font-medium text-ink">{product.name}</h1>
        {product.reference ? (
          <p className="mt-2 font-serif text-xl text-muted italic">{product.reference}</p>
        ) : null}
        <p className="mt-5 text-lg text-ink">{formatPrice(product.price)}</p>

        <div className="mt-8 space-y-7 border-t border-line pt-7">
          <ColorPicker colors={product.variants.map((v) => v.color)} value={color} onChange={changeColor} />

          {requiresSize ? (
            <SizePicker
              ref={sizeRef}
              sizes={site.sizes}
              value={size}
              error={sizeError}
              onChange={(next) => {
                setSize(next);
                setSizeError(false);
              }}
            />
          ) : null}

          <div>
            <OrderButton
              product={product}
              color={color}
              size={size}
              requiresSize={requiresSize}
              onMissingSize={() => {
                setSizeError(true);
                sizeRef.current?.focus();
              }}
            />
            <p className="mt-3 max-w-sm text-caption text-muted">
              A mensagem já vai pronta. Pagamento e entrega você combina direto com a gente.
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

/** Reads ?cor= from the URL. Rendered inside <Suspense> so the page stays static. */
export function ProductViewFromUrl(props: Omit<ProductViewProps, "initialColor">) {
  const searchParams = useSearchParams();
  return <ProductView {...props} initialColor={searchParams.get("cor")} />;
}
