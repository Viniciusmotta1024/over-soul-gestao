import { site } from "../data/site";
import type { Product, ProductColor } from "../types/product";
import { colorName } from "./format";

let warned = false;

function baseUrl(): string {
  const number = site.whatsappNumber;
  if (!number) {
    if (process.env.NODE_ENV !== "production" && !warned) {
      warned = true;
      console.warn(
        "[OverSoul] NEXT_PUBLIC_WHATSAPP_NUMBER está vazio. Os links abrem o WhatsApp sem destinatário. Configure em .env.local.",
      );
    }
    // Still functional: WhatsApp lets the user pick the contact.
    // Production builds fail before this happens (npm run check:strict).
    return "https://wa.me/";
  }
  return `https://wa.me/${number}`;
}

export function buildOrderMessage({
  product,
  color,
  size,
}: {
  product: Pick<Product, "name">;
  color: ProductColor;
  size?: string;
}): string {
  const sizePart = size ? `, tamanho ${size}` : "";
  return `Olá! Quero a camiseta ${product.name} (${colorName(color)})${sizePart}. Pode me passar o valor e as formas de pagamento?`;
}

export function buildWhatsAppUrl(params: {
  product: Pick<Product, "name">;
  color: ProductColor;
  size?: string;
}): string {
  return `${baseUrl()}?text=${encodeURIComponent(buildOrderMessage(params))}`;
}

/** Generic contact link (header, final CTA). */
export function buildContactUrl(): string {
  const text = "Olá! Vim pelo site da OverSoul e quero saber mais sobre as camisas.";
  return `${baseUrl()}?text=${encodeURIComponent(text)}`;
}
