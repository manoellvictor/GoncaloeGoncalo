import { getSupabaseClient } from "./server";
import type { Article, Faq, Json, PracticeArea, TeamMember } from "./database.types";
import { practiceAreas } from "@/lib/site-config";
import { slugify } from "@/lib/format";
import {
  areaPorSlug,
  calcularTempoLeitura,
  tipoPublicacao,
  type Fonte,
  type Publicacao,
} from "@/lib/publicacoes";

/**
 * Consultas de leitura do conteúdo público.
 *
 * Todas degradam para vazio em caso de falha: uma indisponibilidade do banco
 * derruba uma seção, nunca a página inteira. As ordenações refletem regras de
 * negócio dos padrões de projeto, não preferência de implementação.
 */

function logFailure(scope: string, error: { message: string }) {
  console.error(`[supabase] falha em ${scope}: ${error.message}`);
}

/* ------------------------------------------------------------ Áreas de atuação */

/**
 * As áreas exibidas são as de `practiceAreas` (site-config.ts), nessa ordem.
 * A linha do banco com o mesmo slug, se houver, fornece o conteúdo (texto,
 * serviços, imagem, meta description); sem ela, a área usa os dados estáticos.
 * O título vem sempre da lista oficial, para menu e página dizerem o mesmo.
 */
type OfficialArea = (typeof practiceAreas)[number];

function mergeArea(
  official: OfficialArea,
  index: number,
  row: PracticeArea | undefined,
): PracticeArea {
  if (row) return { ...row, title: official.title, sort_order: index };
  return {
    id: official.slug,
    slug: official.slug,
    title: official.title,
    short_description: official.shortDescription,
    icon: official.icon,
    body: null,
    services: [],
    image_url: null,
    meta_description: null,
    is_featured: false,
    published: true,
    sort_order: index,
    created_at: "",
    updated_at: "",
  };
}

async function getPublishedAreaRows(): Promise<PracticeArea[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .eq("published", true);

  if (error) {
    logFailure("getPracticeAreas", error);
    return [];
  }
  return data ?? [];
}

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  const rows = await getPublishedAreaRows();
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  return practiceAreas.map((official, index) =>
    mergeArea(official, index, bySlug.get(official.slug)),
  );
}

export async function getPracticeAreaBySlug(
  slug: string,
): Promise<PracticeArea | null> {
  const index = practiceAreas.findIndex((area) => area.slug === slug);
  if (index < 0) return null;

  const supabase = getSupabaseClient();
  let row: PracticeArea | undefined;

  if (supabase) {
    const { data, error } = await supabase
      .from("practice_areas")
      .select("*")
      .eq("published", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) logFailure(`getPracticeAreaBySlug(${slug})`, error);
    row = data ?? undefined;
  }

  return mergeArea(practiceAreas[index], index, row);
}

/* -------------------------------------------------------------------- Artigos */

/**
 * Filtro de busca por título e resumo. Escapa os curingas do LIKE para que o
 * termo do usuário seja tratado como texto literal, e as vírgulas, que
 * separariam os filtros do `or`.
 */
function searchFilter(query: string): string {
  const safe = query.replace(/[%_\\]/g, "\\$&").replace(/,/g, " ");
  return `title.ilike.%${safe}%,excerpt.ilike.%${safe}%`;
}

/** Ordenação: mais recente primeiro (padroes-de-projeto.md §3.4). */
export async function getArticles({
  limit,
  query,
}: { limit?: number; query?: string } = {}): Promise<Article[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  let request = supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (query) request = request.or(searchFilter(query));
  if (limit) request = request.limit(limit);

  const { data, error } = await request;

  if (error) {
    logFailure("getArticles", error);
    return [];
  }
  return data ?? [];
}

/* ---------------------------------------------------------------- Publicações */

/** Cards por página do feed de /artigos (o destaque fica fora da conta). */
export const PUBLICACOES_POR_PAGINA = 6;

function parseFontes(value: Json): Fonte[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const { titulo, url } = item;
    return typeof titulo === "string" && typeof url === "string"
      ? [{ titulo, url }]
      : [];
  });
}

function toPublicacao(row: Article, autores: Map<string, TeamMember>): Publicacao {
  const autor = row.author_id ? autores.get(row.author_id) : undefined;
  return {
    slug: row.slug,
    titulo: row.title,
    resumo: row.excerpt,
    conteudo: row.content,
    tipo: tipoPublicacao(row.category),
    area: areaPorSlug(row.area),
    dataPublicacao: row.published_at,
    dataAtualizacao: row.revised_at,
    autor: autor
      ? {
          nome: autor.full_name ?? autor.name,
          oab: autor.oab,
          slugPerfil: slugify(autor.name),
        }
      : null,
    tempoLeitura: row.reading_minutes ?? calcularTempoLeitura(row.content),
    capaTitulo: row.cover_title ?? row.title,
    capaVideo: row.cover_video_mp4
      ? {
          mp4: row.cover_video_mp4,
          webm: row.cover_video_webm,
          poster: row.cover_poster,
        }
      : null,
    capaPoster: row.cover_poster,
    fontes: parseFontes(row.sources),
    emResumo: row.key_points,
    destaque: row.featured,
    metaDescription: row.meta_description,
  };
}

