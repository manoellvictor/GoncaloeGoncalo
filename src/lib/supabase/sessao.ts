import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente Supabase com a sessão do painel /admin (cookies), para o servidor:
 * páginas, server actions e route handlers do painel.
 *
 * Diferente de `server.ts` (leitura pública com cache), este nunca usa o cache
 * de dados: cada consulta vê o estado atual do banco, com as permissões da
 * conta logada. Só usa a chave pública — a service role não existe no projeto.
 */
export async function criarClienteSessao() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase não configurado (NEXT_PUBLIC_SUPABASE_*).");

  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Em Server Components os cookies são só leitura; o proxy.ts já
          // renova a sessão a cada requisição do /admin.
        }
      },
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

/** A conta é a do escritório? (marca app_metadata.escritorio, ver migração). */
export function eContaDoEscritorio(user: User | null): user is User {
  return user?.app_metadata?.escritorio === true;
}

/**
 * Exige a conta do escritório logada. Sem sessão (ou outra conta), manda para
 * o login. Toda página e server action do painel começa por aqui — o proxy
 * só faz a primeira triagem.
 */
export async function exigirEscritorio() {
  const supabase = await criarClienteSessao();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!eContaDoEscritorio(user)) {
    redirect(user ? "/admin/login?erro=sem-acesso" : "/admin/login");
  }
  return { supabase, user };
}
