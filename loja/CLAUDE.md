# OverSoul — loja de camisas

@AGENTS.md

Site da frente de venda de camisas da OverSoul. Pedido por WhatsApp, sem checkout.
Site e documentos em pt-BR; código, nomes de arquivos e commits em inglês.

## Stack

Next.js 16 (App Router) + TypeScript strict + Tailwind CSS 4, `next/font`, `next/image`. Deploy na Vercel.
Catálogo em arquivos TypeScript (sem banco, sem CMS). Componentes de servidor por padrão;
`"use client"` só em `HeroShirt`, `SafeImage`, `ProductView`, `Gallery`, `ColorPicker`, `SizePicker`, `OrderButton`.

## Comandos (rodar dentro de `loja/`)

- `npm run dev` — desenvolvimento em http://localhost:3000
- `npm run build` — build de produção (o `prebuild` roda o check; estrito se `VERCEL_ENV=production`)
- `npm run lint` — ESLint · `npm run format` — Prettier
- `npm run check` — lista o que falta preencher · `npm run check:strict` — falha se faltar o essencial
- `npm run images` — converte `assets-source/*.png` em `public/produtos/*.webp`

## Onde editar

- Camisas: `src/data/products.ts` (tipos em `src/types/product.ts`)
- Tamanhos, medidas, tecido, origem: `src/data/site.ts`
- FAQ: `src/data/faq.ts`
- Textos da home: `src/components/home/*.tsx`
- Contatos e URL: variáveis de ambiente (`.env.example`)

## Regra de ouro: nada de placeholder em produção

1. Dado ausente nunca vira texto provisório: o campo/seção não renderiza ou usa fallback honesto ("Valor no WhatsApp").
2. Nunca invente preço, versículo, prazo, gramatura, política de troca ou afirmação sobre a marca. Se não foi informado, vai para `docs/PENDENCIAS.md`.
3. `npm run check:strict` precisa passar antes de publicar.

## Fotos

As 24 fotos em `assets-source/` são finais: só converter/otimizar, nunca editar, recortar ou regenerar.
Nunca exibir foto com mais de ~560 px CSS de largura, nem em tela cheia ou com zoom > 100% (ver `docs/IMAGENS.md`).

## Tokens

page `#F1EAD9` · surface `#E8DFCB` (fundo das fotos) · ink `#2B1F16` · brand `#4A3326` · on-brand `#F6F0E4` ·
muted `#6E5E4F` · line `#D8CCB4`. Camisas: preto `#1C1C1C`, branco `#ECECEA`, verde `#3F5B2E`, azul `#1F2A7A`.
Fontes: Cormorant Garamond (títulos) + Inter (texto). Raios: control 10px < card 18px < tile 28px.

## Evitar

Acento terracota; gradientes decorativos; mesma sombra cinza em todos os cards; rótulo em caixa-alta espaçada
antes de todo título (só uma vez, no hero); seta "→" em todo botão; numeração em seções que não são sequência real;
animações além da entrada do hero e das respostas a ações do usuário.
