import type { FaqItem } from "../types/product";

// Only questions with an answer are rendered. If none has one, the whole
// section and its menu link disappear. Never write a provisional answer.
export const faq: FaqItem[] = [
  { id: "pedido", question: "Como funciona o pedido?", answer: "" },
  { id: "prazo", question: "Qual o prazo?", answer: "" },
  { id: "tamanho", question: "Como escolher o tamanho?", answer: "" },
  { id: "pagamento", question: "Como pago?", answer: "" },
  { id: "troca", question: "Posso trocar?", answer: "" },
];

export function getAnsweredFaq(): FaqItem[] {
  return faq.filter((item) => item.answer.trim().length > 0);
}