/** Autores vêm de team_members; só consulta a equipe se alguém tiver autor. */
async function toPublicacoes(rows: Article[]): Promise<Publicacao[]> {
  const autores = rows.some((row) => row.author_id)
    ? new Map((await getTeamMembers()).map((member) => [member.id, member]))
    : new Map<string, TeamMember>();
  return rows.map((row) => toPublicacao(row, autores));
}

/**
 * Publicação em destaque: a mais recente marcada como `featured`; sem
 * nenhuma marcada, a mais recente de todas.
 */
async function getPublicacaoDestaque(): Promise<Publicacao | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(1);

  if (error) {
    logFailure("getPublicacaoDestaque", error);
    return null;
  }
  const [destaque] = await toPublicacoes(data ?? []);
  return destaque ?? null;
}

/**
 * Feed de /artigos: destaque (só em "Todas", sem busca) + uma página de cards.
 * O destaque sai do feed em todas as páginas, para a numeração (?pagina=N)
 * não repetir nem pular publicações. Pagina no banco com `range`.
 */
export async function getFeedPublicacoes({
  area,
  query,
  pagina = 1,
}: {
  /** Slug da área (practice_areas.slug). */
  area?: string;
  query?: string;
  pagina?: number;
} = {}): Promise<{
  destaque: Publicacao | null;
  itens: Publicacao[];
  total: number;
  totalPaginas: number;
}> {
  const vazio = { destaque: null, itens: [], total: 0, totalPaginas: 1 };
  const supabase = getSupabaseClient();
  if (!supabase) return vazio;

  const destaque = !area && !query ? await getPublicacaoDestaque() : null;
  const from = (pagina - 1) * PUBLICACOES_POR_PAGINA;

  let request = supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(from, from + PUBLICACOES_POR_PAGINA - 1);

  if (area) request = request.eq("area", area);
  if (query) request = request.or(searchFilter(query));
  if (destaque) request = request.neq("slug", destaque.slug);

  const { data, error, count } = await request;

  if (error) {
    // Página além do fim (?pagina=99) responde 416; trata como lista vazia.
    if (error.code !== "PGRST103") logFailure("getFeedPublicacoes", error);
    return { ...vazio, destaque };
  }

  const total = count ?? 0;
  return {
    destaque,
    itens: await toPublicacoes(data ?? []),
    total,
    totalPaginas: Math.max(1, Math.ceil(total / PUBLICACOES_POR_PAGINA)),
  };
}

/** Quantas publicações cada área tem (slug → total), para os filtros. */
export async function getContagemPorArea(): Promise<Map<string, number>> {
  const contagem = new Map<string, number>();
  const supabase = getSupabaseClient();
  if (!supabase) return contagem;

  const { data, error } = await supabase
    .from("articles")
    .select("area")
    .eq("published", true);

  if (error) {
    logFailure("getContagemPorArea", error);
    return contagem;
  }
  for (const { area } of data ?? []) {
    if (area) contagem.set(area, (contagem.get(area) ?? 0) + 1);
  }
  return contagem;
}

export async function getPublicacaoBySlug(slug: string): Promise<Publicacao | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logFailure(`getPublicacaoBySlug(${slug})`, error);
    return null;
  }
  if (!data) return null;
  const [publicacao] = await toPublicacoes([data]);
  return publicacao;
}

/** "Leia também": da mesma área; completa com as mais recentes. */
export async function getPublicacoesRelacionadas(
  publicacao: Publicacao,
  limite = 2,
): Promise<Publicacao[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const base = () =>
    supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .neq("slug", publicacao.slug)
      .order("published_at", { ascending: false })
      .limit(limite + 1);

  const [mesmaArea, recentes] = await Promise.all([
    publicacao.area ? base().eq("area", publicacao.area.slug) : null,
    base(),
  ]);

  if (mesmaArea?.error) logFailure("getPublicacoesRelacionadas", mesmaArea.error);
  if (recentes.error) logFailure("getPublicacoesRelacionadas", recentes.error);

  const vistos = new Set<string>();
  const rows = [...(mesmaArea?.data ?? []), ...(recentes.data ?? [])]
    .filter((row) => !vistos.has(row.slug) && vistos.add(row.slug))
    .slice(0, limite);
  return toPublicacoes(rows);
}

/* --------------------------------------------------------------------- Equipe */

/** Sócios antes de associados, depois alfabética (padroes-de-projeto.md §3.5). */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("is_partner", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    logFailure("getTeamMembers", error);
    return [];
  }
  return data ?? [];
}

/* ----------------------------------------------------------------------- FAQs */

export async function getFaqs({
  featuredOnly = false,
}: { featuredOnly?: boolean } = {}): Promise<Faq[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  let request = supabase
    .from("faqs")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (featuredOnly) request = request.eq("is_featured", true).limit(4);

  const { data, error } = await request;

  if (error) {
    logFailure("getFaqs", error);
    return [];
  }
  return data ?? [];
}

/** Agrupa por categoria preservando a ordem de `sort_order`. */
export function groupFaqsByCategory(faqs: Faq[]) {
  const groups = new Map<string, Faq[]>();
  for (const faq of faqs) {
    const key = faq.category ?? "Geral";
    const existing = groups.get(key);
    if (existing) existing.push(faq);
    else groups.set(key, [faq]);
  }
  return [...groups.entries()].map(([category, items]) => ({ category, items }));
}
