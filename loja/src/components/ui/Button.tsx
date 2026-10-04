import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "inverse" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-strong",
  secondary: "border border-brand/30 text-brand hover:border-brand hover:bg-brand/5",
  inverse: "bg-on-brand text-brand hover:bg-page",
  quiet: "text-brand underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-13 px-7 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({
  variant,
  size,
  className,
  ...props
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  external,
  ...props
}: CommonProps & { href: string; external?: boolean } & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  const classes = buttonClasses({ variant, size, className });
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props} />;
  }
  return <Link href={href} className={classes} {...props} />;
}
