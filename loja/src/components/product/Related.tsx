import { Container } from "@/components/layout/Container";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function Related({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-title" className="py-16 sm:py-24">
      <Container>
        <h2 id="related-title" className="font-serif text-h2 font-medium text-ink">
          Veja também
        </h2>
        <ul className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
          {products.map((product) => (
            <li key={product.slug} className="w-[62%] shrink-0 snap-start sm:w-auto">
              <ProductCard
                product={product}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 30vw, 62vw"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
