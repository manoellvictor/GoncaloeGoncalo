import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente Supabase para Server Components e Server Actions.
 *
 * Usa a chave publicável (anon), então TODA proteção vem do RLS — nunca a
 * service role, que ignoraria as políticas. Ver a migração `enable_rls_policies`.
 *
 * Retorna `null` quando as variáveis de ambiente não estão configuradas, para
 * que o build não quebre em ambiente sem credenciais; as funções de consulta
 * degradam para conteúdo vazio ou fallback estático.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY " +
          "ausentes — o site vai renderizar sem conteúdo dinâmico. Ver .env.example.",
      );
    }
    return null;
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: { fetch: fetchWithRevalidate },
  });
}

/** Intervalo, em segundos, para conteúdo editado no Supabase aparecer no site. */
const CONTENT_REVALIDATE_SECONDS = 300;

/**
 * Leituras (GET) revalidam a cada 5 minutos. Sem isso, o Next guarda a resposta
 * do build por tempo indeterminado e reaproveita esse cache nos builds
 * seguintes — edições no banco nunca chegariam ao site. Escritas (ex.: o
 * formulário de contato) passam direto, sem cache.
 */
const fetchWithRevalidate: typeof fetch = (input, init) => {
  const method = (init?.method ?? "GET").toUpperCase();
  if (method !== "GET") return fetch(input, init);
  return fetch(input, { ...init, next: { revalidate: CONTENT_REVALIDATE_SECONDS } });
};
