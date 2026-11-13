"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { criarClienteSessao, eContaDoEscritorio, exigirEscritorio } from "@/lib/supabase/sessao";

/**
 * Entrar, sair e trocar a senha da conta única do escritório. Mensagens em
 * português simples; nenhuma revela se um e-mail existe ou não.
 */

export type EstadoFormulario = { erro?: string; ok?: string };

/** Só volta para páginas do próprio painel (evita redirecionar para fora). */
function destinoSeguro(valor: FormDataEntryValue | null): string {
  const destino = typeof valor === "string" ? valor : "";
  return destino.startsWith("/admin") && !destino.startsWith("//") ? destino : "/admin";
}

export async function entrar(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  const email = String(formulario.get("email") ?? "").trim();
  const senha = String(formulario.get("senha") ?? "");
  if (!email || !senha) return { erro: "Informe o e-mail e a senha." };

  const supabase = await criarClienteSessao();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    return {
      erro:
        error.code === "invalid_credentials"
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar. Verifique sua conexão e tente de novo.",
    };
  }
  if (!eContaDoEscritorio(data.user)) {
    await supabase.auth.signOut();
    return { erro: "Esta conta não tem acesso ao painel." };
  }

  redirect(destinoSeguro(formulario.get("proximo")));
}

export async function sair() {
  const supabase = await criarClienteSessao();
  await supabase.auth.signOut();
  redirect("/admin/login?aviso=saiu");
}

export async function enviarLinkDeSenha(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  const email = String(formulario.get("email") ?? "").trim();
  if (!email) return { erro: "Informe o e-mail da conta do escritório." };

  // O link volta para o mesmo endereço em que o painel está aberto (produção
  // ou preview), desde que esteja na lista de URLs permitidas do Supabase.
  const origem = (await headers()).get("origin") ?? siteConfig.url;
  const supabase = await criarClienteSessao();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origem}/admin/auth/callback?proximo=/admin/redefinir-senha`,
  });

  if (error && error.status !== 400 && error.status !== 404) {
    return { erro: "Não foi possível enviar agora. Tente de novo em alguns minutos." };
  }
  return {
    ok: "Se este for o e-mail da conta do escritório, você vai receber um link para criar uma nova senha. Confira também a caixa de spam.",
  };
}

export async function redefinirSenha(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  const senha = String(formulario.get("senha") ?? "");
  const confirmacao = String(formulario.get("confirmacao") ?? "");

  if (senha.length < 8) return { erro: "A senha precisa ter pelo menos 8 caracteres." };
  if (senha !== confirmacao) return { erro: "As duas senhas não são iguais." };

  const { supabase } = await exigirEscritorio();
  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    return {
      erro:
        error.code === "same_password"
          ? "Escolha uma senha diferente da anterior."
          : "Não foi possível trocar a senha. Peça um novo link e tente de novo.",
    };
  }
  redirect("/admin?aviso=senha");
}
