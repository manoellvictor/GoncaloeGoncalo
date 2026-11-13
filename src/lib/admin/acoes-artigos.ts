"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { exigirEscritorio } from "@/lib/supabase/sessao";
import { sanitizarHtmlArtigo } from "@/lib/sanitizar-html";
import type { Artigo } from "@/lib/supabase/database.types";
import {
  AREAS,
  TIPOS,
  formatarDataHora,
  gerarSlug,
  temErros,
  validarParaPublicar,
  validarParaSalvar,
  type DadosArtigo,
  type ErrosArtigo,
} from "./artigo-dados";

/**
 * Ações do painel sobre os artigos. Cada uma confere no servidor se quem
 * chama é a conta do escritório (exigirEscritorio) e grava com a sessão dela —
 * as regras do banco valem também aqui. Depois de mexer em artigo publicado,
 * revalida as páginas do site na hora.
 */

export type Resultado =
  | {
      ok: true;
      mensagem?: string;
      salvoEm: string;
      status: Artigo["status"];
      publicadoEm: string | null;
      slug: string;
    }
  | { ok: false; erro: string; campos?: ErrosArtigo };

const FALHA_CONEXAO = "Não foi possível salvar. Verifique sua conexão e tente de novo.";

/** Limpa e normaliza o que veio do navegador. */
function normalizar(dados: DadosArtigo): DadosArtigo {
  const texto = (valor: unknown) => (typeof valor === "string" ? valor.trim() : "");
  const titulo = texto(dados.titulo);
  return {
    titulo,
    slug: gerarSlug(texto(dados.slug)) || gerarSlug(titulo),
    resumo: texto(dados.resumo),
    conteudo: sanitizarHtmlArtigo(typeof dados.conteudo === "string" ? dados.conteudo : ""),
    capa_url: texto(dados.capa_url) || null,
    capa_alt: texto(dados.capa_alt),
    area: AREAS.includes(dados.area as never) ? dados.area : null,
    tipo: TIPOS.includes(dados.tipo) ? dados.tipo : "Artigo",
    autor_nome: texto(dados.autor_nome),
    video_instagram_url: texto(dados.video_instagram_url),
    seo_titulo: texto(dados.seo_titulo),
    seo_descricao: texto(dados.seo_descricao),
    destaque: dados.destaque === true,
  };
}

function paraBanco(dados: DadosArtigo) {
  return {
    titulo: dados.titulo,
    slug: dados.slug,
    resumo: dados.resumo,
    conteudo: dados.conteudo,
    capa_url: dados.capa_url,
    capa_alt: dados.capa_alt || null,
    area: dados.area,
    tipo: dados.tipo,
    autor_nome: dados.autor_nome || null,
    video_instagram_url: dados.video_instagram_url || null,
    seo_titulo: dados.seo_titulo || null,
    seo_descricao: dados.seo_descricao || null,
    destaque: dados.destaque,
  };
}

/** Páginas do site que mostram artigos. */
function revalidarSite(...slugs: (string | null | undefined)[]) {
  revalidatePath("/");
  revalidatePath("/artigos");
  revalidatePath("/api/publicacoes");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs)) {
    if (slug) revalidatePath(`/artigos/${slug}`);
  }
}

type Supabase = Awaited<ReturnType<typeof exigirEscritorio>>["supabase"];

async function enderecoEmUso(supabase: Supabase, slug: string, id: string) {
  const { data } = await supabase
    .from("artigos")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  return Boolean(data);
}

/**
 * Tira o destaque de outro artigo, se houver, e devolve o título dele para o
 * aviso ("O destaque saiu de …").
 */
async function liberarDestaque(supabase: Supabase, id: string): Promise<string | null> {
  const { data } = await supabase
    .from("artigos")
    .select("id, titulo, slug, status")
    .eq("destaque", true)
    .neq("id", id)
    .maybeSingle();
  if (!data) return null;
  await supabase.from("artigos").update({ destaque: false }).eq("id", data.id);
  if (data.status === "publicado") revalidarSite(data.slug);
  return data.titulo || "artigo sem título";
}

