import Link from "next/link";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/data/site";
import { buildContactUrl } from "@/lib/whatsapp";
import { Container } from "./Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-page">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="text-3xl text-ink" aria-label="OverSoul, página inicial">
            <Wordmark />
          </Link>
          <p className="mt-3 font-serif text-xl italic text-muted">Mais que uma roupa, uma mensagem.</p>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <a
                href={buildContactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-ink/85 hover:text-ink"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            </li>
            {site.instagramUrl ? (
              <li>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-ink/85 hover:text-ink"
                >
                  <InstagramIcon className="size-4" />
                  Instagram
                </a>
              </li>
            ) : null}
          </ul>

          {site.ministryUrl ? (
            <a
              href={site.ministryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              Vestindo seu Ministério — identidade visual para igrejas
            </a>
          ) : null}

          <p className="text-caption text-muted">© {year} OverSoul</p>
        </div>
      </Container>
    </footer>
  );
}
