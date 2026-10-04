import { colorLabels } from "../data/site";
import type { Product, ProductColor, ProductSide } from "../types/product";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const PRICE_FALLBACK = "Valor no WhatsApp";

export function formatPrice(price?: number): string {
  return typeof price === "number" ? brl.format(price) : PRICE_FALLBACK;
}

export function colorName(color: ProductColor): string {
  return colorLabels[color].toLowerCase();
}

export function sideLabel(side: ProductSide): string {
  return side === "frente" ? "Frente" : "Costas";
}

export function imageAlt(product: Pick<Product, "name">, color: ProductColor, side: ProductSide): string {
  return `Camiseta ${product.name} ${colorName(color)}, vista ${side === "frente" ? "de frente" : "de costas"}`;
}

export function otherSide(side: ProductSide): ProductSide {
  return side === "frente" ? "verso" : "frente";
}
