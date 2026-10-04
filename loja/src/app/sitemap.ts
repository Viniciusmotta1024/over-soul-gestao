import type { MetadataRoute } from "next";
import { getProducts } from "@/data/products";
import { absoluteUrl, productUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...getProducts().map((product) => ({
      url: absoluteUrl(productUrl(product.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
