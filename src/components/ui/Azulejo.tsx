/**
 * Faixa de azulejo dos cards de área da home — padrões inspirados nos
 * azulejos do Centro Histórico de São Luís.
 *
 * Desenhado em SVG (ladrilho de 40×40 repetido por <pattern>): fica nítido em
 * qualquer tela e não pesa como foto. Puramente decorativo (aria-hidden).
 */

export type PadraoAzulejo = "estrelas" | "circulos" | "flores" | "losangos";

const CORES = {
  claro: { fundo: "var(--color-azulejo-50)", traco: "var(--color-azulejo-700)" },
  escuro: { fundo: "var(--color-azulejo-700)", traco: "var(--color-azulejo-50)" },
} as const;

const OURO = "var(--color-gold-500)";

function Ladrilho({
  padrao,
  traco,
  destaque,
}: {
  padrao: PadraoAzulejo;
  traco: string;
  destaque: string;
}) {
  const cantos = [
    [0, 0],
    [40, 0],
    [0, 40],
    [40, 40],
  ];
  const losango = (x: number, y: number, r: number) =>
    `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;

  switch (padrao) {
    case "estrelas":
      return (
        <>
          <path d="M20 7l3 10 10 3-10 3-3 10-3-10-10-3 10-3z" fill={traco} />
          {cantos.map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x - 4.5} ${y}h9M${x} ${y - 4.5}v9`}
              stroke={traco}
              strokeWidth={1.6}
            />
          ))}
          {[
            [20, 0],
            [20, 40],
            [0, 20],
            [40, 20],
          ].map(([x, y]) => (
            <path key={`${x}-${y}`} d={losango(x, y, 2)} fill={destaque} />
          ))}
        </>
      );
    case "circulos":
      return (
        <>
          <circle cx={20} cy={20} r={15} fill="none" stroke={traco} strokeWidth={1.5} />
          {cantos.map(([x, y]) => (
            <path key={`${x}-${y}`} d={losango(x, y, 3)} fill={destaque} />
          ))}
        </>
      );
    case "flores":
      return (
        <>
          <g fill={traco}>
            {[0, 90, 180, 270].map((angulo) => (
              <ellipse
                key={angulo}
                cx={20}
                cy={12.5}
                rx={3.4}
                ry={6}
                transform={`rotate(${angulo} 20 20)`}
              />
            ))}
          </g>
          {cantos.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={2.6} fill={destaque} />
          ))}
        </>
      );
    case "losangos":
      return (
        <>
          <path
            d="M0 0L40 40M40 0L0 40"
            stroke={traco}
            strokeWidth={1.5}
            fill="none"
          />
          <path d={losango(20, 0, 3)} fill={traco} />
          <path d={losango(20, 40, 3)} fill={traco} />
          <circle cx={0} cy={20} r={2.6} fill={destaque} />
          <circle cx={40} cy={20} r={2.6} fill={destaque} />
        </>
      );
  }
}

export function Azulejo({
  id,
  padrao,
  fundo,
  destaqueDourado = true,
  className,
}: {
  /** Único na página: nomeia o <pattern> do SVG. */
  id: string;
  padrao: PadraoAzulejo;
  fundo: keyof typeof CORES;
  /** Pequenos detalhes em dourado; `false` usa a cor do traço. */
  destaqueDourado?: boolean;
  className?: string;
}) {
  const { fundo: corFundo, traco } = CORES[fundo];
  const patternId = `azulejo-${id}`;

  return (
    <svg aria-hidden="true" className={className} width="100%" height="100%">
      <defs>
        <pattern
          id={patternId}
          width={40}
          height={40}
          patternUnits="userSpaceOnUse"
        >
          <rect width={40} height={40} fill={corFundo} />
          <Ladrilho padrao={padrao} traco={traco} destaque={destaqueDourado ? OURO : traco} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
