"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "alt" | "src"> & {
  src: string;
  alt: string;
  /** Shown on the fallback tile in development when the file is missing. */
  label?: string;
};

/**
 * next/image wrapper for product photos.
 * - Never renders a broken image: on error it falls back to a plain surface tile.
 * - In development the tile shows the product name so the gap is obvious.
 *   In production missing files are caught earlier by `npm run check:strict`.
 */
export function SafeImage({
  src,
  alt,
  label,
  className = "",
  fill,
  width,
  height,
  ...props
}: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`${fill ? "absolute inset-0" : "block"} flex items-center justify-center bg-surface ${className}`}
        style={fill ? undefined : { aspectRatio: `${width} / ${height}` }}
      >
        {process.env.NODE_ENV !== "production" && label ? (
          <span className="px-4 text-center font-serif text-h3 text-muted">{label}</span>
        ) : null}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      quality={80}
      className={className}
      onError={() => setFailedSrc(src)}
      {...props}
    />
  );
}
