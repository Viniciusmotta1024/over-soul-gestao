import { Container } from "@/components/layout/Container";
import { SafeImage } from "@/components/ui/SafeImage";
import { imageAlt } from "@/lib/format";
import type { Product } from "@/types/product";

export function Manifesto({ product }: { product: Product }) {
  const variant = product.variants[0];

  return (
    <section id="mensagem" aria-labelledby="mensagem-title" className="bg-surface py-16 sm:py-24">
      <Container className="grid items-center gap-10 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-16 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <div className="max-w-2xl">
          <h2 id="mensagem-title" className="font-serif text-h1 font-medium text-ink">
            Mais que uma roupa, <em className="text-brand">uma mensagem.</em>
          </h2>
          <div className="mt-8 space-y-5 text-lead text-ink/85">
            <p>
              Uma camisa vai a muitos lugares: a faculdade, o trabalho, a fila do mercado, o culto de domingo.
              Em cada um deles, alguém lê o que você veste.
            </p>
            <p>
              Por isso cada arte da OverSoul nasce de uma palavra inspirada no Espírito Santo. Ela lembra quem
              veste e alcança quem vê.
            </p>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[22rem] md:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-tile bg-surface ring-1 ring-line">
            <SafeImage
              src={variant.images.verso}
              alt={imageAlt(product, variant.color, "verso")}
              label={product.name}
              fill
              sizes="(min-width: 1024px) 416px, (min-width: 768px) 352px, 88vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 px-1 text-caption text-muted">
            {product.name}
            {product.reference ? ` — ${product.reference}` : ""}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
