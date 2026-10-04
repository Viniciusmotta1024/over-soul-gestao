# Deploy na Vercel

## 1. Antes de tudo

- Tenha o **número do WhatsApp** da loja no formato `55DDDNÚMERO` (só dígitos).
- Rode localmente: `npm run check:strict` precisa terminar sem erro com o `.env.local` preenchido.

## 2. Criar o projeto

1. Acesse vercel.com → **Add New… → Project** → importe o repositório `over-soul-gestao`.
2. Em **Root Directory**, clique em _Edit_ e escolha **`loja`**. (Importante: a raiz do repositório é o sistema de gestão.)
3. Framework Preset: **Next.js** (detectado). Build/Install/Output: deixe o padrão
   (`npm install`, `npm run build`). Node.js: 20.x ou mais novo (Settings → General).

## 3. Variáveis de ambiente

Em **Settings → Environment Variables**, cadastre para _Production_ (e _Preview_, se quiser testar):

| Variável                      | Exemplo                         | Obrigatória                                       |
| ----------------------------- | ------------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `55DDDNÚMERO`                   | **Sim** — sem ela o build de produção falha       |
| `NEXT_PUBLIC_SITE_URL`        | `https://seudominio.com.br`     | Recomendada (sem ela usa o domínio `.vercel.app`) |
| `NEXT_PUBLIC_INSTAGRAM_URL`   | link do perfil                  | Não — sem ela o link some                         |
| `NEXT_PUBLIC_MINISTRY_URL`    | link do Vestindo seu Ministério | Não — sem ela o link some                         |

Não reutilize números ou links de outros projetos. As variáveis `NEXT_PUBLIC_*` são embutidas no build:
**depois de mudar qualquer uma, faça um Redeploy.**

## 4. Deploy

Clique em **Deploy**. O `prebuild` roda `scripts/check-content.ts`:

- Em _Production_ (`VERCEL_ENV=production`) roda em **modo estrito**: falta de WhatsApp ou de fotos derruba o build
  com a lista do que corrigir.
- Em _Preview_ só imprime o relatório.

## 5. Domínio

1. **Settings → Domains → Add** e digite o domínio (ex.: `loja.seudominio.com.br`).
2. No provedor do domínio, crie exatamente o registro que a Vercel mostrar na tela (em geral um CNAME para subdomínio
   ou um registro A para domínio raiz; copie os valores de lá).
3. Aguarde a verificação e o certificado HTTPS (automático).
4. Atualize `NEXT_PUBLIC_SITE_URL` para o domínio final e faça **Redeploy**.

## 6. Conferir depois de publicar

- [ ] Home e uma página de produto abrem no celular.
- [ ] "Pedir no WhatsApp" abre a conversa com o número certo e a mensagem pronta.
- [ ] `/sitemap.xml` e `/robots.txt` mostram o domínio final.
- [ ] Compartilhar um link de produto no WhatsApp mostra a prévia com a foto.
- [ ] Nenhum texto provisório na tela.
- [ ] Lighthouse (mobile) em aba anônima: Performance ≥ 90, Acessibilidade ≥ 95.
