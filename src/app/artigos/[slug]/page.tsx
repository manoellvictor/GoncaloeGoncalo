import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ArtigoCompleto } from "@/components/publicacoes/ArtigoCompleto";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  clampDescription,
  pageMetadata,
} from "@/lib/seo";
import { hrefListagem } from "@/lib/publicacoes";
import {
  getPublicacaoBySlug,
  getPublicacoesRecentes,
  getPublicacoesRelacionadas,
} from "@/lib/supabase/queries";

/**
 * Página de cada publicação. Só existe para artigos publicados com data já
 * vencida (regra de acesso do banco); rascunho, agendado ou endereço
 * inexistente dá 404. O painel revalida esta rota ao publicar, editar,
 * despublicar ou excluir.
 */

export async function generateStaticParams() {
  const publicacoes = await getPublicacoesRecentes();
  return publicacoes.map((publicacao) => ({ slug: publicacao.slug }));
}

export async function generateMetadata({ params }: PageProps<"/artigos/[slug]">) {
  const { slug } = await params;
  const publicacao = await getPublicacaoBySlug(slug);

  if (!publicacao) {
    return pageMetadata({
      title: "Conteúdo não encontrado",
      description:
        "O conteúdo que você procura não está disponível. Veja as demais publicações da equipe do escritório Gonçalo & Gonçalo Advogados Associados.",
      path: `/artigos/${slug}`,
    });
  }

  return pageMetadata({
    title: publicacao.seoTitulo || publicacao.titulo,
    description: publicacao.seoDescricao || clampDescription(publicacao.resumo),
    path: `/artigos/${publicacao.slug}`,
    image: publicacao.capa?.url,
    article: {
      publishedTime: publicacao.dataPublicacao,
      modifiedTime: publicacao.dataAtualizacao,
      ...(publicacao.autor ? { authors: [publicacao.autor] } : {}),
    },
  });
}

export default async function PublicacaoPage({ params }: PageProps<"/artigos/[slug]">) {
  const { slug } = await params;
  const publicacao = await getPublicacaoBySlug(slug);

  if (!publicacao) notFound();

  const relacionadas = await getPublicacoesRelacionadas(publicacao);
  const { titulo, area } = publicacao;

  const trilha = [
    { name: "Início", path: "/" },
    { name: "Conteúdo Jurídico", path: "/artigos" },
    ...(area ? [{ name: area.nome, path: hrefListagem({ area: area.chave }) }] : []),
    { name: titulo, path: `/artigos/${publicacao.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: titulo,
          excerpt: publicacao.seoDescricao || publicacao.resumo,
          slug: publicacao.slug,
          publishedAt: publicacao.dataPublicacao,
          modifiedAt: publicacao.dataAtualizacao,
          image: publicacao.capa?.url,
          author: publicacao.autor,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(trilha)} />

      <ArtigoCompleto publicacao={publicacao} relacionadas={relacionadas} />
    </>
  );
}
