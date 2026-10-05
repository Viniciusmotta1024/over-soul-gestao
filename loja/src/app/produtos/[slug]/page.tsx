import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { MessageBlock } from "@/components/product/MessageBlock";
import { ProductView, ProductViewFromUrl } from "@/components/product/ProductView";
import { Related } from "@/components/product/Related";
import { Specs } from "@/components/product/Specs";
import { getProduct, getProducts, getRelatedProducts } from "@/data/products";
import { jsonLdScript, productDescription, productJsonLd, productUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const title = `Camiseta ${product.name}`;
  const description = productDescription(product);
  return {
    title,
    description,
    alternates: { canonical: productUrl(slug) },
    openGraph: { type: "website", title, description, url: productUrl(slug) },
  };
}

export default async function ProductPage({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const specs = <Specs />;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd(product)) }}
      />

      <Container className="pt-6 pb-16 sm:pt-10 sm:pb-24">
        <nav aria-label="Trilha" className="mb-6 text-sm text-muted sm:mb-10">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/#camisas" className="inline-flex min-h-11 items-center hover:text-ink">
                Camisas
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <Suspense fallback={<ProductView product={product}>{specs}</ProductView>}>
          <ProductViewFromUrl product={product}>{specs}</ProductViewFromUrl>
        </Suspense>
      </Container>

      <MessageBlock product={product} />
      <Related products={getRelatedProducts(product.slug)} />
    </>
  );
}
