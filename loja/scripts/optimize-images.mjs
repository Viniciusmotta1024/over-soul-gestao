// Converts the standardized product photos in assets-source/ into WebP files
// in public/produtos/. The photos are final: this script only converts and
// compresses. It never resizes up, crops, or edits pixels.
//
// Usage: npm run images  (add --force to rebuild everything)
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = path.join(ROOT, "assets-source");
const OUTPUT_DIR = path.join(ROOT, "public", "produtos");
const MAX_WIDTH = 1080;
const TARGET_BYTES = 150 * 1024;
const QUALITIES = [85, 80, 75, 70];
const FORCE = process.argv.includes("--force");

// Expected inventory: slug -> colors. Each color has "frente" and "verso".
const INVENTORY = {
  "viver-e-cristo": ["verde"],
  "is-the-same": ["preto", "branco"],
  "jesus-vive": ["preto"],
  "venceu-a-morte": ["preto"],
  "jesus-esta-voltando": ["preto"],
  "cristo-em-mim": ["azul"],
  "frutos-do-espirito": ["preto"],
  "jesus-cristo": ["branco", "verde"],
  evangelho: ["branco"],
  faith: ["branco"],
};
const SIDES = ["frente", "verso"];

const expected = Object.entries(INVENTORY).flatMap(([slug, colors]) =>
  colors.flatMap((color) => SIDES.map((side) => `${slug}/${color}-${side}.png`)),
);

async function listSourceFiles() {
  const found = [];
  for (const dir of await readdir(SOURCE_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    for (const file of await readdir(path.join(SOURCE_DIR, dir.name))) {
      if (file.toLowerCase().endsWith(".png")) found.push(`${dir.name}/${file}`);
    }
  }
  return found.sort();
}

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

async function convert(relative) {
  const input = path.join(SOURCE_DIR, relative);
  const output = path.join(OUTPUT_DIR, relative.replace(/\.png$/, ".webp"));
  await mkdir(path.dirname(output), { recursive: true });

  if (!FORCE && (await mtime(output)) >= (await mtime(input))) {
    return { relative, output, skipped: true, bytes: (await stat(output)).size };
  }

  const meta = await sharp(input).metadata();
  let buffer;
  let quality;
  for (quality of QUALITIES) {
    buffer = await sharp(input)
      // withoutEnlargement guarantees we never upscale.
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toBuffer();
    if (buffer.length <= TARGET_BYTES) break;
  }
  await writeFile(output, buffer);
  return {
    relative,
    output,
    skipped: false,
    bytes: buffer.length,
    quality,
    width: meta.width,
    height: meta.height,
  };
}

async function main() {
  const found = await listSourceFiles();
  const missing = expected.filter((f) => !found.includes(f));
  const extra = found.filter((f) => !expected.includes(f));

  if (extra.length) console.warn(`Arquivos fora do inventário (ignorados):\n  ${extra.join("\n  ")}`);
  if (missing.length) {
    console.error(`Fotos faltando em assets-source/:\n  ${missing.join("\n  ")}`);
    process.exit(1);
  }

  const results = [];
  for (const file of expected) results.push(await convert(file));

  let total = 0;
  console.log("\nArquivo".padEnd(46) + "Tamanho".padStart(10) + "  Status");
  for (const r of results) {
    total += r.bytes;
    const kb = `${(r.bytes / 1024).toFixed(0)} KB`;
    const status = r.skipped ? "atual" : `q${r.quality}${r.bytes > TARGET_BYTES ? " (acima de 150 KB)" : ""}`;
    console.log(r.relative.replace(/\.png$/, ".webp").padEnd(45) + kb.padStart(10) + `  ${status}`);
  }
  console.log(`\n${results.length} arquivos, ${(total / 1024).toFixed(0)} KB no total.`);
  const over = results.filter((r) => r.bytes > TARGET_BYTES);
  if (over.length) console.warn(`${over.length} arquivo(s) acima de 150 KB.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
