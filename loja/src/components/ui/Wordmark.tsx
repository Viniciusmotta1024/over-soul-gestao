import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";

const LOGO_FILE = "brand/logo.svg";

/** "OverSoul" wordmark. Drop a logo at public/brand/logo.svg to replace the text version. */
export function Wordmark({ className = "" }: { className?: string }) {
  if (existsSync(path.join(process.cwd(), "public", LOGO_FILE))) {
    return <Image src={`/${LOGO_FILE}`} alt="OverSoul" width={132} height={32} className={className} />;
  }
  return (
    <span className={`font-serif font-semibold tracking-tight ${className}`}>
      Over<em className="font-medium">Soul</em>
    </span>
  );
}