/**
 * Grava os campos. `publicar` (opcional) muda a situação junto, numa única
 * atualização — o banco confere que o artigo publicado está completo.
 */
async function gravar(
  id: string,
  bruto: DadosArtigo,
  publicar?: { status: Artigo["status"]; publicadoEm: string | null },
  mensagemOk?: string,
): Promise<Resultado> {
  const { supabase } = await exigirEscritorio();

  const { data: atual, error: erroLeitura } = await supabase
    .from("artigos")
    .select("status, slug, publicado_em")
    .eq("id", id)
    .maybeSingle();
  if (erroLeitura) return { ok: false, erro: FALHA_CONEXAO };
  if (!atual) return { ok: false, erro: "Este artigo não existe mais. Ele pode ter sido excluído." };

  const dados = normalizar(bruto);
  const status = publicar?.status ?? atual.status;

  // Artigo no ar (ou indo para o ar) precisa estar completo a cada gravação.
  const erros = status === "publicado" ? validarParaPublicar(dados) : validarParaSalvar(dados);
  if (await enderecoEmUso(supabase, dados.slug, id)) {
    erros.slug = "Este endereço já é usado por outro artigo. Escolha outro.";
  }
  if (temErros(erros)) {
    return {
      ok: false,
      erro:
        status === "publicado"
          ? "Antes de publicar, complete os campos indicados."
          : "Corrija os campos indicados para salvar.",
      campos: erros,
    };
  }

  const avisoDestaque = dados.destaque ? await liberarDestaque(supabase, id) : null;

  const { data: salvo, error } = await supabase
    .from("artigos")
    .update({
      ...paraBanco(dados),
      ...(publicar ? { status: publicar.status, publicado_em: publicar.publicadoEm } : {}),
    })
    .eq("id", id)
    .select("status, slug, publicado_em, atualizado_em")
    .single();

  if (error || !salvo) {
    if (error?.code === "23505") {
      return { ok: false, erro: "Este endereço já é usado por outro artigo.", campos: { slug: "Escolha outro endereço." } };
    }
    if (error?.code === "23514") {
      return { ok: false, erro: "Antes de publicar, complete todos os campos obrigatórios." };
    }
    return { ok: false, erro: FALHA_CONEXAO };
  }

  if (atual.status === "publicado" || salvo.status === "publicado") {
    revalidarSite(atual.slug, salvo.slug);
  }
  revalidatePath("/admin");

  const mensagens = [mensagemOk, avisoDestaque ? `O destaque saiu de “${avisoDestaque}”.` : null];
  return {
    ok: true,
    mensagem: mensagens.filter(Boolean).join(" ") || undefined,
    salvoEm: salvo.atualizado_em,
    status: salvo.status,
    publicadoEm: salvo.publicado_em,
    slug: salvo.slug,
  };
}

/** Salvar (rascunho, ou alterações de um artigo já publicado). */
export async function salvarArtigo(id: string, dados: DadosArtigo): Promise<Resultado> {
  try {
    return await gravar(id, dados);
  } catch (erro) {
    unstable_rethrow(erro);
    return { ok: false, erro: FALHA_CONEXAO };
  }
}

/**
 * Publicar agora ou agendar. `agendarPara` (ISO) no futuro = agendado.
 * Republicar um artigo que já esteve no ar mantém a data original.
 */
export async function publicarArtigo(
  id: string,
  dados: DadosArtigo,
  agendarPara?: string | null,
): Promise<Resultado> {
  try {
    let publicadoEm: string;
    let mensagem: string;

    if (agendarPara) {
      const quando = new Date(agendarPara);
      if (Number.isNaN(quando.getTime()) || quando.getTime() <= Date.now() + 60_000) {
        return { ok: false, erro: "Escolha uma data e hora no futuro para agendar." };
      }
      publicadoEm = quando.toISOString();
      mensagem = `Publicação agendada para ${formatarDataHora(publicadoEm)}.`;
    } else {
      const { supabase } = await exigirEscritorio();
      const { data } = await supabase
        .from("artigos")
        .select("publicado_em")
        .eq("id", id)
        .maybeSingle();
      const anterior = data?.publicado_em ? new Date(data.publicado_em) : null;
      publicadoEm =
        anterior && anterior.getTime() <= Date.now() ? anterior.toISOString() : new Date().toISOString();
      mensagem = "Artigo publicado!";
    }

    return await gravar(id, dados, { status: "publicado", publicadoEm }, mensagem);
  } catch (erro) {
    unstable_rethrow(erro);
    return { ok: false, erro: FALHA_CONEXAO };
  }
}

