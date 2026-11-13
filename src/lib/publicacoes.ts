import { practiceAreas, siteConfig, contact } from "./site-config";
import type { AreaArtigo, TipoArtigo } from "./supabase/database.types";

/**
 * Modelo das publicações do hub "Conteúdo Jurídico" (/artigos).
 *
 * O banco guarda os artigos na tabela `artigos` (escrita pelo painel /admin);
 * as páginas e os cards trabalham com `Publicacao`, montada em
 * supabase/queries.ts. Este arquivo não importa nada de servidor: os cards do
 * feed também rodam no cliente ("Carregar mais").
 */

export type TipoPublicacao = TipoArtigo;

/**
 * Áreas das publicações — as mesmas de `practiceAreas`, na mesma ordem.
 * `nome` é o valor gravado no banco (enum area_artigo) e o rótulo curto dos
 * filtros; `chave` é o valor do filtro na URL (/artigos?area=tributario).
 */
export type AreaPublicacao = {
  /** Slug da área de atuação (/areas-de-atuacao/[slug]). */
  slug: string;
  chave: string;
  nome: AreaArtigo;
  /** Nome completo, ex.: "Direito Tributário". */
  titulo: string;
};

const NOMES_CURTOS: Record<string, { chave: string; nome: AreaArtigo }> = {
  "direito-tributario": { chave: "tributario", nome: "Tributário" },
  "direito-civil": { chave: "civel", nome: "Cível" },
  "direito-contratual": { chave: "contratual", nome: "Contratual" },
  "direito-empresarial": { chave: "empresarial", nome: "Empresarial" },
  "direito-administrativo": { chave: "administrativo", nome: "Administrativo" },
  "direito-trabalhista": { chave: "trabalhista", nome: "Trabalhista" },
  "direito-do-agronegocio": { chave: "agronegocio", nome: "Agronegócio" },
};

export const areasPublicacao: readonly AreaPublicacao[] = practiceAreas.map(
  (area) => ({ slug: area.slug, titulo: area.title, ...NOMES_CURTOS[area.slug] }),
);

export function areaPorNome(nome: string | null): AreaPublicacao | null {
  return areasPublicacao.find((area) => area.nome === nome) ?? null;
}

export function areaPorChave(chave: string | undefined): AreaPublicacao | null {
  return areasPublicacao.find((area) => area.chave === chave) ?? null;
}

export type CapaVideo = {
  mp4: string;
  webm: string | null;
  poster: string | null;
};

export type CapaImagem = { url: string; alt: string };

export type Publicacao = {
  slug: string;
  titulo: string;
  resumo: string;
  /** HTML do editor, já sanitizado no servidor na hora de exibir. */
  conteudo: string;
  tipo: TipoPublicacao;
  area: AreaPublicacao | null;
  dataPublicacao: string;
  /** Última alteração (JSON-LD dateModified). */
  dataAtualizacao: string;
  /** Texto livre, ex.: "Dra. Fulana – OAB/MA 0000". */
  autor: string | null;
  /** Minutos, calculado a partir do texto. */
  tempoLeitura: number | null;
  capa: CapaImagem | null;
  videoInstagram: string | null;
  destaque: boolean;
  seoTitulo: string | null;
  seoDescricao: string | null;
};

/** Só o que os cards do feed precisam — é o que trafega no "Carregar mais". */
export type PublicacaoCard = Pick<
  Publicacao,
  "slug" | "titulo" | "resumo" | "tipo" | "area" | "dataPublicacao" | "capa"
>;

export function paraCard(publicacao: Publicacao): PublicacaoCard {
  const { slug, titulo, resumo, tipo, area, dataPublicacao, capa } = publicacao;
  return { slug, titulo, resumo, tipo, area, dataPublicacao, capa };
}

/** Texto puro de um HTML do editor (tempo de leitura, descrições). */
export function textoDoHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tempo de leitura a ~200 palavras por minuto; vazio se não houver texto. */
export function calcularTempoLeitura(html: string): number | null {
  const palavras = textoDoHtml(html).split(" ").filter(Boolean).length;
  return palavras > 0 ? Math.max(1, Math.round(palavras / 200)) : null;
}

export function urlPublicacao(slug: string): string {
  return `${siteConfig.url}/artigos/${slug}`;
}

/** Compartilhamento pelo WhatsApp: título + URL, sem destinatário definido. */
export function whatsappCompartilhar(titulo: string, slug: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${titulo} ${urlPublicacao(slug)}`)}`;
}

export function linkedinCompartilhar(slug: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    urlPublicacao(slug),
  )}`;
}

/** Conversa com o escritório a partir de uma publicação. */
export function whatsappSobrePublicacao(titulo: string): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    `Olá, li o conteúdo sobre ${titulo} e gostaria de conversar.`,
  )}`;
}

/** Monta a URL da listagem preservando só os parâmetros com valor. */
export function hrefListagem({
  area,
  pagina,
  q,
}: {
  area?: string | null;
  pagina?: number;
  q?: string;
}): string {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (area) search.set("area", area);
  if (pagina && pagina > 1) search.set("pagina", String(pagina));
  const qs = search.toString();
  return qs ? `/artigos?${qs}` : "/artigos";
}
