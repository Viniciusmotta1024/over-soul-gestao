import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

const lines = ["Ele venceu.", "Ele vive.", "Ele voltará."];

export function Sequencia({ products }: { products: Product[] }) {
  if (products.length !== lines.length) return null;

  return (
    <section aria-labelledby="sequencia-title" className="py-16 sm:py-24">
      <Container>
        <h2 id="sequencia-title" className="max-w-3xl font-serif text-h2 font-medium text-ink">
          Ele venceu. Ele vive. <em className="text-brand">Ele voltará.</em>
        </h2>
        <p className="mt-4 max-w-xl text-muted">Três camisas, uma história contada em ordem.</p>

        <ol className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:gap-10">
          {products.map((product, index) => (
            <li key={product.slug} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <ProductCard
                product={{ ...product, cover: "verso" }}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 30vw, 72vw"
                eyebrow={
                  <p className="flex items-baseline gap-2 text-sm text-muted">
                    <span className="font-serif text-lg text-brand italic">{index + 1}.</span>
                    {lines[index]}
                  </p>
                }
              />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
