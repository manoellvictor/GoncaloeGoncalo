import { sanitizarHtmlArtigo } from "@/lib/sanitizar-html";

/**
 * Corpo do artigo: o HTML do editor do painel, sanitizado no servidor na hora
 * de exibir (além de já ter sido limpo ao salvar). O estilo de subtítulos,
 * listas, citações, links e imagens fica em `.artigo-corpo` (globals.css).
 */
export function CorpoPublicacao({ conteudo }: { conteudo: string }) {
  return (
    <div
      className="artigo-corpo"
      dangerouslySetInnerHTML={{ __html: sanitizarHtmlArtigo(conteudo) }}
    />
  );
}
