import { practiceAreas, siteConfig, contact } from "./site-config";

/**
 * Modelo das publicações do hub "Conteúdo Jurídico" (/artigos).
 *
 * O banco guarda os campos em `articles` (snake_case, ver database.types.ts);
 * as páginas e os cards trabalham com `Publicacao`, montada em
 * supabase/queries.ts. Este arquivo não importa nada de servidor: os cards do
 * feed também rodam no cliente ("Carregar mais").
 */

export type TipoPublicacao =
  | "Artigo"
  | "Notícia"
  | "Vídeo"
  | "Leitura rápida"
  | "Carrossel";

const TIPOS: Record<string, TipoPublicacao> = {
  artigo: "Artigo",
  noticia: "Notícia",
  video: "Vídeo",
  "leitura-rapida": "Leitura rápida",
  carrossel: "Carrossel",
};

export function tipoPublicacao(category: string): TipoPublicacao {
  return TIPOS[category] ?? "Artigo";
}

/**
 * Áreas das publicações — as mesmas de `practiceAreas`, na mesma ordem.
 * `chave` é o valor do filtro na URL (/artigos?area=tributario) e `nome` o
 * rótulo curto do rodapé e dos filtros.
 */
export type AreaPublicacao = {
  /** Slug da área de atuação (practice_areas.slug). */
  slug: string;
  chave: string;
  nome: string;
  /** Nome completo, ex.: "Direito Tributário". */
  titulo: string;
};

const NOMES_CURTOS: Record<string, { chave: string; nome: string }> = {
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

export function areaPorSlug(slug: string | null): AreaPublicacao | null {
  return areasPublicacao.find((area) => area.slug === slug) ?? null;
}

export function areaPorChave(chave: string | undefined): AreaPublicacao | null {
  return areasPublicacao.find((area) => area.chave === chave) ?? null;
}

export type Autor = {
  nome: string;
  oab: string | null;
  /** Âncora do card em /equipe (ver `slugify` em format.ts). */
  slugPerfil: string;
};

export type CapaVideo = {
  mp4: string;
  webm: string | null;
  poster: string | null;
};

export type Fonte = { titulo: string; url: string };

export type Publicacao = {
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string | null;
  tipo: TipoPublicacao;
  area: AreaPublicacao | null;
  dataPublicacao: string;
  dataAtualizacao: string | null;
  autor: Autor | null;
  /** Minutos; informado no banco ou calculado a partir do texto. */
  tempoLeitura: number | null;
  capaTitulo: string;
  capaVideo: CapaVideo | null;
  /** Poster da capa (com ou sem vídeo); também é a imagem de Open Graph. */
  capaPoster: string | null;
  fontes: Fonte[];
  emResumo: string[];
  destaque: boolean;
  metaDescription: string | null;
};

/** Só o que os cards do feed precisam — é o que trafega no "Carregar mais". */
export type PublicacaoCard = Pick<
  Publicacao,
  | "slug"
  | "titulo"
  | "resumo"
  | "tipo"
  | "area"
  | "dataPublicacao"
  | "capaTitulo"
  | "capaVideo"
  | "capaPoster"
>;

export function paraCard(publicacao: Publicacao): PublicacaoCard {
  const { slug, titulo, resumo, tipo, area, dataPublicacao, capaTitulo, capaVideo, capaPoster } =
    publicacao;
  return { slug, titulo, resumo, tipo, area, dataPublicacao, capaTitulo, capaVideo, capaPoster };
}

/** Tempo de leitura a ~200 palavras por minuto; vazio se não houver texto. */
export function calcularTempoLeitura(texto: string | null): number | null {
  const palavras = texto?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return palavras > 0 ? Math.max(1, Math.round(palavras / 200)) : null;
}

export function urlPublicacao(slug: string): string {
  return `${siteConfig.url}/artigos/${slug}`;
}

/** Compartilhamento pelo WhatsApp: título + URL, sem destinatário definido. */
export function whatsappCompartilhar(titulo: string, slug: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${titulo} ${urlPublicacao(slug)}`)}`;
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
