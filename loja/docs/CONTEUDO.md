# Conteúdo: como editar

Tudo fica em arquivos dentro de `loja/src/data/`. Depois de editar, rode `npm run check` para ver o que ainda falta.

## Editar uma camisa — `src/data/products.ts`

```ts
{
  slug: "viver-e-cristo",          // vira /produtos/viver-e-cristo (não mude depois de publicar)
  name: "Viver é Cristo",
  reference: "Filipenses 1:21",    // opcional — só se confirmado
  message: "Duas a quatro frases sobre a palavra da camisa.", // opcional
  price: 119.9,                    // opcional — sem ele aparece "Valor no WhatsApp"
  variants: [variant("viver-e-cristo", "verde")], // a primeira cor é a padrão
  cover: "verso",                  // opcional — lado mostrado no card (padrão: verso)
  featured: true,                  // só UM produto: é o do hero
  order: 1,                        // posição na vitrine
}
```

- **Nunca** preencha preço, versículo ou mensagem com chute. Campo vazio = campo some do site.
- `tagline` existe no tipo para uso futuro no card; hoje não é exibido.

## Adicionar uma camisa nova

1. Coloque as fotos em `assets-source/<slug>/<cor>-frente.png` e `<cor>-verso.png` (padrão em [IMAGENS.md](IMAGENS.md)).
2. Adicione o slug e as cores no `INVENTORY` de `scripts/optimize-images.mjs` e rode `npm run images`.
3. Adicione o objeto em `products.ts` com o próximo `order`.
4. `npm run check` e `npm run build`.

Cores disponíveis: `preto`, `branco`, `verde`, `azul`. Para uma cor nova, inclua em `ProductColor`
(`src/types/product.ts`), em `colorLabels` e `colorSwatches` (`src/data/site.ts`).

## Tamanhos, medidas, tecido — `src/data/site.ts`

```ts
sizes: ["P", "M", "G", "GG"],   // ativa o seletor de tamanho e o exige antes do pedido
sizeChart: [{ size: "P", measures: { Largura: 50, Comprimento: 70 } }], // tabela em cm
fabric: "Malha 240 g/m²",
madeIn: "Feita no Brasil",
```

Vazio = o item não aparece.

## FAQ — `src/data/faq.ts`

Preencha `answer`. Só perguntas com resposta aparecem. Quando a primeira resposta for preenchida, a seção
"Dúvidas" e o link no menu aparecem sozinhos.

## Textos da home

| Seção                              | Arquivo                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| Hero (título, subtítulo)           | `src/components/home/Hero.tsx`                                                        |
| Vitrine (subtítulo)                | `src/components/home/Vitrine.tsx`                                                     |
| Manifesto                          | `src/components/home/Manifesto.tsx` (foto: `MANIFESTO_PRODUCT` em `src/app/page.tsx`) |
| Ele venceu. Ele vive. Ele voltará. | `src/components/home/Sequencia.tsx` (produtos: `sequenceSlugs` em `products.ts`)      |
| Como pedir                         | `src/components/home/ComoPedir.tsx`                                                   |
| Chamada final                      | `src/components/home/CtaFinal.tsx`                                                    |
| Descrição para Google/redes        | `description` em `src/data/site.ts`                                                   |

## Mensagem do WhatsApp — `src/lib/whatsapp.ts`

> Olá! Quero a camiseta {nome} ({cor}), tamanho {tamanho}. Pode me passar o valor e as formas de pagamento?

O tamanho é omitido quando não há tamanhos cadastrados.
