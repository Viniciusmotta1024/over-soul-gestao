import { Container } from "@/components/layout/Container";
import type { Product } from "@/types/product";

/** "A mensagem por trás da arte" — renders only what exists. */
export function MessageBlock({ product }: { product: Product }) {
  if (!product.reference && !product.message) return null;

  return (
    <section aria-labelledby="mensagem-arte-title" className="bg-surface py-16 sm:py-24">
      <Container size="narrow" className="text-center">
        <h2 id="mensagem-arte-title" className="text-sm font-medium text-muted">
          A mensagem por trás da arte
        </h2>
        {product.reference ? (
          <p className="mt-6 font-serif text-h1 font-medium text-ink italic">{product.reference}</p>
        ) : null}
        {product.message ? (
          <p className="mx-auto mt-6 max-w-[38rem] font-serif text-[1.375rem] leading-snug text-ink/90 sm:text-2xl">
            {product.message}
          </p>
        ) : null}
        <span aria-hidden="true" className="mx-auto mt-10 block h-px w-16 bg-brand/40" />
      </Container>
    </section>
  );
}
