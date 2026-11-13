"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Cliente Supabase do navegador, só para o painel /admin: envia as imagens
 * direto para o Storage (bucket `artigos`) com a sessão logada, sem passar o
 * arquivo pelo servidor. A regra do bucket aceita só a conta do escritório.
 */
let cliente: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function clienteNavegador() {
  cliente ??= createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return cliente;
}
