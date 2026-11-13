import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { formatDate, isoDate } from "@/lib/format";
import type { Publicacao } from "@/lib/publicacoes";
import { CapaPublicacao } from "./CapaPublicacao";
import { CompartilharWhatsApp, RotuloPublicacao } from "./CardPublicacao";

/**
 * Cartão largo do topo de /artigos (só no filtro "Todas"): capa à esquerda e,
 * à direita, "Em destaque · Área", título, resumo, tipo, data e "Ler artigo".
 * No celular a capa vai para cima.
 */
export function DestaquePublicacao({ publicacao }: { publicacao: Publicacao }) {
  const { slug, titulo, resumo, tipo, area, dataPublicacao } = publicacao;

  return (
    <article className="group relative grid overflow-hidden rounded-md border border-border-light bg-white shadow-card transition-shadow duration-200 ease-brand hover:shadow-elevated lg:grid-cols-[1.15fr_1fr]">
      <CapaPublicacao
        capaTitulo={titulo}
        imagem={publicacao.capa}
        variante="destaque"
        prioridade
      />

      <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
        <RotuloPublicacao prefixo="Em destaque" area={area?.nome} />

        <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.375rem)] leading-[1.18]">
          <Link href={`/artigos/${slug}`} className="after:absolute after:inset-0">
            {titulo}
          </Link>
        </h2>

        <p className="mt-5 text-body-lg text-neutral-700">{resumo}</p>

        <p className="mt-6 text-small text-neutral-600">
          {tipo} ·{" "}
          <time dateTime={isoDate(dataPublicacao)}>{formatDate(dataPublicacao)}</time>
        </p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-2 text-small font-semibold uppercase tracking-[0.12em] text-primary-900"
          >
            Ler artigo
            <ArrowRightIcon
              width={18}
              height={18}
              className="text-gold-700 transition-transform duration-200 ease-brand group-hover:translate-x-1"
            />
          </span>
          <CompartilharWhatsApp titulo={titulo} slug={slug} />
        </div>
      </div>
    </article>
  );
}
