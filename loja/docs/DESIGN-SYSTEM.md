# Design system

Identidade marrom e bege, em continuidade com o site _Vestindo seu Ministério_. O código desse site não estava
disponível no workspace, então os valores vêm da estimativa do briefing (feita a partir de uma captura de tela).
**Se o site existente divergir, ele vence:** atualize os tokens em `src/app/globals.css` e esta página.

## Cores

| Token          | Valor     | Uso                                                     |
| -------------- | --------- | ------------------------------------------------------- |
| `page`         | `#F1EAD9` | fundo da página, `theme-color`                          |
| `surface`      | `#E8DFCB` | tiles de foto (é o fundo das fotos), faixas de destaque |
| `ink`          | `#2B1F16` | texto principal e títulos                               |
| `brand`        | `#4A3326` | botões e destaques                                      |
| `brand-strong` | `#3A281D` | hover do botão principal                                |
| `on-brand`     | `#F6F0E4` | texto sobre `brand`                                     |
| `muted`        | `#6E5E4F` | texto secundário                                        |
| `line`         | `#D8CCB4` | divisórias e bordas                                     |

**Ajuste de acessibilidade:** o briefing estimava `muted = #7A6A5A`, que dá contraste 4,34:1 sobre `page` e
3,93:1 sobre `surface` (abaixo do AA 4,5:1). Foi escurecido para `#6E5E4F` (5,19:1 e 4,69:1).
Outros pares: ink/page 13,4:1 · on-brand/brand 10,3:1 · brand/page 9,8:1.

Cores das camisas (bolinhas): preto `#1C1C1C`, branco `#ECECEA`, verde `#3F5B2E`, azul `#1F2A7A`.

## Tipografia

- **Cormorant Garamond** 500/600, com itálico — títulos, wordmark, referências bíblicas.
- **Inter** — texto e interface.

| Classe         | Tamanho             | Uso                             |
| -------------- | ------------------- | ------------------------------- |
| `text-display` | 44 → 84 px, lh 0,98 | título do hero                  |
| `text-h1`      | 40 → 60 px          | nome do produto, manifesto, 404 |
| `text-h2`      | 32 → 48 px          | títulos de seção                |
| `text-h3`      | 22 → 26 px          | nome no card, passos            |
| `text-lead`    | 18 px, lh 1,6       | parágrafos de destaque          |
| `text-body`    | 16 px, lh 1,65      | texto corrido                   |
| `text-caption` | 13 px               | legendas, notas                 |

Linhas de texto limitadas a menos de 80 caracteres (`max-w-xl`, `max-w-prose` etc.).
Ênfase de título: a segunda frase em itálico na cor `brand` ("Mais que uma roupa. _Uma palavra._").

## Forma

Raio cresce com a hierarquia: `rounded-control` 10 px (botões, campos) < `rounded-card` 18 px (miniaturas)
< `rounded-tile` 28 px (fotos de produto, bloco da chamada final). Fotos vivem em tiles `surface` sobre `page`.
Sem sombras nos cards: a própria foto já tem a sombra sob a camisa.

## Componentes

- **Button / ButtonLink** — `primary` (brand), `secondary` (contorno), `inverse` (sobre brand), `quiet`; tamanhos `md` (44 px) e `lg` (52 px).
- **SafeImage** — `next/image` com fallback em tile.
- **ProductCard** — tile 4:5 + nome + preço + bolinhas; hover (só com mouse) mostra o outro lado.
- **Gallery** — frente/costas com miniaturas e gesto de arrastar no celular.
- **ColorPicker / SizePicker** — radios nativos estilizados (setas do teclado funcionam), alvos ≥ 44 px.
- **MessageBlock** — "A mensagem por trás da arte": referência grande em itálico + mensagem.
- **Wordmark** — "Over*Soul*" em texto; troque por `public/brand/logo.svg` e ele é usado automaticamente.

## Movimento

Um momento orquestrado: a entrada do hero (`animate-rise` no texto, `animate-settle` na foto, em sequência).
Fora isso, só respostas a ações: trocar frente/costas, trocar cor, hover nos cards. `prefers-reduced-motion`
desliga tudo.

## Qualidade mínima

Mobile-first (375, 768, 1280 px), foco visível (`outline` 2 px brand), skip link, alvos ≥ 44 px, contraste AA.

## Evitar

- Acento terracota; gradientes decorativos.
- A mesma sombra cinza em todos os cards.
- Rótulo em caixa-alta espaçada antes de todo título — usado **uma vez**, no hero.
- Seta "→" em todo botão.
- Numeração em seções que não são sequência real (só _Ele venceu → vive → voltará_ e _Como pedir_ são numerados).
