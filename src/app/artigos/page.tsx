import Link from "next/link";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { BotaoPausaVideos } from "@/components/publicacoes/BotaoPausaVideos";
import { DestaquePublicacao } from "@/components/publicacoes/DestaquePublicacao";
import { FeedPublicacoes } from "@/components/publicacoes/FeedPublicacoes";
import { FiltrosArea } from "@/components/publicacoes/FiltrosArea";
import { pageMetadata } from "@/lib/seo";
import {
  areaPorChave,
  areasPublicacao,
  hrefListagem,
  paraCard,
} from "@/lib/publicacoes";
import { getContagemPorArea, getFeedPublicacoes } from "@/lib/supabase/queries";

type SearchParams = Awaited<PageProps<"/artigos">["searchParams"]>;

function primeiro(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Lê os filtros da URL. `?page=` é o nome antigo da paginação: links que já
 * circulam continuam caindo na página certa.
 */
function lerFiltros(params: SearchParams) {
  const query = primeiro(params.q)?.trim() || undefined;
  const area = areaPorChave(primeiro(params.area));
  const rawPagina = primeiro(params.pagina) ?? primeiro(params.page);
  const pagina = Math.max(1, Number.parseInt(rawPagina ?? "1", 10) || 1);
  return { query, area, pagina };
}

export async function generateMetadata({ searchParams }: PageProps<"/artigos">) {
  const { area, pagina } = lerFiltros(await searchParams);
  const titulo = [
    area ? `Conteúdo Jurídico: ${area.titulo}` : "Conteúdo Jurídico",
    pagina > 1 ? `página ${pagina}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return pageMetadata({
    title: titulo,
    description:
      "Artigos e notícias da equipe do Gonçalo & Gonçalo Advogados sobre direito tributário, cível, contratual e empresarial, explicados com clareza e objetividade.",
    path: hrefListagem({ area: area?.chave, pagina }),
  });
}

/**
 * Página 07 — hub "Conteúdo Jurídico": destaque, filtros por área e feed com
 * "Carregar mais". A busca do header chega por ?q= e combina com os filtros.
 */
export default async function ArtigosPage({ searchParams }: PageProps<"/artigos">) {
  const { query, area, pagina } = lerFiltros(await searchParams);

  const [feed, contagem] = await Promise.all([
    getFeedPublicacoes({ area: area?.slug, query, pagina }),
    getContagemPorArea(),
  ]);

  const opcoes = areasPublicacao
    .filter((opcao) => (contagem.get(opcao.slug) ?? 0) > 0)
    .map((opcao) => ({ ...opcao, total: contagem.get(opcao.slug) ?? 0 }));

  const destaque = pagina === 1 ? feed.destaque : null;
  const temVideo = Boolean(destaque?.capaVideo) || feed.itens.some((item) => item.capaVideo);
  const vazio = feed.itens.length === 0 && !destaque;

  return (
    <>
      <section className="bg-primary-900">
        <div className="container-site py-12 lg:py-14">
          <h1 className="text-h2 text-white">Conteúdo Jurídico</h1>
          <div aria-hidden="true" className="mt-5 h-px w-16 bg-gold-500" />
          <p className="mt-5 max-w-2xl text-body-lg text-white/80">
            Informação clara para decisões mais seguras.
          </p>
        </div>
      </section>

      <section className="bg-cream-100 pb-16 pt-8 lg:pb-24 lg:pt-12">
        <div className="container-site">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <FiltrosArea opcoes={opcoes} ativa={area?.chave ?? null} query={query} />
            {temVideo ? <BotaoPausaVideos className="self-end lg:self-auto" /> : null}
          </div>

          {query ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <p aria-live="polite" className="text-neutral-700">
                {feed.total === 0
                  ? `Nenhum resultado para “${query}”.`
                  : `${feed.total} ${feed.total === 1 ? "resultado" : "resultados"} para “${query}”.`}
              </p>
              <Link
                href={hrefListagem({ area: area?.chave })}
                className="inline-flex min-h-11 items-center text-small font-semibold text-gold-700 underline underline-offset-2"
              >
                Limpar busca
              </Link>
            </div>
          ) : null}

          {destaque ? (
            <div className="mt-8 lg:mt-10">
              <DestaquePublicacao publicacao={destaque} />
            </div>
          ) : null}

          {feed.itens.length > 0 ? (
            <>
              <h2 className="mt-14 text-h3 lg:mt-20">
                {area ? `Publicações em ${area.titulo}` : "Últimas publicações"}
              </h2>
              <div aria-hidden="true" className="mt-4 h-px w-16 bg-gold-500" />
              <FeedPublicacoes
                key={`${area?.chave ?? "todas"}|${query ?? ""}|${pagina}`}
                iniciais={feed.itens.map(paraCard)}
                pagina={pagina}
                totalPaginas={feed.totalPaginas}
                area={area?.chave ?? null}
                query={query}
              />
            </>
          ) : null}

          {vazio ? (
            <div className="mt-12">
              <p className="text-neutral-700">
                {query
                  ? "Tente outros termos ou consulte todas as publicações."
                  : pagina > 1
                    ? "Esta página não tem publicações."
                    : "Nenhuma publicação nesta área por enquanto."}
              </p>
              <Link
                href="/artigos"
                className="mt-4 inline-flex min-h-11 items-center text-small font-semibold text-gold-700 underline underline-offset-2"
              >
                Ver todas as publicações
              </Link>
            </div>
          ) : null}

          {/* Páginas numeradas: mantêm todo o acervo acessível por URL. */}
          {feed.totalPaginas > 1 ? (
            <nav aria-label="Páginas de publicações" className="mt-10">
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: feed.totalPaginas }, (_, index) => index + 1).map(
                  (numero) => {
                    const atual = numero === pagina;
                    return (
                      <li key={numero}>
                        <Link
                          href={hrefListagem({ area: area?.chave, q: query, pagina: numero })}
                          aria-current={atual ? "page" : undefined}
                          aria-label={`Página ${numero}`}
                          className={[
                            "flex size-11 items-center justify-center rounded-sm border text-sm font-semibold",
                            "transition-colors duration-200 ease-brand",
                            atual
                              ? "border-gold-500 bg-gold-500 text-primary-900"
                              : "border-border-light bg-white text-neutral-700 hover:border-gold-500",
                          ].join(" ")}
                        >
                          {numero}
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
        description="Nossos conteúdos são um ponto de partida. Para orientação sobre o seu caso, fale com a nossa equipe."
      />
    </>
  );
}
