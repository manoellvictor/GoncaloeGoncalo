import Link from "next/link";
import type { ReactNode } from "react";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { BotoesCompartilhar } from "./BotoesCompartilhar";
import { CapaPublicacao } from "./CapaPublicacao";
import { CardPublicacao, RotuloPublicacao } from "./CardPublicacao";
import { CorpoPublicacao } from "./CorpoPublicacao";
import { formatDate, isoDate } from "@/lib/format";
import {
  hrefListagem,
  paraCard,
  whatsappSobrePublicacao,
  type Publicacao,
} from "@/lib/publicacoes";

/**
 * Página de uma publicação — a mesma no site (/artigos/[slug]) e na
 * pré-visualização do painel (/admin/artigos/[id]/previa), para o escritório
 * ver o artigo exatamente como ficará.
 *
 * Trilha, "ÁREA · TIPO", título, resumo, barra (autor, data, leitura,
 * compartilhar), capa, corpo em ~720px, vídeo do Instagram, CTA e "Leia
 * também" (até 3 da mesma área).
 */
export function ArtigoCompleto({
  publicacao,
  relacionadas,
  aviso,
}: {
  publicacao: Publicacao;
  relacionadas: Publicacao[];
  /** Faixa acima do artigo (pré-visualização de rascunho). */
  aviso?: ReactNode;
}) {
  const { titulo, resumo, tipo, area, autor } = publicacao;

  return (
    <>
      {aviso}

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

            <h1 className="mt-4 text-[clamp(2rem,4.6vw,3rem)] leading-[1.15]">
              {titulo || "Sem título"}
            </h1>

            {resumo ? (
              <p className="mt-6 text-[1.25rem] leading-[1.6] text-primary-900/85">{resumo}</p>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 border-y border-border-light py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-small text-neutral-700">
                {autor ? (
                  <p>
                    Por <span className="font-semibold text-primary-900">{autor}</span>
                  </p>
                ) : null}
                <p>
                  <time dateTime={isoDate(publicacao.dataPublicacao)}>
                    {formatDate(publicacao.dataPublicacao)}
                  </time>
                </p>
                {publicacao.tempoLeitura ? (
                  <p>{publicacao.tempoLeitura} min de leitura</p>
                ) : null}
              </div>
              <BotoesCompartilhar titulo={titulo} slug={publicacao.slug} />
            </div>
          </div>
        </header>

        <div className="container-site mt-8 lg:mt-12">
          <CapaPublicacao
            capaTitulo={titulo}
            imagem={publicacao.capa}
            variante="artigo"
            prioridade
            className="mx-auto max-w-[70rem] rounded-md"
          />
        </div>

        <div className="container-site pb-16 pt-10 lg:pb-24 lg:pt-14">
          <div className="mx-auto max-w-[45rem]">
            {publicacao.conteudo ? <CorpoPublicacao conteudo={publicacao.conteudo} /> : null}

            {publicacao.videoInstagram ? (
              <p className="mt-12 border-t border-border-light pt-8">
                <a
                  href={publicacao.videoInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 font-semibold text-primary-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width={22}
                    height={22}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                    className="shrink-0 text-gold-700"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
                  </svg>
                  Assista ao vídeo sobre este tema
                  <span className="sr-only">(abre o Instagram em nova aba)</span>
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </article>

      <CtaBanner
        title="Ficou com alguma dúvida?"
        description="Este conteúdo é um ponto de partida. Para entender como o tema se aplica ao seu caso, fale com um especialista da nossa equipe."
        ctaHref={whatsappSobrePublicacao(titulo)}
      />

      {relacionadas.length > 0 ? (
        <section className="section-y bg-white">
          <div className="container-site">
            <h2 className="text-h3">Leia também</h2>
            <div aria-hidden="true" className="mt-4 h-px w-16 bg-gold-500" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-8">
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
