import type { ProductColor, SizeChartRow } from "../types/product";

function env(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function resolveSiteUrl(): string {
  const explicit = env(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = env(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  name: "OverSoul",
  title: "OverSoul — Mais que uma roupa, uma mensagem",
  description:
    "Camisas cristãs com artes inspiradas no Espírito Santo. Cada peça leva uma mensagem — para quem veste e para quem lê. Peça pelo WhatsApp.",
  url: resolveSiteUrl(),
  locale: "pt_BR",

  // Contact and links come from environment variables (see .env.example).
  // NEXT_PUBLIC_* values are inlined at build time.
  whatsappNumber: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, ""),
  instagramUrl: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  ministryUrl: env(process.env.NEXT_PUBLIC_MINISTRY_URL),

  // Product details. Empty values hide the matching UI (see docs/PENDENCIAS.md).
  sizes: [] as string[], // e.g. ["P", "M", "G", "GG"]
  sizeChart: [] as SizeChartRow[],
  fabric: undefined as string | undefined, // e.g. "Malha 240 g/m²"
  madeIn: undefined as string | undefined, // e.g. "Feita no Brasil"
} as const;

export const colorLabels: Record<ProductColor, string> = {
  preto: "Preto",
  branco: "Branco",
  verde: "Verde",
  azul: "Azul",
};

export const colorSwatches: Record<ProductColor, string> = {
  preto: "#1C1C1C",
  branco: "#ECECEA",
  verde: "#3F5B2E",
  azul: "#1F2A7A",
};