/** Tira o artigo do ar (volta a rascunho). */
export async function despublicarArtigo(id: string): Promise<Resultado> {
  try {
    const { supabase } = await exigirEscritorio();
    const { data, error } = await supabase
      .from("artigos")
      .update({ status: "rascunho" })
      .eq("id", id)
      .select("status, slug, publicado_em, atualizado_em")
      .single();
    if (error || !data) return { ok: false, erro: "Não foi possível despublicar. Verifique sua conexão." };

    revalidarSite(data.slug);
    revalidatePath("/admin");
    return {
      ok: true,
      mensagem: "Artigo despublicado. Ele voltou a ser rascunho e saiu do site.",
      salvoEm: data.atualizado_em,
      status: data.status,
      publicadoEm: data.publicado_em,
      slug: data.slug,
    };
  } catch (erro) {
    unstable_rethrow(erro);
    return { ok: false, erro: "Não foi possível despublicar. Verifique sua conexão." };
  }
}

/** Publicar direto da lista, com os dados já salvos. */
export async function publicarPelaLista(id: string): Promise<Resultado> {
  const { supabase } = await exigirEscritorio();
  const { data } = await supabase.from("artigos").select("*").eq("id", id).maybeSingle();
  if (!data) return { ok: false, erro: "Este artigo não existe mais." };

  const resultado = await publicarArtigo(id, {
    titulo: data.titulo,
    slug: data.slug,
    resumo: data.resumo,
    conteudo: data.conteudo,
    capa_url: data.capa_url,
    capa_alt: data.capa_alt ?? "",
    area: data.area,
    tipo: data.tipo,
    autor_nome: data.autor_nome ?? "",
    video_instagram_url: data.video_instagram_url ?? "",
    seo_titulo: data.seo_titulo ?? "",
    seo_descricao: data.seo_descricao ?? "",
    destaque: data.destaque,
  });
  if (!resultado.ok && resultado.campos) {
    return {
      ok: false,
      erro: "Ainda falta preencher campos obrigatórios. Abra o artigo em “Editar” para completar e publicar.",
    };
  }
  return resultado;
}

/** Exclui o artigo e as imagens dele no Storage. */
export async function excluirArtigo(id: string): Promise<{ ok: boolean; erro?: string }> {
  try {
    const { supabase } = await exigirEscritorio();
    const { data, error } = await supabase
      .from("artigos")
      .delete()
      .eq("id", id)
      .select("slug, status")
      .maybeSingle();
    if (error) return { ok: false, erro: "Não foi possível excluir. Verifique sua conexão." };

    // Imagens do artigo ficam em artigos/<id>/; sem elas o bucket não acumula lixo.
    const { data: arquivos } = await supabase.storage.from("artigos").list(id);
    if (arquivos?.length) {
      await supabase.storage.from("artigos").remove(arquivos.map((a) => `${id}/${a.name}`));
    }

    if (data?.status === "publicado") revalidarSite(data.slug);
    revalidatePath("/admin");
    return { ok: true };
  } catch (erro) {
    unstable_rethrow(erro);
    return { ok: false, erro: "Não foi possível excluir. Verifique sua conexão." };
  }
}

/** "Novo artigo": cria um rascunho vazio e abre o editor. */
export async function criarArtigo() {
  const { supabase } = await exigirEscritorio();
  const { data, error } = await supabase
    .from("artigos")
    .insert({ slug: `rascunho-${crypto.randomUUID().slice(0, 8)}` })
    .select("id")
    .single();
  if (error || !data) redirect("/admin?aviso=erro-novo");
  redirect(`/admin/artigos/${data.id}`);
}

