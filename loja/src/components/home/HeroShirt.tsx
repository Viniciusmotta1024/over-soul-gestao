"use client";

import { useState } from "react";
import { FlipIcon } from "@/components/ui/icons";
import { SafeImage } from "@/components/ui/SafeImage";
import { imageAlt } from "@/lib/format";
import type { Product, ProductSide } from "@/types/product";

/** Hero photo: shows the back (where the art is) and flips to the front on hover or via the toggle. */
export function HeroShirt({ product }: { product: Product }) {
  const variant = product.variants[0];
  const [pinned, setPinned] = useState<ProductSide>("verso");
  const [hovering, setHovering] = useState(false);
  const side: ProductSide = hovering ? (pinned === "verso" ? "frente" : "verso") : pinned;
  const sizes = "(min-width: 1024px) 520px, (min-width: 640px) 440px, 82vw";

  return (
    <div
      className="relative mx-auto w-[82%] max-w-[520px] sm:w-full"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-tile bg-surface">
        {(["verso", "frente"] as const).map((s) => (
          <SafeImage
            key={s}
            src={variant.images[s]}
            alt={imageAlt(product, variant.color, s)}
            label={product.name}
            fill
            priority={s === "verso"}
            sizes={sizes}
            aria-hidden={side !== s}
            className={`object-cover transition-opacity duration-500 ease-out ${side === s ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setHovering(false);
          setPinned((p) => (p === "verso" ? "frente" : "verso"));
        }}
        aria-pressed={pinned === "frente"}
        className="absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 rounded-control bg-page/85 px-3.5 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-page"
      >
        <FlipIcon />
        {side === "verso" ? "Ver frente" : "Ver costas"}
      </button>
    </div>
  );
}
