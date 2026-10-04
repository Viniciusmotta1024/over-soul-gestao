# OverSoul — loja de camisas

Site da loja de camisas da **OverSoul**: _mais que uma roupa, uma mensagem._
Home com vitrine, página de cada camisa e pedido pelo WhatsApp com mensagem pronta.

> Este app fica na pasta `loja/` do repositório `over-soul-gestao`, separado do sistema de gestão da raiz.

## Rodando

```bash
cd loja
cp .env.example .env.local   # preencha o número do WhatsApp
npm install
npm run dev                  # http://localhost:3000
```

## Comandos

| Comando                | O que faz                                                             |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento                                           |
| `npm run build`        | Build de produção (roda o check antes)                                |
| `npm run start`        | Serve o build                                                         |
| `npm run lint`         | ESLint                                                                |
| `npm run format`       | Prettier                                                              |
| `npm run check`        | Lista o que falta preencher (preço, mensagens, FAQ…)                  |
| `npm run check:strict` | Falha se faltar o essencial para publicar                             |
| `npm run images`       | Converte as fotos de `assets-source/` para WebP em `public/produtos/` |

## Documentação

- [docs/BRIEFING.md](docs/BRIEFING.md) — marca, público, tom de voz, escopo
- [docs/ARQUITETURA.md](docs/ARQUITETURA.md) — stack, decisões e fluxo de dados
- [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) — tokens, tipografia, componentes
- [docs/CONTEUDO.md](docs/CONTEUDO.md) — como editar camisas, FAQ e textos
- [docs/IMAGENS.md](docs/IMAGENS.md) — padrão e fluxo das fotos
- [docs/DEPLOY.md](docs/DEPLOY.md) — publicação na Vercel
- [docs/ROADMAP.md](docs/ROADMAP.md) — próximos passos
- [docs/PENDENCIAS.md](docs/PENDENCIAS.md) — o que falta o dono preencher
