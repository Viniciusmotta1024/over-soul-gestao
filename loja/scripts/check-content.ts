/**
 * Content check: lists everything the owner still has to fill in.
 *
 *   npm run check          -> report only (always exits 0)
 *   npm run check:strict   -> exits 1 if something essential to publish is missing
 *   --prebuild             -> strict only when VERCEL_ENV=production (used by `prebuild`)
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

const args = process.argv.slice(2);
const prebuild = args.includes("--prebuild");
const strict = args.includes("--strict") || (prebuild && process.env.VERCEL_ENV === "production");
const ROOT = process.cwd();

loadEnvConfig(ROOT, process.env.NODE_ENV !== "production");

type Level = "blocker" | "high" | "low";
const issues: Record<Level, string[]> = { blocker: [], high: [], low: [] };
const add = (level: Level, message: string) => issues[level].push(message);

async function main() {
  // Imported after env vars are loaded: site.ts reads process.env at import time.
  const { products, getFeaturedProduct } = await import("../src/data/products");
  const { site } = await import("../src/data/site");
  const { faq } = await import("../src/data/faq");

  const publicFile = (src: string) => existsSync(path.join(ROOT, "public", src));

  // Environment
  if (!site.whatsappNumber) add("blocker", "NEXT_PUBLIC_WHATSAPP_NUMBER vazio (pedidos não chegam à loja).");
  else if (!/^55\d{10,11}$/.test(site.whatsappNumber))
    add("blocker", `NEXT_PUBLIC_WHATSAPP_NUMBER fora do formato 55DDDNÚMERO: "${site.whatsappNumber}".`);
  if (!site.instagramUrl)
    add("low", "NEXT_PUBLIC_INSTAGRAM_URL vazio (link do Instagram não aparece no rodapé).");
  if (!site.ministryUrl)
    add("low", "NEXT_PUBLIC_MINISTRY_URL vazio (link do Vestindo seu Ministério não aparece).");

  // Catalog structure
  const featured = products.filter((p) => p.featured);
  if (featured.length !== 1)
    add("blocker", `Deve existir exatamente 1 produto featured (hoje: ${featured.length}).`);
  const slugs = new Set<string>();
  for (const p of products) {
    if (slugs.has(p.slug)) add("blocker", `Slug duplicado: ${p.slug}.`);
    slugs.add(p.slug);
  }

  // Photos
  const hero = featured.length === 1 ? getFeaturedProduct() : undefined;
  for (const p of products) {
    for (const v of p.variants) {
      for (const side of ["frente", "verso"] as const) {
        const src = v.images[side];
        if (!publicFile(src)) {
          const where = p === hero ? "foto do hero" : "foto";
          add(
            "blocker",
            `${p.name} (${v.color}): ${where} ${side} ausente em public${src}. Rode npm run images.`,
          );
        }
      }
      for (const extra of v.images.extras ?? []) {
        if (!publicFile(extra)) add("high", `${p.name} (${v.color}): foto extra ausente em public${extra}.`);
      }
    }
  }

  // Product content
  const without = (key: "price" | "message" | "reference") =>
    products.filter((p) => p[key] === undefined || p[key] === "").map((p) => p.name);
  const noPrice = without("price");
  const noMessage = without("message");
  const noReference = without("reference");
  if (noPrice.length)
    add("high", `Sem preço (${noPrice.length}), mostra "Valor no WhatsApp": ${noPrice.join(", ")}.`);
  if (noMessage.length)
    add("high", `Sem "mensagem por trás da arte" (${noMessage.length}): ${noMessage.join(", ")}.`);
  if (noReference.length)
    add("low", `Sem referência bíblica (${noReference.length}, só se houver): ${noReference.join(", ")}.`);

  // Store details
  if (site.sizes.length === 0)
    add("high", "site.sizes vazio: a página do produto não mostra seletor de tamanho.");
  if (site.sizeChart.length === 0) add("high", "site.sizeChart vazio: sem tabela de medidas.");
  if (!site.fabric) add("low", "site.fabric vazio (tecido/gramatura).");
  if (!site.madeIn) add("low", "site.madeIn vazio (origem).");

  // FAQ
  const unanswered = faq.filter((f) => !f.answer.trim());
  if (unanswered.length === faq.length)
    add("high", "FAQ sem nenhuma resposta: a seção Dúvidas e o link do menu estão ocultos.");
  if (unanswered.length)
    add("low", `FAQ sem resposta (${unanswered.length}): ${unanswered.map((f) => f.question).join(" / ")}`);

  // Report
  const titles: Record<Level, string> = {
    blocker: "ESSENCIAL PARA PUBLICAR",
    high: "IMPORTANTE",
    low: "QUANDO PUDER",
  };
  console.log(`\nVerificação de conteúdo — OverSoul${strict ? " (modo estrito)" : ""}\n`);
  for (const level of ["blocker", "high", "low"] as const) {
    console.log(`${titles[level]} (${issues[level].length})`);
    if (issues[level].length === 0) console.log("  ok");
    for (const message of issues[level]) console.log(`  - ${message}`);
    console.log("");
  }

  if (strict && issues.blocker.length > 0) {
    console.error(
      `Falha: ${issues.blocker.length} item(ns) essencial(is) faltando. Corrija antes de publicar.`,
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
