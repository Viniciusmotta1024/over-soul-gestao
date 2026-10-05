import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice, imageAlt, otherSide } from "@/lib/format";
import { productUrl } from "@/lib/seo";
import type { Product } from "@/types/product";
import { ColorDots } from "./ColorDots";
import { NewBadge } from "./NewBadge";

type ProductCardProps = {
  product: Product;
  sizes?: string;
  /** Optional line above the name (used by the sequence section). */
  eyebrow?: React.ReactNode;
  headingLevel?: "h3" | "h4";
};

/**
 * Photo tile + name + colors + price. On devices with a mouse, hovering shows
 * the other side of the shirt; on touch the whole card links to the product.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 240px, (min-width: 640px) 45vw, 50vw",
  eyebrow,
  headingLevel: Heading = "h3",
}: ProductCardProps) {
  const variant = product.variants[0];
  const cover = product.cover ?? "verso";
  const back = otherSide(cover);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-tile bg-surface ring-brand ring-offset-4 ring-offset-page group-has-[a:focus-visible]:ring-2">
        <SafeImage
          src={variant.images[cover]}
          alt={imageAlt(product, variant.color, cover)}
          label={product.name}
          fill
          sizes={sizes}
          className="object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
        />
        <SafeImage
          src={variant.images[back]}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        />
        {product.isNew ? <NewBadge className="absolute top-3 left-3" /> : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-1 pt-4">
        {eyebrow}
        <Heading className="font-serif text-h3 text-ink">
          <Link
            href={productUrl(product.slug)}
            className="after:absolute after:inset-0 after:rounded-tile focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </Heading>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="text-sm text-muted">{formatPrice(product.price)}</span>
          <ColorDots colors={product.variants.map((v) => v.color)} />
        </div>
      </div>
    </article>
  );
}
