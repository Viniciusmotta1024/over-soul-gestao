export type ProductColor = "preto" | "branco" | "verde" | "azul";

export type ProductSide = "frente" | "verso";

export interface ProductVariant {
  color: ProductColor;
  images: { frente: string; verso: string; extras?: string[] }; // paths under /public
}

export interface Product {
  slug: string;
  name: string;
  tagline?: string; // short line for the card
  reference?: string; // e.g. "Filipenses 1:21" (only when confirmed)
  message?: string; // "A mensagem por trás da arte" (2–4 sentences)
  variants: ProductVariant[]; // the first one is the default
  cover?: ProductSide; // side shown on the card (default: "verso")
  price?: number; // BRL; missing => "Valor no WhatsApp"
  featured?: boolean; // exactly one product is true (hero)
  order: number;
}

export interface SizeChartRow {
  size: string;
  /** Measurements in centimeters, keyed by column label (e.g. "Largura"). */
  measures: Record<string, number>;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string; // empty => not rendered
}
