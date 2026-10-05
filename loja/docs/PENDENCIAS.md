# Pendências — o que falta o dono preencher

Nada abaixo foi inventado no site: enquanto estiver vazio, o campo ou a seção simplesmente não aparece
(ou mostra "Valor no WhatsApp"). Rode `npm run check` para ver o estado atualizado.

## Já preenchido

- [x] WhatsApp `5521998959167` e URL `https://lojaoversoul.com.br` (padrões em `src/data/site.ts`).
- [x] Tamanhos P, M, G, GG, G1 e tabela de medidas da oversize americana (variação de ±2 cm).
- [x] Ficha técnica: oversize americana, gola alta canelada 3 cm, 100% algodão, fio 30.1, 160 g/m², reforço de ombro a ombro.
- [x] Origem: feita no Rio de Janeiro, Brasil.
- [x] Preço: R$ 89,90 para todas (constante `PRICE` em `src/data/products.ts`).
- [x] Lançamentos: Jesus Vive e Venceu a Morte (`isNew: true`). Tire o selo quando deixarem de ser novidade.
- [x] FAQ: pedido, tamanho, modelagem, tecido, cuidados, prazo (~15 dias até o envio, sob demanda) e pagamento (combinado no WhatsApp).

## Essencial para publicar

Nada. `npm run check:strict` passa.

## Importante

- [ ] **"A mensagem por trás da arte"** (2–4 frases) das 10 camisas → `message`. É o diferencial do site.
- [ ] **Política de troca** → resposta de "Posso trocar se não servir?" em `src/data/faq.ts` (hoje oculta).
- [ ] **Checkout:** quando decidir pela Yampi, trocar o destino do botão de pedido e atualizar a resposta "Como pago?".
- [ ] **Revisar as dicas de cuidado** do FAQ (pensadas para estampa DTF: lavar do avesso, água fria, sem ferro na estampa).

## Quando puder

- [ ] **Instagram** → `NEXT_PUBLIC_INSTAGRAM_URL` (hoje "a definir").
- [ ] **Link do Vestindo seu Ministério** → `NEXT_PUBLIC_MINISTRY_URL`.
- [ ] **Referência bíblica** (só se houver) de: Jesus Vive, Venceu a Morte, Jesus está voltando, Jesus Cristo, Faith.
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

## Saída do `npm run check` (05/10/2026)

```
Verificação de conteúdo — OverSoul

ESSENCIAL PARA PUBLICAR (0)
  ok

IMPORTANTE (1)
  - Sem "mensagem por trás da arte" (10): Viver é Cristo, Is The Same, Jesus Vive, Venceu a Morte, Jesus está voltando, Cristo em mim, Frutos do Espírito, Jesus Cristo, Evangelho, Faith.

QUANDO PUDER (4)
  - NEXT_PUBLIC_INSTAGRAM_URL vazio (link do Instagram não aparece no rodapé).
  - NEXT_PUBLIC_MINISTRY_URL vazio (link do Vestindo seu Ministério não aparece).
  - Sem referência bíblica (5, só se houver): Jesus Vive, Venceu a Morte, Jesus está voltando, Jesus Cristo, Faith.
  - FAQ sem resposta (1): Posso trocar se não servir?

```
