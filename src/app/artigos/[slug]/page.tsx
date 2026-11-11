import Link from "next/link";
import { notFound } from "next/navigation";
import { SpecialistCta } from "@/components/ui/SpecialistCta";
import { JsonLd } from "@/components/JsonLd";
import { BotaoCompartilhar } from "@/components/publicacoes/BotaoCompartilhar";
import { CapaPublicacao } from "@/components/publicacoes/CapaPublicacao";
import { CardPublicacao, RotuloPublicacao } from "@/components/publicacoes/CardPublicacao";
import { CorpoPublicacao } from "@/components/publicacoes/CorpoPublicacao";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  clampDescription,
  pageMetadata,
} from "@/lib/seo";
import { formatDate, isoDate } from "@/lib/format";
import { hrefListagem, paraCard, whatsappSobrePublicacao } from "@/lib/publicacoes";
import {
  getArticles,
  getPublicacaoBySlug,
  getPublicacoesRelacionadas,
} from "@/lib/supabase/queries";

/**
 * Página de cada publicação: trilha, "ÁREA · TIPO", título, resumo, barra de
 * informações (autor, datas, leitura, compartilhar), capa, corpo em ~720px,
 * "Em resumo", fontes, chamada da área e "Leia também".
 */

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
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
    title: publicacao.titulo,
    // O resumo é escrito para o card, não para o buscador — daí a coluna
    // própria. Sem ela, o resumo serve de fallback.
    description: publicacao.metaDescription ?? clampDescription(publicacao.resumo),
    path: `/artigos/${publicacao.slug}`,
    image: publicacao.capaPoster ?? undefined,
    article: {
      publishedTime: publicacao.dataPublicacao,
      ...(publicacao.dataAtualizacao ? { modifiedTime: publicacao.dataAtualizacao } : {}),
      ...(publicacao.autor ? { authors: [publicacao.autor.nome] } : {}),
    },
  });
}

