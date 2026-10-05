"use client";

import { forwardRef } from "react";

type SizePickerProps = {
  sizes: readonly string[];
  value?: string;
  onChange: (size: string) => void;
  error?: boolean;
};

export const SizePicker = forwardRef<HTMLFieldSetElement, SizePickerProps>(function SizePicker(
  { sizes, value, onChange, error },
  ref,
) {
  return (
    <fieldset
      ref={ref}
      tabIndex={-1}
      aria-describedby={error ? "size-error" : undefined}
      className="outline-none"
    >
      <legend className="text-sm text-muted">
        Tamanho{value ? <span className="font-medium text-ink">: {value}</span> : null}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <label key={size} className="relative">
            <input
              type="radio"
              name="size"
              value={size}
              checked={value === size}
              onChange={() => onChange(size)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 min-w-12 cursor-pointer items-center justify-center rounded-control border border-line px-3 text-sm font-medium text-ink transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-brand/50">
              {size}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <p id="size-error" role="alert" className="mt-2 text-sm font-medium text-brand">
          Escolha um tamanho para continuar.
        </p>
      ) : null}
    </fieldset>
  );
});
