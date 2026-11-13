import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtigoCompleto } from "@/components/publicacoes/ArtigoCompleto";
import {
  ROTULO_SITUACAO,
  formatarDataHora,
  situacaoDoArtigo,
} from "@/lib/admin/artigo-dados";
import { getPublicacoesRelacionadas, toPublicacao } from "@/lib/supabase/queries";
import { exigirEscritorio } from "@/lib/supabase/sessao";

export const metadata = { title: "Pré-visualização" };

/**
 * Pré-visualização protegida: o artigo exatamente como ficará no site (com
 * cabeçalho e rodapé), inclusive rascunho e agendado. Fora do grupo (painel)
 * para não ter a barra do painel.
 */
export default async function PreviaPage({ params }: PageProps<"/admin/artigos/[id]/previa">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { supabase } = await exigirEscritorio();
  const { data: artigo } = await supabase.from("artigos").select("*").eq("id", id).maybeSingle();
  if (!artigo) notFound();

  const publicacao = toPublicacao(artigo);
  const relacionadas = await getPublicacoesRelacionadas(publicacao);
  const situacao = situacaoDoArtigo(artigo.status, artigo.publicado_em);

  const explicacao =
    situacao === "rascunho"
      ? "Este artigo é um rascunho: os visitantes ainda não o veem."
      : situacao === "agendado"
        ? `Os visitantes verão este artigo a partir de ${formatarDataHora(artigo.publicado_em!)}.`
        : "Este artigo já está publicado no site.";

  return (
    <ArtigoCompleto
      publicacao={publicacao}
      relacionadas={relacionadas}
      aviso={
        <div className="sticky top-0 z-[60] bg-gold-500 text-primary-900">
          <div className="container-site flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5">
            <p className="text-small">
              <strong>Pré-visualização — {ROTULO_SITUACAO[situacao]}.</strong> {explicacao}
            </p>
            <Link
              href={`/admin/artigos/${id}`}
              className="inline-flex min-h-11 items-center text-small font-semibold underline underline-offset-2"
            >
              Voltar ao editor
            </Link>
          </div>
        </div>
      }
    />
  );
}
