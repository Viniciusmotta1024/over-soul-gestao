import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getAnsweredFaq } from "@/data/faq";
import { site } from "@/data/site";
import "./globals.css";

// Cormorant Garamond is self-hosted from static files (@fontsource, OFL) so the
// same files serve the site and the generated images (OG, icons), and builds do
// not depend on Google Fonts being reachable.
const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    { path: "../assets/fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../assets/fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#F1EAD9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const hasFaq = getAnsweredFaq().length > 0;

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only rounded-control bg-brand px-4 py-3 text-on-brand focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Pular para o conteúdo
        </a>
        <Header showFaq={hasFaq} />
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
