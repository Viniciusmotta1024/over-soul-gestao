import { Container } from "@/components/layout/Container";
import type { FaqItem } from "@/types/product";

export function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="border-t border-line py-16 sm:py-24">
      <Container size="narrow">
        <h2 id="duvidas-title" className="font-serif text-h2 font-medium text-ink">
          Dúvidas
        </h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {items.map((item) => (
            <details key={item.id} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="font-serif text-2xl text-brand transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-prose pb-5 text-ink/80">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
