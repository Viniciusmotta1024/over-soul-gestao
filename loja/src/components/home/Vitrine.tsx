import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

export function Vitrine({ products }: { products: Product[] }) {
  return (
    <section id="camisas" aria-labelledby="camisas-title" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="camisas-title" className="font-serif text-h2 font-medium text-ink">
            As camisas
          </h2>
          <p className="max-w-sm text-muted">
            Cada arte carrega uma palavra: discreta na frente, inteira nas costas.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:mt-14 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-14">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
