/**
 * Corpo do artigo a partir do texto do banco. Blocos separados por linha em
 * branco; marcação mínima, para quem escreve no painel do Supabase:
 *
 *   ## Intertítulo
 *   ### Subtítulo
 *   - item de lista (uma linha por item)
 *
 * Qualquer outro bloco é parágrafo, no padrão de texto corrido do site.
 */
export function CorpoPublicacao({ conteudo }: { conteudo: string }) {
  const blocos = conteudo
    .split(/\n\s*\n/)
    .map((bloco) => bloco.trim())
    .filter(Boolean);

  return (
    <div className="texto-padrao [&>h2]:mt-12 [&>h2]:text-[1.75rem] [&>h2]:leading-tight [&>h3]:mt-8 [&>h3]:text-[1.375rem] [&>h3]:leading-snug [&>ul]:mt-5">
      {blocos.map((bloco, index) => {
        if (bloco.startsWith("### ")) return <h3 key={index}>{bloco.slice(4)}</h3>;
        if (bloco.startsWith("## ")) return <h2 key={index}>{bloco.slice(3)}</h2>;

        const linhas = bloco.split("\n");
        if (linhas.every((linha) => linha.trimStart().startsWith("- "))) {
          return (
            <ul
              key={index}
              className="list-disc space-y-2 pl-6 text-body-lg text-neutral-700 marker:text-gold-700"
            >
              {linhas.map((linha, i) => (
                <li key={i}>{linha.trimStart().slice(2)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="[h2+&]:mt-4 [h3+&]:mt-3 [ul+&]:mt-5">
            {bloco}
          </p>
        );
      })}
    </div>
  );
}
