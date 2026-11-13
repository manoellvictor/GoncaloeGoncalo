import { NextResponse } from "next/server";
import { criarClienteSessao } from "@/lib/supabase/sessao";

/**
 * Volta do link enviado por e-mail ("esqueci minha senha"): troca o código
 * pela sessão e segue para a tela de nova senha.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const codigo = url.searchParams.get("code");
  const proximo = url.searchParams.get("proximo") ?? "/admin";
  const destino = proximo.startsWith("/admin") && !proximo.startsWith("//") ? proximo : "/admin";

  if (codigo) {
    const supabase = await criarClienteSessao();
    const { error } = await supabase.auth.exchangeCodeForSession(codigo);
    if (!error) return NextResponse.redirect(new URL(destino, url.origin));
  }

  return NextResponse.redirect(new URL("/admin/login?erro=link", url.origin));
}
