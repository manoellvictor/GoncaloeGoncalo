import { notFound } from "next/navigation";
import { EditorArtigo } from "@/components/admin/EditorArtigo";
import { exigirEscritorio } from "@/lib/supabase/sessao";
import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "Editar artigo" };

/** Tela 2 — editor de um artigo (rascunho, agendado ou publicado). */
export default async function EditarArtigoPage({ params }: PageProps<"/admin/artigos/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { supabase } = await exigirEscritorio();

  const [{ data: artigo }, { data: usados }, { data: equipe }, { data: destaque }] =
    await Promise.all([
      supabase.from("artigos").select("*").eq("id", id).maybeSingle(),
      supabase.from("artigos").select("autor_nome").not("autor_nome", "is", null),
      supabase
        .from("team_members")
        .select("name, full_name, oab, department")
        .eq("published", true)
        .eq("department", "juridico"),
      supabase.from("artigos").select("titulo").eq("destaque", true).neq("id", id).maybeSingle(),
    ]);

  if (!artigo) notFound();

  // Sugestões de autor: nomes já usados + advogados do Nosso Time.
  const autores = new Set<string>();
  for (const { autor_nome } of usados ?? []) if (autor_nome?.trim()) autores.add(autor_nome.trim());
  for (const membro of equipe ?? []) {
    const nome = membro.full_name ?? membro.name;
    autores.add(membro.oab ? `${nome} – ${membro.oab}` : nome);
  }

  return (
    <EditorArtigo
      key={artigo.id}
      id={artigo.id}
      inicial={{
        titulo: artigo.titulo,
        slug: artigo.slug,
        resumo: artigo.resumo,
        conteudo: artigo.conteudo,
        capa_url: artigo.capa_url,
        capa_alt: artigo.capa_alt ?? "",
        area: artigo.area,
        tipo: artigo.tipo,
        autor_nome: artigo.autor_nome ?? "",
        video_instagram_url: artigo.video_instagram_url ?? "",
        seo_titulo: artigo.seo_titulo ?? "",
        seo_descricao: artigo.seo_descricao ?? "",
        destaque: artigo.destaque,
      }}
      statusInicial={artigo.status}
      publicadoEmInicial={artigo.publicado_em}
      atualizadoEm={artigo.atualizado_em}
      autores={[...autores].sort((a, b) => a.localeCompare(b, "pt-BR"))}
      destaqueAtual={destaque?.titulo || (destaque ? "artigo sem título" : null)}
      siteHost={new URL(siteConfig.url).host}
    />
  );
}
