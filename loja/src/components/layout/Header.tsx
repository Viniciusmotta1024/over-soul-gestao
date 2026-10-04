import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Wordmark } from "@/components/ui/Wordmark";
import { buildContactUrl } from "@/lib/whatsapp";
import { Container } from "./Container";

export function Header({ showFaq }: { showFaq: boolean }) {
  const links = [
    { href: "/#camisas", label: "Camisas" },
    { href: "/#mensagem", label: "A mensagem" },
    ...(showFaq ? [{ href: "/#duvidas", label: "Dúvidas" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-page/90 backdrop-blur-md supports-[backdrop-filter]:bg-page/80">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="-mx-1 px-1 text-[1.75rem] leading-none text-ink"
          aria-label="OverSoul, página inicial"
        >
          <Wordmark />
        </Link>

        <nav aria-label="Principal" className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-control px-3 text-sm text-ink/80 transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={buildContactUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-control border border-brand/25 px-3 text-sm font-medium text-brand transition-colors hover:border-brand hover:bg-brand/5"
        >
          <WhatsAppIcon className="size-[18px]" />
          <span className="sr-only md:not-sr-only">Pedir no WhatsApp</span>
        </a>
      </Container>
    </header>
  );
}
