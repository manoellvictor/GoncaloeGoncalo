import Link from "next/link";
import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { pageMetadata } from "@/lib/seo";
import { getArticlesPage } from "@/lib/supabase/queries";

export const metadata = pageMetadata({
  title: "Artigos",
  description:
    "Análises e notícias sobre direito empresarial, tributário, civil e proteção de dados, escritas pela equipe do escritório Gonçalo & Gonçalo Advogados.",
  path: "/artigos",
});

/** Página 07 — hub de conteúdo jurídico, com busca vinda do header e paginação. */
export default async function ArtigosPage({
  searchParams,
}: PageProps<"/artigos">) {
  const params = await searchParams;

  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() || undefined;

  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  const { articles, total, totalPages } = await getArticlesPage({ page, query });

  function pageHref(target: number) {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (target > 1) search.set("page", String(target));
    const qs = search.toString();
    return qs ? `/artigos?${qs}` : "/artigos";
  }

  return (
    <>
      <PageTitleBlock
        eyebrow="Conteúdo Jurídico"
        title="Artigos"
        description="Acompanhamos as mudanças que afetam nossos clientes e traduzimos o que elas significam na prática."
      />

      <section className="section-y bg-cream-100">
        <div className="container-site">
          {query ? (
            <div className="mb-10 flex flex-wrap items-center gap-4">
              <p aria-live="polite" className="text-neutral-700">
                {total === 0
                  ? `Nenhum resultado para “${query}”.`
                  : `${total} ${total === 1 ? "resultado" : "resultados"} para “${query}”.`}
              </p>
              <Link
                href="/artigos"
                className="text-small font-semibold text-gold-700 underline underline-offset-2"
              >
                Limpar busca
              </Link>
            </div>
          ) : null}

          {articles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-700">
              {query
                ? "Tente outros termos ou consulte todas as publicações."
                : "Nenhum artigo publicado no momento."}
            </p>
          )}

          {/* Paginação */}
          {totalPages > 1 ? (
            <nav aria-label="Paginação dos artigos" className="mt-16">
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (number) => {
                    const isCurrent = number === page;
                    return (
                      <li key={number}>
                        <Link
                          href={pageHref(number)}
                          aria-current={isCurrent ? "page" : undefined}
                          aria-label={`Página ${number}`}
                          className={[
                            "flex size-11 items-center justify-center rounded-sm border text-sm font-semibold",
                            "transition-colors duration-200 ease-brand",
                            isCurrent
                              ? "border-gold-500 bg-gold-500 text-primary-900"
                              : "border-border-light text-neutral-700 hover:border-gold-500",
                          ].join(" ")}
                        >
                          {number}
                        </Link>
                      </li>
                    );
                  },
                )}
              </ul>
            </nav>
          ) : null}
        </div>
      </section>

      <CtaBanner
        title="Ficou com alguma dúvida sobre o que leu?"
        description="Nossos artigos são um ponto de partida. Para orientação sobre o seu caso, fale com a nossa equipe."
      />
    </>
  );
}
