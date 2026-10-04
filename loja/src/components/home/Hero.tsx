import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/data/site";
import type { Product } from "@/types/product";
import { HeroShirt } from "./HeroShirt";

export function Hero({ product }: { product: Product }) {
  const trust = [site.fabric, site.madeIn].filter(Boolean);

  return (
    <section aria-labelledby="hero-title" className="overflow-hidden">
      <Container className="grid items-center gap-8 pt-6 pb-16 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-16 lg:pb-24">
        <div className="max-w-xl">
          <p className="animate-rise text-caption font-medium tracking-[0.18em] text-muted uppercase">
            {product.name}
            {product.reference ? ` · ${product.reference}` : ""}
          </p>
          <h1
            id="hero-title"
            className="animate-rise mt-3 font-serif text-display font-medium text-ink [animation-delay:80ms] sm:mt-5"
          >
            Mais que uma roupa. <em className="text-brand">Uma palavra.</em>
          </h1>
          <p className="animate-rise mt-4 max-w-[34rem] text-ink/80 [animation-delay:180ms] sm:mt-6 sm:text-lead">
            Camisas com artes inspiradas no Espírito Santo. Cada peça leva uma mensagem — para quem veste e
            para quem lê.
          </p>
          <div className="animate-rise mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 [animation-delay:260ms] sm:mt-9">
            <ButtonLink href="#camisas" size="lg">
              Ver as camisas
            </ButtonLink>
            {trust.length > 0 ? <p className="text-caption text-muted">{trust.join(" · ")}</p> : null}
          </div>
        </div>

        <div className="animate-settle [animation-delay:120ms]">
          <HeroShirt product={product} />
        </div>
      </Container>
    </section>
  );
}
