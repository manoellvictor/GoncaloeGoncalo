import { getSupabaseClient } from "./server";
import type { AreaArtigo, Artigo, Faq, PracticeArea, TeamMember } from "./database.types";
import { practiceAreas } from "@/lib/site-config";
import { areaPorNome, calcularTempoLeitura, type Publicacao } from "@/lib/publicacoes";

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

/* ---------------------------------------------------------------- Publicações */

/**
 * Artigos da tabela `artigos`, escritos no painel /admin. A leitura usa a
 * chave pública: a regra de acesso do banco só entrega artigos publicados com
 * data já vencida — rascunhos e agendados nunca chegam aqui.
 */

/** Cards por página do feed de /artigos (o destaque fica fora da conta). */
export const PUBLICACOES_POR_PAGINA = 9;

/** Colunas dos cards e listas — sem o corpo, que só a página do artigo usa. */
const COLUNAS_CARD =
  "id, slug, titulo, resumo, tipo, area, publicado_em, atualizado_em, capa_url, capa_alt, autor_nome, destaque, video_instagram_url, seo_titulo, seo_descricao, status, criado_em";

/**
 * Filtro de busca por título e resumo. Escapa os curingas do LIKE para que o
 * termo do usuário seja tratado como texto literal, e as vírgulas, que
 * separariam os filtros do `or`.
 */
function searchFilter(query: string): string {
  const safe = query.replace(/[%_\\]/g, "\\$&").replace(/,/g, " ");
  return `titulo.ilike.%${safe}%,resumo.ilike.%${safe}%`;
}

type LinhaArtigo = Omit<Artigo, "conteudo"> & { conteudo?: string };

export function toPublicacao(row: LinhaArtigo): Publicacao {
  const conteudo = row.conteudo ?? "";
  return {
    slug: row.slug,
    titulo: row.titulo,
    resumo: row.resumo,
    conteudo,
    tipo: row.tipo,
    area: areaPorNome(row.area),
    // Rascunho sem data (só na pré-visualização do painel) usa a data de criação.
    dataPublicacao: row.publicado_em ?? row.criado_em,
    dataAtualizacao: row.atualizado_em,
    autor: row.autor_nome?.trim() || null,
    tempoLeitura: conteudo ? calcularTempoLeitura(conteudo) : null,
    capa: row.capa_url ? { url: row.capa_url, alt: row.capa_alt ?? "" } : null,
    videoInstagram: row.video_instagram_url,
    destaque: row.destaque,
    seoTitulo: row.seo_titulo,
    seoDescricao: row.seo_descricao,
  };
}

/**
 * Publicação em destaque: a marcada no painel; sem nenhuma marcada, a mais
 * recente.
 */
async function getPublicacaoDestaque(): Promise<Publicacao | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("artigos")
    .select(COLUNAS_CARD)
    .order("destaque", { ascending: false })
    .order("publicado_em", { ascending: false })
    .limit(1);

  if (error) {
    logFailure("getPublicacaoDestaque", error);
    return null;
  }
  return data?.[0] ? toPublicacao(data[0]) : null;
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
  /** Nome da área como gravado no banco (ex.: "Tributário"). */
  area?: AreaArtigo;
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
    .from("artigos")
    .select(COLUNAS_CARD, { count: "exact" })
    .order("publicado_em", { ascending: false })
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
    itens: (data ?? []).map(toPublicacao),
    total,
    totalPaginas: Math.max(1, Math.ceil(total / PUBLICACOES_POR_PAGINA)),
  };
}

/** Publicações mais recentes (seção da home, sitemap). */
export async function getPublicacoesRecentes(limite?: number): Promise<Publicacao[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  let request = supabase
    .from("artigos")
    .select(COLUNAS_CARD)
    .order("publicado_em", { ascending: false });
  if (limite) request = request.limit(limite);

  const { data, error } = await request;
  if (error) {
    logFailure("getPublicacoesRecentes", error);
    return [];
  }
  return (data ?? []).map(toPublicacao);
}

/** Quantas publicações cada área tem (nome → total), para os filtros. */
export async function getContagemPorArea(): Promise<Map<string, number>> {
  const contagem = new Map<string, number>();
  const supabase = getSupabaseClient();
  if (!supabase) return contagem;

  const { data, error } = await supabase.from("artigos").select("area");

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
    .from("artigos")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logFailure(`getPublicacaoBySlug(${slug})`, error);
    return null;
  }
  return data ? toPublicacao(data) : null;
}

/** "Leia também": até 3 da mesma área, mais recentes primeiro. */
export async function getPublicacoesRelacionadas(
  publicacao: Pick<Publicacao, "slug" | "area">,
  limite = 3,
): Promise<Publicacao[]> {
  const supabase = getSupabaseClient();
  if (!supabase || !publicacao.area) return [];

  const { data, error } = await supabase
    .from("artigos")
    .select(COLUNAS_CARD)
    .eq("area", publicacao.area.nome)
    .neq("slug", publicacao.slug)
    .order("publicado_em", { ascending: false })
    .limit(limite);

  if (error) {
    logFailure("getPublicacoesRelacionadas", error);
    return [];
  }
  return (data ?? []).map(toPublicacao);
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
