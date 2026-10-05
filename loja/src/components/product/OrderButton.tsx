"use client";

import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product, ProductColor } from "@/types/product";

type OrderButtonProps = {
  product: Product;
  color: ProductColor;
  size?: string;
  requiresSize: boolean;
  onMissingSize: () => void;
};

export function OrderButton({ product, color, size, requiresSize, onMissingSize }: OrderButtonProps) {
  const classes = buttonClasses({ size: "lg", className: "w-full sm:w-auto" });
  const content = (
    <>
      <WhatsAppIcon />
      Pedir no WhatsApp
    </>
  );

  if (requiresSize && !size) {
    return (
      <button type="button" className={classes} onClick={onMissingSize}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={buildWhatsAppUrl({ product, color, size })}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      {content}
    </a>
  );
}
