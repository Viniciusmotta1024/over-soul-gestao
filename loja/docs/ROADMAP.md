# Roadmap

Fora da v1, por decisão de escopo. O código já tem pontos de extensão marcados.

## Curto prazo

- **Conteúdo:** preencher tudo de [PENDENCIAS.md](PENDENCIAS.md) (preços, mensagens, tamanhos, FAQ).
- **Analytics:** Vercel Web Analytics ou Plausible; evento no clique de "Pedir no WhatsApp" (produto, cor, tamanho).
- **Fotos extras** (gola, tecido) na galeria — o campo `variants[].images.extras` já existe.
- **Logo em arquivo:** colocar `public/brand/logo.svg` (o `Wordmark` passa a usá-lo).

## Médio prazo

- **Carrinho** com vários itens em uma única mensagem de WhatsApp.
- **Estoque/disponibilidade por tamanho** (campo novo em `ProductVariant`).
- **Checkout real** (Mercado Pago, Stripe ou Pix) — exigiria rotas de servidor, segredos (`.env.local`) e política de troca publicada.

## Longo prazo

- CMS leve (ex.: arquivos MDX ou um headless CMS) se a edição por arquivo ficar pesada.
- Blog/devocionais ligados às artes.
- Integração visual com o site _Vestindo seu Ministério_.