export default async function PublicacaoPage({ params }: PageProps<"/artigos/[slug]">) {
  const { slug } = await params;
  const publicacao = await getPublicacaoBySlug(slug);

  if (!publicacao) notFound();

  const relacionadas = await getPublicacoesRelacionadas(publicacao);
  const { titulo, resumo, tipo, area, autor } = publicacao;
  const perfilAutor = autor ? `/equipe#${autor.slugPerfil}` : null;

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
          excerpt: resumo,
          slug: publicacao.slug,
          publishedAt: publicacao.dataPublicacao,
          modifiedAt: publicacao.dataAtualizacao,
          image: publicacao.capaPoster,
          author: autor && perfilAutor ? { name: autor.nome, path: perfilAutor } : null,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(trilha)} />

      <article className="bg-cream-100">
        <header className="container-site pt-8 lg:pt-14">
          <div className="mx-auto max-w-[45rem]">
            <nav aria-label="Trilha">
              <ol className="flex flex-wrap items-center gap-x-2 text-small text-neutral-600">
                <li>
                  <Link
                    href="/artigos"
                    className="inline-flex min-h-11 items-center underline-offset-2 hover:text-gold-700 hover:underline"
                  >
                    Conteúdo Jurídico
                  </Link>
                </li>
                {area ? (
                  <li className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-neutral-500">
                      /
                    </span>
                    <Link
                      href={hrefListagem({ area: area.chave })}
                      className="inline-flex min-h-11 items-center underline-offset-2 hover:text-gold-700 hover:underline"
                    >
                      {area.nome}
                    </Link>
                  </li>
                ) : null}
              </ol>
            </nav>

            <div className="mt-4">
              <RotuloPublicacao area={area?.nome} tipo={tipo} />
            </div>

            <h1 className="mt-4 text-[clamp(2rem,4.6vw,3rem)] leading-[1.15]">{titulo}</h1>

            <p className="mt-6 text-[1.25rem] leading-[1.6] text-primary-900/85">{resumo}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border-light py-4 text-small text-neutral-700">
              {autor ? (
                <p>
                  Por{" "}
                  {perfilAutor ? (
                    <Link
                      href={perfilAutor}
                      className="font-semibold text-primary-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
                    >
                      {autor.nome}
                    </Link>
                  ) : (
                    <span className="font-semibold text-primary-900">{autor.nome}</span>
                  )}
                  {autor.oab ? <span className="text-neutral-600"> · {autor.oab}</span> : null}
                </p>
              ) : null}
              <p>
                Publicado em{" "}
                <time dateTime={isoDate(publicacao.dataPublicacao)}>
                  {formatDate(publicacao.dataPublicacao)}
                </time>
              </p>
              {publicacao.dataAtualizacao ? (
                <p>
                  Atualizado em{" "}
                  <time dateTime={isoDate(publicacao.dataAtualizacao)}>
                    {formatDate(publicacao.dataAtualizacao)}
                  </time>
                </p>
              ) : null}
              {publicacao.tempoLeitura ? (
                <p>{publicacao.tempoLeitura} min de leitura</p>
              ) : null}
              <div className="sm:ml-auto">
                <BotaoCompartilhar titulo={titulo} slug={publicacao.slug} />
              </div>
            </div>
          </div>
        </header>

        <div className="container-site mt-8 lg:mt-12">
          <CapaPublicacao
            capaTitulo={publicacao.capaTitulo}
            video={publicacao.capaVideo}
            poster={publicacao.capaPoster}
            variante="artigo"
            prioridade
            className="mx-auto max-w-[70rem] rounded-md"
          />
        </div>

        <div className="container-site pb-16 pt-10 lg:pb-24 lg:pt-14">
          <div className="mx-auto max-w-[45rem]">
            {publicacao.emResumo.length > 0 ? (
              <aside
                aria-labelledby="em-resumo"
                className="mb-10 rounded-md border-l-2 border-gold-500 bg-ivory-100 px-6 py-5 sm:px-8 sm:py-6"
              >
                <h2 id="em-resumo" className="text-eyebrow font-semibold uppercase text-gold-700 [font-family:var(--font-sans)]">
                  Em resumo
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-body-lg text-neutral-700 marker:text-gold-700">
                  {publicacao.emResumo.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            ) : null}

            {publicacao.conteudo ? <CorpoPublicacao conteudo={publicacao.conteudo} /> : null}

            {publicacao.fontes.length > 0 ? (
              <section aria-labelledby="fontes" className="mt-14 border-t border-border-light pt-8">
                <h2 id="fontes" className="text-[1.375rem]">
                  Fontes
                </h2>
                <ol className="mt-4 list-decimal space-y-2 pl-6 text-neutral-700 marker:text-neutral-600">
                  {publicacao.fontes.map((fonte) => (
                    <li key={fonte.url}>
                      <a
                        href={fonte.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
                      >
                        {fonte.titulo}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>
        </div>
      </article>

      <section className="bg-primary-900">
        <div className="container-site py-16 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-editorial text-[clamp(1.875rem,3.4vw,2.5rem)] font-medium leading-[1.15] text-gold-400">
                {area ? `Converse com a equipe de ${area.titulo}` : "Converse com a nossa equipe"}
              </h2>
              <p className="mt-4 text-body-lg text-white/80">
                Este conteúdo é um ponto de partida. Para entender como o tema se aplica ao seu
                caso, fale com quem atua na área.
              </p>
            </div>
            <div className="shrink-0">
              <SpecialistCta href={whatsappSobrePublicacao(titulo)} />
            </div>
          </div>
        </div>
      </section>

      {relacionadas.length > 0 ? (
        <section className="section-y bg-white">
          <div className="container-site">
            <h2 className="text-h3">Leia também</h2>
            <div aria-hidden="true" className="mt-4 h-px w-16 bg-gold-500" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:max-w-[54rem] lg:gap-8">
              {relacionadas.map((item) => (
                <CardPublicacao key={item.slug} publicacao={paraCard(item)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
