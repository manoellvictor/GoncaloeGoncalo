import { getSupabaseClient } from "./server";
import type { Article, Faq, PracticeArea, TeamMember } from "./database.types";

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

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    logFailure("getPracticeAreas", error);
    return [];
  }
  return data ?? [];
}

/** As 4 áreas de destaque da homepage (prd.md §6.1). */
export async function getFeaturedPracticeAreas(): Promise<PracticeArea[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .eq("published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(4);

  if (error) {
    logFailure("getFeaturedPracticeAreas", error);
    return [];
  }
  return data ?? [];
}

export async function getPracticeAreaBySlug(
  slug: string,
): Promise<PracticeArea | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logFailure(`getPracticeAreaBySlug(${slug})`, error);
    return null;
  }
  return data;
}

/* -------------------------------------------------------------------- Artigos */

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

  if (query) {
    // Escapa os curingas do LIKE para que o termo do usuário seja tratado
    // como texto literal, e as vírgulas, que separariam os filtros do `or`.
    const safe = query.replace(/[%_\\]/g, "\\$&").replace(/,/g, " ");
    request = request.or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%`);
  }
  if (limit) request = request.limit(limit);

  const { data, error } = await request;

  if (error) {
    logFailure("getArticles", error);
    return [];
  }
  return data ?? [];
}

/**
 * Página de artigos para a listagem do hub (prd.md §6.8).
 * Pagina no banco com `range`, não em memória, para o custo não crescer junto
 * com o acervo. Devolve o total para montar a navegação.
 */
export async function getArticlesPage({
  page = 1,
  pageSize = 9,
  query,
}: { page?: number; pageSize?: number; query?: string } = {}): Promise<{
  articles: Article[];
  total: number;
  totalPages: number;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) return { articles: [], total: 0, totalPages: 0 };

  const from = (page - 1) * pageSize;

  let request = supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (query) {
    const safe = query.replace(/[%_\\]/g, "\\$&").replace(/,/g, " ");
    request = request.or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%`);
  }

  const { data, error, count } = await request;

  if (error) {
    logFailure("getArticlesPage", error);
    return { articles: [], total: 0, totalPages: 0 };
  }

  const total = count ?? 0;
  return {
    articles: data ?? [],
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logFailure(`getArticleBySlug(${slug})`, error);
    return null;
  }
  return data;
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
