import { notFound } from "next/navigation";
import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  clampDescription,
  pageMetadata,
} from "@/lib/seo";
import { categoryLabel, formatDate, isoDate } from "@/lib/format";
import { getArticleBySlug, getArticles } from "@/lib/supabase/queries";

/**
 * Página de artigo individual — implícita no hub de conteúdo (prd.md §6.8).
 * Fecha com CTA de contato, conforme o fluxo 4 de prd.md §8.
 */

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/artigos/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return pageMetadata({
      title: "Artigo não encontrado",
      description:
        "O artigo que você procura não está disponível. Veja as demais publicações da equipe do escritório Gonçalo & Gonçalo Advogados Associados.",
      path: `/artigos/${slug}`,
    });
  }

  return pageMetadata({
    title: article.title,
    // O excerpt é escrito para a chamada do card, não para o buscador — daí a
    // coluna própria. Sem ela, o excerpt serve de fallback.
    description: article.meta_description ?? clampDescription(article.excerpt),
    path: `/artigos/${article.slug}`,
    image: article.cover_image_url ?? undefined,
  });
}

export default async function ArticlePage({ params }: PageProps<"/artigos/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const recent = await getArticles({ limit: 4 });
  const related = recent.filter((item) => item.slug !== article.slug).slice(0, 3);

  const breadcrumbs = [
    { name: "Início", path: "/" },
    { name: "Artigos", path: "/artigos" },
    { name: article.title, path: `/artigos/${article.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          publishedAt: article.published_at,
          image: article.cover_image_url,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />

      <PageTitleBlock
        eyebrow={categoryLabel(article.category)}
        title={article.title}
        breadcrumbs={breadcrumbs}
      />

      <article className="section-y bg-cream-100">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <p className="text-small text-neutral-600">
              Publicado em{" "}
              <time dateTime={isoDate(article.published_at)}>
                {formatDate(article.published_at)}
              </time>
            </p>

            <ImageFrame
              src={article.cover_image_url}
              alt=""
              ratio="wide"
              className="mt-8 rounded-lg"
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
            />

            <p className="mt-12 text-body-lg font-medium text-primary-900">
              {article.excerpt}
            </p>

            {article.content ? (
              <div className="mt-8 flex flex-col gap-6 text-body-lg text-neutral-700">
                {article.content
                  .split("\n\n")
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            ) : null}
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="section-y bg-white">
          <div className="container-site">
            <Eyebrow>Leia Também</Eyebrow>
            <h2 className="mt-4 text-h3">Outras publicações</h2>
            <div aria-hidden="true" className="mt-5 h-px w-16 bg-gold-500" />

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner
        title="Este tema afeta o seu negócio?"
        description="Converse com a nossa equipe sobre como as mudanças discutidas neste artigo se aplicam ao seu caso."
      />
    </>
  );
}
