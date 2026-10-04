import type { Product, ProductColor, ProductVariant } from "../types/product";

/** Builds the variant for a color using the standard path /produtos/<slug>/<color>-<side>.webp */
function variant(slug: string, color: ProductColor): ProductVariant {
  return {
    color,
    images: {
      frente: `/produtos/${slug}/${color}-frente.webp`,
      verso: `/produtos/${slug}/${color}-verso.webp`,
    },
  };
}

// Showcase order = `order`. Missing price/message/reference are intentionally
// absent (see docs/PENDENCIAS.md). Never fill them with guesses.
export const products: Product[] = [
  {
    slug: "viver-e-cristo",
    name: "Viver é Cristo",
    reference: "Filipenses 1:21",
    variants: [variant("viver-e-cristo", "verde")],
    featured: true,
    order: 1,
  },
  {
    slug: "is-the-same",
    name: "Is The Same",
    reference: "Hebreus 13:8",
    variants: [variant("is-the-same", "preto"), variant("is-the-same", "branco")],
    order: 2,
  },
  {
    slug: "jesus-vive",
    name: "Jesus Vive",
    variants: [variant("jesus-vive", "preto")],
    order: 3,
  },
  {
    slug: "venceu-a-morte",
    name: "Venceu a Morte",
    variants: [variant("venceu-a-morte", "preto")],
    order: 4,
  },
  {
    slug: "jesus-esta-voltando",
    name: "Jesus está voltando",
    variants: [variant("jesus-esta-voltando", "preto")],
    order: 5,
  },
  {
    slug: "cristo-em-mim",
    name: "Cristo em mim",
    reference: "Gálatas 2:20",
    variants: [variant("cristo-em-mim", "azul")],
    order: 6,
  },
  {
    slug: "frutos-do-espirito",
    name: "Frutos do Espírito",
    reference: "Gálatas 5:22-23",
    variants: [variant("frutos-do-espirito", "preto")],
    order: 7,
  },
  {
    slug: "jesus-cristo",
    name: "Jesus Cristo",
    variants: [variant("jesus-cristo", "branco"), variant("jesus-cristo", "verde")],
    order: 8,
  },
  {
    slug: "evangelho",
    name: "Evangelho",
    reference: "Romanos 1:16",
    variants: [variant("evangelho", "branco")],
    order: 9,
  },
  {
    slug: "faith",
    name: "Faith",
    variants: [variant("faith", "branco")],
    order: 10,
  },
];

/** Slugs of the "Ele venceu. Ele vive. Ele voltará." sequence, in order. */
export const sequenceSlugs = ["venceu-a-morte", "jesus-vive", "jesus-esta-voltando"] as const;

export function getProducts(): Product[] {
  return [...products].sort((a, b) => a.order - b.order);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProduct(): Product {
  const featured = products.find((p) => p.featured);
  if (!featured) throw new Error("No featured product in src/data/products.ts");
  return featured;
}

export function getVariant(product: Product, color?: string | null): ProductVariant {
  return product.variants.find((v) => v.color === color) ?? product.variants[0];
}

/** Next products in showcase order (wrapping around), excluding the current one. */
export function getRelatedProducts(slug: string, count = 3): Product[] {
  const list = getProducts();
  const index = list.findIndex((p) => p.slug === slug);
  const related: Product[] = [];
  for (let i = 1; related.length < count && i < list.length; i++) {
    related.push(list[(index + i) % list.length]);
  }
  return related;
}
