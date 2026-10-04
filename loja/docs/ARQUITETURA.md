# Arquitetura

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript strict**
- **Tailwind CSS 4** (tokens no `@theme` de `src/app/globals.css`)
- `next/font` (Inter do Google; Cormorant Garamond local em `src/assets/fonts`, licença OFL)
- `next/image` para todas as fotos; `next/og` para imagens Open Graph e ícones
- Dev: ESLint (config do Next), Prettier, `sharp` (otimização de imagens), `tsx` (scripts TS)
- Deploy: Vercel

## Onde fica

O repositório `over-soul-gestao` já tinha, na raiz, o sistema interno de gestão (Vite + Supabase).
Para não misturar os dois, a loja vive em **`loja/`**, com `package.json`, lockfile e configs próprios.
Na Vercel, configure **Root Directory = `loja`** (ver [DEPLOY.md](DEPLOY.md)).

## Estrutura

```
loja/
├─ assets-source/            fotos originais (PNG 1080×1350), versionadas
├─ public/produtos/          WebP gerados por `npm run images`, versionados
├─ scripts/
│  ├─ optimize-images.mjs    PNG → WebP, valida o inventário
│  └─ check-content.ts       relatório de pendências / modo estrito
└─ src/
   ├─ app/                   rotas, metadata, sitemap, robots, OG, ícones
   ├─ components/
   │  ├─ layout/             Header, Footer, Container
   │  ├─ home/               Hero, HeroShirt, Vitrine, Manifesto, Sequencia, ComoPedir, Faq, CtaFinal
   │  ├─ product/            ProductCard, ColorDots, ProductView, Gallery, ColorPicker, SizePicker,
   │  │                      OrderButton, MessageBlock, Specs, Related
   │  └─ ui/                 Button, SafeImage, Wordmark, icons
   ├─ data/                  products.ts, site.ts, faq.ts
   ├─ lib/                   whatsapp.ts, format.ts, seo.ts, og.tsx
   └─ types/                 product.ts
```

## Fluxo de dados

```
.env (NEXT_PUBLIC_*) ──► src/data/site.ts ─┐
src/data/products.ts ──────────────────────┼─► componentes de servidor ─► HTML estático
src/data/faq.ts ───────────────────────────┘          │
                                                      └─► ProductView (cliente): cor, lado, tamanho
                                                              └─► lib/whatsapp.ts ─► https://wa.me/<nº>?text=…
```

- Todas as páginas são **estáticas** (SSG). `generateStaticParams` gera as 10 páginas de produto; slug
  desconhecido dá 404 (`dynamicParams = false`).
- A cor escolhida vai para a URL (`?cor=branco`) via `history.replaceState`. A página continua estática: a
  leitura de `?cor=` acontece no cliente, dentro de `<Suspense>`, com a cor padrão como fallback.
- Variáveis `NEXT_PUBLIC_*` são embutidas no build. Mudou na Vercel → faça um novo deploy.

## Decisões

- **Sem dependências de UI/animação.** Animações em CSS; troca de lado e cor com `opacity`.
- **Um único estado de cliente por página de produto** (`ProductView`), para galeria e seletores
  compartilharem cor e lado.
- **`SafeImage`** nunca deixa imagem quebrada: se o arquivo falha, mostra o tile `surface` (com o nome em dev).
- **WhatsApp sem número em dev:** os links abrem `https://wa.me/?text=…` (o usuário escolhe o contato) e um aviso
  aparece no console. Em produção o `prebuild` estrito bloqueia o deploy.
- **Open Graph gerado** a partir das fotos originais (`assets-source/`) em PNG 1200×630, porque nem todo app de
  mensagens aceita WebP em prévias.
- **Preparado para evoluir:** `Product.price`, `variants[].images.extras` e `site.sizes` já existem nos tipos;
  carrinho/checkout ficam para o [ROADMAP.md](ROADMAP.md).
