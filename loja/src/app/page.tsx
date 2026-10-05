import { ComoPedir } from "@/components/home/ComoPedir";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Sequencia } from "@/components/home/Sequencia";
import { Vitrine } from "@/components/home/Vitrine";
import { getAnsweredFaq } from "@/data/faq";
import { getFeaturedProduct, getProduct, getProducts, sequenceSlugs } from "@/data/products";
import type { Product } from "@/types/product";

const MANIFESTO_PRODUCT = "cristo-em-mim";

export default function HomePage() {
  const featured = getFeaturedProduct();
  const sequence = sequenceSlugs.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p));
  const manifesto = getProduct(MANIFESTO_PRODUCT) ?? featured;

  return (
    <>
      <Hero product={featured} />
      <Vitrine products={getProducts()} />
      <Manifesto product={manifesto} />
      <Sequencia products={sequence} />
      <ComoPedir />
      <Faq items={getAnsweredFaq()} />
      <CtaFinal />
    </>
  );
}
