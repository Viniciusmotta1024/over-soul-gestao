import { site } from "../data/site";
import type { Product } from "../types/product";
import { formatPrice } from "./format";

export function absoluteUrl(path = "/"): string {
  return new URL(path, site.url).toString();
}

export function productUrl(slug: string): string {
  return `/produtos/${slug}`;
}

export function productDescription(product: Product): string {
  const parts = [`Camiseta ${product.name} da OverSoul.`];
  if (product.reference) parts.push(`Inspirada em ${product.reference}.`);
  if (product.message) parts.push(product.message);
  else parts.push("Mais que uma roupa, uma mensagem.");
  parts.push(typeof product.price === "number" ? formatPrice(product.price) + "." : "Peça pelo WhatsApp.");
  return parts.join(" ");
}

export function productJsonLd(product: Product) {
  const images = product.variants.flatMap((v) => [absoluteUrl(v.images.verso), absoluteUrl(v.images.frente)]);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Camiseta ${product.name}`,
    description: productDescription(product),
    image: images,
    url: absoluteUrl(productUrl(product.slug)),
    brand: { "@type": "Brand", name: site.name },
    ...(typeof product.price === "number"
      ? {
          offers: {
            "@type": "Offer",
            price: product.price.toFixed(2),
            priceCurrency: "BRL",
            availability: "https://schema.org/MadeToOrder",
            url: absoluteUrl(productUrl(product.slug)),
          },
        }
      : {}),
  };
}

/** Serializes JSON-LD safely for a <script> tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
