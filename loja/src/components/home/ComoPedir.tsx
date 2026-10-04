import { Container } from "@/components/layout/Container";

const steps = [
  { title: "Escolha", text: "Escolha a camisa, a cor e o tamanho." },
  { title: "Envie", text: "Envie o pedido pelo WhatsApp. A mensagem já vai pronta." },
  { title: "Combine", text: "Combine o pagamento e a entrega com a gente." },
];

export function ComoPedir() {
  return (
    <section aria-labelledby="como-pedir-title" className="border-t border-line py-16 sm:py-24">
      <Container>
        <h2 id="como-pedir-title" className="font-serif text-h2 font-medium text-ink">
          Como pedir
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-5 sm:flex-col sm:gap-4">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-brand/30 font-serif text-2xl text-brand"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-serif text-h3 text-ink">
                  <span className="sr-only">Passo {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-xs text-ink/80">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
