import { site } from "@/data/site";

/** Model details, fabric, origin and size chart. Each item disappears when not filled in. */
export function Specs() {
  const chart = site.sizeChart;
  const columns = [...new Set(chart.flatMap((row) => Object.keys(row.measures)))];
  const items = [
    ...site.details,
    site.fabric ? { label: "Tecido", value: site.fabric } : null,
    site.madeIn ? { label: "Origem", value: site.madeIn } : null,
  ].filter((item) => item !== null);

  if (items.length === 0 && chart.length === 0) return null;

  return (
    <section aria-labelledby="specs-title" className="mt-10 border-t border-line pt-7">
      <h2 id="specs-title" className="font-serif text-h3 text-ink">
        Especificações
      </h2>

      {items.length > 0 ? (
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {items.map((item) => (
            <div key={item.label} className="contents">
              <dt className="text-muted">{item.label}</dt>
              <dd className="text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {chart.length > 0 ? (
        <div id="medidas" className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left text-sm">
            <caption className="pb-2 text-left text-caption text-muted">Medidas em centímetros</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Tamanho
                </th>
                {columns.map((col) => (
                  <th key={col} scope="col" className="py-2 pr-4 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.map((row) => (
                <tr key={row.size} className="border-b border-line/60">
                  <th scope="row" className="py-2 pr-4 font-medium">
                    {row.size}
                  </th>
                  {columns.map((col) => (
                    <td key={col} className="py-2 pr-4 text-ink/85">
                      {row.measures[col] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-caption text-muted">
            Largura: de uma axila à outra. Comprimento: do ombro, junto à gola, até a barra. Mangas: da
            costura do ombro até a ponta da manga.
            {site.sizeChartNote ? ` ${site.sizeChartNote}` : ""}
          </p>
        </div>
      ) : null}
    </section>
  );
}
