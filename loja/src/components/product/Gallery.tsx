"use client";

import { useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { imageAlt, otherSide, sideLabel } from "@/lib/format";
import type { Product, ProductSide, ProductVariant } from "@/types/product";

const SIDES: ProductSide[] = ["verso", "frente"];
const SWIPE_THRESHOLD = 40;

type GalleryProps = {
  product: Product;
  variant: ProductVariant;
  side: ProductSide;
  onSideChange: (side: ProductSide) => void;
};

/** Front/back gallery. Never wider than 560 CSS px (see docs/IMAGENS.md). */
export function Gallery({ product, variant, side, onSideChange }: GalleryProps) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const mainSizes = "(min-width: 1024px) 560px, (min-width: 640px) 560px, 100vw";

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div
        className="relative aspect-[4/5] touch-pan-y overflow-hidden rounded-tile bg-surface select-none"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") start.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const from = start.current;
          start.current = null;
          if (!from) return;
          const dx = e.clientX - from.x;
          const dy = e.clientY - from.y;
          if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) onSideChange(otherSide(side));
        }}
        onPointerCancel={() => (start.current = null)}
      >
        {SIDES.map((s) => (
          <SafeImage
            key={`${variant.color}-${s}`}
            src={variant.images[s]}
            alt={imageAlt(product, variant.color, s)}
            label={product.name}
            fill
            priority={s === side}
            sizes={mainSizes}
            draggable={false}
            aria-hidden={s !== side}
            className={`object-cover transition-opacity duration-500 ease-out ${s === side ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <p className="pointer-events-none absolute bottom-3 left-1/2 whitespace-nowrap -translate-x-1/2 rounded-full bg-page/80 px-3 py-1 text-caption text-ink/80 backdrop-blur sm:hidden">
          Arraste para ver {side === "verso" ? "a frente" : "as costas"}
        </p>
      </div>

      <div className="mt-4 flex gap-3" role="group" aria-label="Lado da camiseta">
        {SIDES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSideChange(s)}
            aria-pressed={s === side}
            className={`group flex flex-col items-center gap-1.5 rounded-card p-1 transition-colors ${
              s === side ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <span
              className={`relative block aspect-[4/5] w-20 overflow-hidden rounded-card bg-surface ring-offset-2 ring-offset-page transition ${
                s === side ? "ring-2 ring-brand" : "ring-1 ring-line group-hover:ring-brand/40"
              }`}
            >
              <SafeImage src={variant.images[s]} alt="" fill sizes="80px" className="object-cover" />
            </span>
            <span className="text-caption font-medium">{sideLabel(s)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
