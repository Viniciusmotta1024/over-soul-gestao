# Pendências — o que falta o dono preencher

Nada abaixo foi inventado no site: enquanto estiver vazio, o campo ou a seção simplesmente não aparece
(ou mostra "Valor no WhatsApp"). Rode `npm run check` para ver o estado atualizado.

## Essencial para publicar

- [ ] **Número do WhatsApp** da loja → `NEXT_PUBLIC_WHATSAPP_NUMBER` (formato `55DDDNÚMERO`). Sem ele o build de produção falha.

## Importante

- [ ] **URL final do site** → `NEXT_PUBLIC_SITE_URL` (SEO, sitemap, prévias de link).
- [ ] **Preço** das 10 camisas → `price` em `src/data/products.ts`. (Ou decidir manter "Valor no WhatsApp".)
- [ ] **"A mensagem por trás da arte"** (2–4 frases) das 10 camisas → `message`. É o diferencial do site.
- [ ] **Tamanhos disponíveis** → `site.sizes` em `src/data/site.ts` (ativa o seletor e inclui o tamanho na mensagem).
- [ ] **Tabela de medidas** (cm) → `site.sizeChart`.
- [ ] **Respostas do FAQ** → `src/data/faq.ts`: Como funciona o pedido? · Qual o prazo? · Como escolher o tamanho? · Como pago? · Posso trocar? (prazo, pagamento e troca precisam vir do dono).

## Quando puder

- [ ] **Instagram** → `NEXT_PUBLIC_INSTAGRAM_URL`.
- [ ] **Link do Vestindo seu Ministério** → `NEXT_PUBLIC_MINISTRY_URL`.
- [ ] **Referência bíblica** (só se houver) de: Jesus Vive, Venceu a Morte, Jesus está voltando, Jesus Cristo, Faith.
- [ ] **Tecido/gramatura** → `site.fabric` (ex.: "Malha 240 g/m²") e **origem** → `site.madeIn`.
- [ ] **Logo em arquivo** (opcional) → `public/brand/logo.svg`.
- [ ] **Tokens do Vestindo seu Ministério:** conferir cores/fontes com o site existente (os valores atuais são estimativa).
- [ ] **Fotos em resolução maior** das 10 fotos ampliadas (lista em [IMAGENS.md](IMAGENS.md)).

## Textos em rascunho para revisar

- Hero: título _"Mais que uma roupa. Uma palavra."_ e subtítulo (`src/components/home/Hero.tsx`).
- Vitrine: _"Cada arte carrega uma palavra: discreta na frente, inteira nas costas."_
- Manifesto inteiro (`src/components/home/Manifesto.tsx`).
- Sequência: _"Três camisas, uma história contada em ordem."_
- Chamada final: _"Qual palavra você vai vestir?"_ / _"Fale com a gente no WhatsApp e tire suas dúvidas antes de pedir."_
- Nota sob o botão de pedido: _"A mensagem já vai pronta. Pagamento e entrega você combina direto com a gente."_
- 404: _"Essa página não existe. O link pode ter mudado. As camisas continuam todas aqui."_

## Saída do `npm run check` (sem `.env.local`, 04/10/2026)

```
Verificação de conteúdo — OverSoul

ESSENCIAL PARA PUBLICAR (1)
  - NEXT_PUBLIC_WHATSAPP_NUMBER vazio (pedidos não chegam à loja).

IMPORTANTE (6)
  - NEXT_PUBLIC_SITE_URL vazio (usando http://localhost:3000 em SEO, sitemap e Open Graph).
  - Sem preço (10), mostra "Valor no WhatsApp": Viver é Cristo, Is The Same, Jesus Vive, Venceu a Morte, Jesus está voltando, Cristo em mim, Frutos do Espírito, Jesus Cristo, Evangelho, Faith.
  - Sem "mensagem por trás da arte" (10): Viver é Cristo, Is The Same, Jesus Vive, Venceu a Morte, Jesus está voltando, Cristo em mim, Frutos do Espírito, Jesus Cristo, Evangelho, Faith.
  - site.sizes vazio: a página do produto não mostra seletor de tamanho.
  - site.sizeChart vazio: sem tabela de medidas.
  - FAQ sem nenhuma resposta: a seção Dúvidas e o link do menu estão ocultos.

QUANDO PUDER (6)
  - NEXT_PUBLIC_INSTAGRAM_URL vazio (link do Instagram não aparece no rodapé).
  - NEXT_PUBLIC_MINISTRY_URL vazio (link do Vestindo seu Ministério não aparece).
  - Sem referência bíblica (5, só se houver): Jesus Vive, Venceu a Morte, Jesus está voltando, Jesus Cristo, Faith.
  - site.fabric vazio (tecido/gramatura).
  - site.madeIn vazio (origem).
  - FAQ sem resposta (5): Como funciona o pedido? / Qual o prazo? / Como escolher o tamanho? / Como pago? / Posso trocar?

```
