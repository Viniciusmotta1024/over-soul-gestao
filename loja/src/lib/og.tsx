import { readFile } from "node:fs/promises";
import path from "node:path";

// Helpers for generated images (Open Graph, icons). Server-only.

export async function loadBrandFonts() {
  const dir = path.join(process.cwd(), "src/assets/fonts");
  const [regular, italic] = await Promise.all([
    readFile(path.join(dir, "cormorant-garamond-latin-600-normal.woff")),
    readFile(path.join(dir, "cormorant-garamond-latin-600-italic.woff")),
  ]);
  return [
    { name: "Cormorant", data: regular, weight: 600 as const, style: "normal" as const },
    { name: "Cormorant", data: italic, weight: 600 as const, style: "italic" as const },
  ];
}

/** Reads a source PNG (assets-source/<slug>/<file>.png) as a data URL. */
export async function loadProductPhoto(slug: string, file: string) {
  const data = await readFile(path.join(process.cwd(), "assets-source", slug, `${file}.png`));
  return `data:image/png;base64,${data.toString("base64")}`;
}

export const ogColors = {
  page: "#F1EAD9",
  surface: "#E8DFCB",
  ink: "#2B1F16",
  brand: "#4A3326",
  onBrand: "#F6F0E4",
  muted: "#6E5E4F",
};

export function OgWordmark({ size }: { size: number }) {
  return (
    <div
      style={{ display: "flex", fontFamily: "Cormorant", fontSize: size, color: ogColors.ink, lineHeight: 1 }}
    >
      <span>Over</span>
      <span style={{ fontStyle: "italic" }}>Soul</span>
    </div>
  );
}
