import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildContactUrl } from "@/lib/whatsapp";

export function CtaFinal() {
  return (
    <section aria-labelledby="cta-title" className="pb-16 sm:pb-24">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded-tile bg-brand px-6 py-12 text-on-brand sm:px-12 sm:py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 id="cta-title" className="font-serif text-h2 font-medium">
              Qual palavra você vai vestir?
            </h2>
            <p className="mt-3 text-on-brand/80">
              Fale com a gente no WhatsApp e tire suas dúvidas antes de pedir.
            </p>
          </div>
          <ButtonLink href={buildContactUrl()} external size="lg" variant="inverse">
            <WhatsAppIcon />
            Pedir no WhatsApp
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
