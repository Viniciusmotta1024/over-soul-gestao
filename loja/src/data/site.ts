import type { ProductColor, SizeChartRow } from "../types/product";

function env(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

// Public, non-secret defaults. Environment variables override them (see .env.example).
const DEFAULT_SITE_URL = "https://lojaoversoul.com.br";
const DEFAULT_WHATSAPP_NUMBER = "5521998959167";

function resolveSiteUrl(): string {
  const explicit = env(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/$/, "");
  return DEFAULT_SITE_URL;
}

export const site = {
  name: "OverSoul",
  title: "OverSoul — Mais que uma roupa, uma mensagem",
  description:
    "Camisas cristãs com artes inspiradas no Espírito Santo. Cada peça leva uma mensagem — para quem veste e para quem lê. Peça pelo WhatsApp.",
  url: resolveSiteUrl(),
  locale: "pt_BR",

  // Contact and links: environment variables win over the defaults above.
  // NEXT_PUBLIC_* values are inlined at build time.
  whatsappNumber: (env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ?? DEFAULT_WHATSAPP_NUMBER).replace(
    /\D/g,
    "",
  ),
  instagramUrl: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  ministryUrl: env(process.env.NEXT_PUBLIC_MINISTRY_URL),

  // Product details. Empty values hide the matching UI (see docs/PENDENCIAS.md).
  sizes: ["P", "M", "G", "GG", "G1"] as string[],
  // Oversize americana. Measures in cm; A) Largura, B) Comprimento, C) Mangas.
  sizeChart: [
    { size: "P", measures: { Largura: 49, Comprimento: 68, Mangas: 21 } },
    { size: "M", measures: { Largura: 52, Comprimento: 70, Mangas: 22 } },
    { size: "G", measures: { Largura: 55, Comprimento: 72, Mangas: 23 } },
    { size: "GG", measures: { Largura: 58, Comprimento: 74, Mangas: 24 } },
    { size: "G1", measures: { Largura: 61, Comprimento: 77, Mangas: 25 } },
  ] as SizeChartRow[],
  sizeChartNote: "As medidas podem variar 2 cm para mais ou para menos." as string | undefined,
  fabric: "100% algodão · fio 30.1 · 160 g/m²" as string | undefined,
  madeIn: "Feita no Rio de Janeiro, Brasil" as string | undefined,
  /** Extra rows for the product specifications, in display order. */
  details: [
    { label: "Modelagem", value: "Oversize americana, caimento reto e estruturado" },
    { label: "Gola", value: "Gola alta canelada, 3 cm de largura" },
    { label: "Acabamento", value: "Reforço de ombro a ombro" },
  ] as { label: string; value: string }[],
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
