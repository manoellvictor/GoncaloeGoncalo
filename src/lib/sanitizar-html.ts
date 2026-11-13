import sanitizeHtml from "sanitize-html";

/**
 * Limpa o HTML do corpo dos artigos (servidor: ao salvar e ao exibir).
 *
 * Só passa o que o editor do painel produz — parágrafos, subtítulos H2/H3,
 * negrito, itálico, listas, citação, links e imagens —, para nada colado de
 * outro lugar quebrar o layout do site ou injetar script. Imagens só do
 * próprio bucket `artigos` do Supabase.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const PREFIXO_IMAGENS = `${supabaseUrl}/storage/v1/object/public/artigos/`;

export function sanitizarHtmlArtigo(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "h2", "h3", "strong", "em", "ul", "ol", "li", "blockquote", "a", "img"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    // Links sempre em nova aba e sem passar o contexto da página.
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
      }),
      // Títulos de nível 1 colados de fora viram H2: o H1 é o título do artigo.
      h1: "h2",
      h4: "h3",
      h5: "h3",
      h6: "h3",
      b: "strong",
      i: "em",
    },
    exclusiveFilter: (frame) =>
      (frame.tag === "img" && !frame.attribs.src?.startsWith(PREFIXO_IMAGENS)) ||
      (frame.tag === "a" && !frame.attribs.href),
  });
}
