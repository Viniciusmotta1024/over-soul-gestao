# Imagens

## Padrão das fotos

- PNG **1080×1350 (4:5)**, fundo liso **`#E8DFCB`** (= token `surface`), camisa centralizada (~62% da largura),
  sombra suave sob a barra.
- O fundo e a sombra foram aplicados por recorte; a camisa e a arte são os pixels originais.
- **Não edite, recorte, redesenhe nem regenere** (nem com IA, nem com filtros). Só converter e otimizar.

## Nomenclatura

```
assets-source/<slug>/<cor>-<frente|verso>.png   → original (versionado)
public/produtos/<slug>/<cor>-<frente|verso>.webp → gerado (versionado)
```

Cor em minúsculas: `preto`, `branco`, `verde`, `azul`. Lado: `frente` ou `verso` (costas, onde costuma estar a arte).

## Inventário atual (24 fotos, conferido)

| slug                | cores         |
| ------------------- | ------------- |
| viver-e-cristo      | verde (hero)  |
| is-the-same         | preto, branco |
| jesus-vive          | preto         |
| venceu-a-morte      | preto         |
| jesus-esta-voltando | preto         |
| cristo-em-mim       | azul          |
| frutos-do-espirito  | preto         |
| jesus-cristo        | branco, verde |
| evangelho           | branco        |
| faith               | branco        |

## Fluxo Flow → site

1. Gerar/fotografar a peça e padronizar (fundo `#E8DFCB`, 1080×1350, camisa ~62%) fora do projeto.
2. Salvar em `assets-source/<slug>/<cor>-<lado>.png`.
3. Atualizar o `INVENTORY` em `scripts/optimize-images.mjs` se for camisa/cor nova.
4. `npm run images` — gera WebP (qualidade 85, cai até 70 se passar de 150 KB), **nunca amplia**, valida o
   inventário (falta = erro; sobra = aviso) e imprime o relatório. É idempotente: só reconverte o que mudou
   (`--force` refaz tudo).
5. Conferir os caminhos em `src/data/products.ts` e rodar `npm run check`.

Resultado atual: 24 WebP, 9–36 KB cada, 524 KB no total.

## Onde cada foto aparece

| Lugar                       | Foto                                                               | Largura máx. (CSS) |
| --------------------------- | ------------------------------------------------------------------ | ------------------ |
| Hero                        | `viver-e-cristo/verde-verso` ↔ `verde-frente`                      | 520 px             |
| Vitrine                     | `cover` de cada produto (padrão: verso); hover mostra o outro lado | ~240 px            |
| Manifesto                   | `cristo-em-mim/azul-verso`                                         | 416 px             |
| Ele venceu / vive / voltará | `preto-verso` dos três                                             | ~380 px            |
| Galeria do produto          | frente e verso da cor escolhida                                    | **560 px**         |
| Veja também                 | `cover`                                                            | ~400 px            |
| Open Graph                  | PNG original do `cover`, em 504×630 dentro de 1200×630             | —                  |

Alt text automático: "Camiseta {nome} {cor}, vista {de frente|de costas}".

## Limite de resolução (importante)

**10 das 24 fotos** vieram de mockups menores e foram ampliadas cerca de 30%; o texto miúdo do verso fica um
pouco mais macio nelas:

- `evangelho/branco-frente`, `evangelho/branco-verso`
- `faith/branco-frente`, `faith/branco-verso`
- `frutos-do-espirito/preto-frente`, `frutos-do-espirito/preto-verso`
- `jesus-esta-voltando/preto-frente`, `jesus-esta-voltando/preto-verso`
- `is-the-same/preto-frente`, `is-the-same/preto-verso`

As demais estão em escala próxima de 1:1. Por isso:

- **nunca exibir uma foto com mais de ~560 px CSS de largura** (1080 px físicos em tela 2×);
- sem imagem de fundo em tela cheia;
- sem zoom acima de 100%.

Quando houver versões em resolução maior dessas 10, substitua os PNG em `assets-source/` (mesmo nome) e rode
`npm run images`. Mesmo assim, mantenha o limite enquanto houver fotos 1080 px.

## Fotos extras

Gola, tecido, detalhe: adicione em `variants[].images.extras` (caminhos em `/public`). O check acusa se o
arquivo não existir. A galeria ainda não exibe extras (ver [ROADMAP.md](ROADMAP.md)).
