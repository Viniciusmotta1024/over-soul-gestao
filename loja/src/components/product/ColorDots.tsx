import { colorLabels, colorSwatches } from "@/data/site";
import type { ProductColor } from "@/types/product";

/** Small, non-interactive color indicators for cards. */
export function ColorDots({ colors }: { colors: ProductColor[] }) {
  const label = colors.map((c) => colorLabels[c]).join(", ");
  return (
    <span className="flex items-center gap-1.5" role="img" aria-label={`Cores: ${label}`}>
      {colors.map((color) => (
        <span
          key={color}
          className="size-3 rounded-full ring-1 ring-ink/15 ring-inset"
          style={{ backgroundColor: colorSwatches[color] }}
        />
      ))}
    </span>
  );
}
