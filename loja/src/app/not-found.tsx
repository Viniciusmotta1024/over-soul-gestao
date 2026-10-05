import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container size="narrow" className="flex flex-col items-start py-24 sm:py-32">
      <h1 className="font-serif text-h1 font-medium text-ink">
        Essa página <em className="text-brand">não existe.</em>
      </h1>
      <p className="mt-4 max-w-md text-ink/80">O link pode ter mudado. As camisas continuam todas aqui.</p>
      <ButtonLink href="/#camisas" size="lg" className="mt-8">
        Ver as camisas
      </ButtonLink>
    </Container>
  );
}
