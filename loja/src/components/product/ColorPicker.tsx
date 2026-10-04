"use client";

import { colorLabels, colorSwatches } from "@/data/site";
import type { ProductColor } from "@/types/product";

type ColorPickerProps = {
  colors: ProductColor[];
  value: ProductColor;
  onChange: (color: ProductColor) => void;
};

export function ColorPicker({ colors, value, onChange }: ColorPickerProps) {
  return (
    <fieldset>
      <legend className="text-sm text-muted">
        Cor: <span className="font-medium text-ink">{colorLabels[value]}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((color) => (
          <label
            key={color}
            className="relative inline-flex size-11 cursor-pointer items-center justify-center rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
          >
            <input
              type="radio"
              name="color"
              value={color}
              checked={value === color}
              onChange={() => onChange(color)}
              className="peer sr-only"
            />
            <span className="sr-only">{colorLabels[color]}</span>
            <span
              aria-hidden="true"
              className="size-8 rounded-full ring-1 ring-ink/20 ring-inset transition-shadow peer-checked:shadow-[0_0_0_2px_var(--color-page),0_0_0_4px_var(--color-brand)]"
              style={{ backgroundColor: colorSwatches[color] }}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
