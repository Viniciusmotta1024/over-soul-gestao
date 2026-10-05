import type { FaqItem } from "../types/product";

// Only questions with an answer are rendered. If none has one, the whole
// section and its menu link disappear. Never write a provisional answer, and
// never state a deadline, payment method or exchange policy the owner has not
// confirmed (see docs/PENDENCIAS.md).
export const faq: FaqItem[] = [
  {
    id: "pedido",
    question: "Como funciona o pedido?",
    answer:
      "Escolha a camisa, a cor e o tamanho e toque em “Pedir no WhatsApp”. A mensagem já abre pronta com o que você escolheu. É só enviar: a gente confirma o pedido e combina com você o pagamento e a entrega.",
  },
  {
    id: "tamanho",
    question: "Como escolher o tamanho?",
    answer:
      "Pegue uma camiseta que você gosta de usar, estique sobre uma mesa e meça a largura (de uma axila à outra) e o comprimento (do ombro até a barra). Compare com a tabela de medidas na página de cada camisa e escolha o tamanho mais próximo. As medidas podem variar 2 cm para mais ou para menos. Ficou em dúvida entre dois? Chama a gente no WhatsApp.",
  },
  {
    id: "modelagem",
    question: "A camisa é oversize? Como ela veste?",
    answer:
      "Sim. É uma oversize americana: caimento mais reto e estruturado, um pouco mais solta no corpo, com gola alta canelada de 3 cm. A grade vai do P ao G1.",
  },
  {
    id: "tecido",
    question: "Qual é o tecido?",
    answer:
      "100% algodão, fio 30.1 e 160 g/m². É um tecido macio, confortável e respirável, com reforço de ombro a ombro para durar mais.",
  },
  {
    id: "cuidados",
    question: "Como cuidar da camisa?",
    answer:
      "Para a estampa durar mais, lave do avesso, com água fria e sabão neutro. Evite alvejante e secadora, seque à sombra e não passe o ferro em cima da estampa.",
  },
  {
    id: "prazo",
    question: "Qual o prazo de entrega?",
    answer: "",
  },
  {
    id: "pagamento",
    question: "Como pago?",
    answer: "",
  },
  {
    id: "troca",
    question: "Posso trocar se não servir?",
    answer: "",
  },
];

export function getAnsweredFaq(): FaqItem[] {
  return faq.filter((item) => item.answer.trim().length > 0);
}
