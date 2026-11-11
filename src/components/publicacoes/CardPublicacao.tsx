import type { Ref } from "react";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { formatDate, isoDate } from "@/lib/format";
import { whatsappCompartilhar, type PublicacaoCard } from "@/lib/publicacoes";
import { CapaPublicacao } from "./CapaPublicacao";

/**
 * Card do feed de /artigos: capa (vídeo ou tipográfica), "ÁREA · TIPO",
 * título como link (o card inteiro é clicável), resumo, data e "Ler →".
 * No celular ganha o atalho de compartilhar pelo WhatsApp.
 *
 * Sem "use client": renderiza no servidor na primeira carga e no cliente
 * quando chega pelo "Carregar mais".
 */
export function CardPublicacao({
  publicacao,
  linkRef,
}: {
  publicacao: PublicacaoCard;
  /** Recebe o foco quando o card chega pelo "Carregar mais". */
  linkRef?: Ref<HTMLAnchorElement>;
}) {
  const { slug, titulo, resumo, tipo, area, dataPublicacao } = publicacao;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-border-light bg-white shadow-card transition-shadow duration-200 ease-brand hover:shadow-elevated">
      <CapaPublicacao
        capaTitulo={publicacao.capaTitulo}
        video={publicacao.capaVideo}
        poster={publicacao.capaPoster}
      />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <RotuloPublicacao area={area?.nome} tipo={tipo} />

        <h3 className="mt-3 text-h3">
          <Link
            ref={linkRef}
            href={`/artigos/${slug}`}
            className="after:absolute after:inset-0 group-hover:text-primary-800"
          >
            {titulo}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-neutral-700">{resumo}</p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-border-light pt-4">
          <time dateTime={isoDate(dataPublicacao)} className="text-small text-neutral-600">
            {formatDate(dataPublicacao)}
          </time>
          <div className="flex items-center gap-1">
            <CompartilharWhatsApp titulo={titulo} slug={slug} />
            <span
              aria-hidden="true"
              className="text-small font-semibold text-gold-700 transition-transform duration-200 ease-brand group-hover:translate-x-1"
            >
              Ler →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/** "ÁREA · TIPO" em caixa alta, dourado escuro (5,5:1 sobre branco). */
export function RotuloPublicacao({
  area,
  tipo,
  prefixo,
}: {
  area?: string;
  tipo?: string;
  prefixo?: string;
}) {
  const partes = [prefixo, area, tipo].filter(Boolean);
  return (
    <p className="text-eyebrow font-semibold uppercase text-gold-700">
      {partes.join(" · ")}
    </p>
  );
}

/**
 * Atalho de compartilhar no celular. Fica acima do link que cobre o card
 * (z-10), para o toque não abrir o artigo.
 */
export function CompartilharWhatsApp({ titulo, slug }: { titulo: string; slug: string }) {
  return (
    <a
      href={whatsappCompartilhar(titulo, slug)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Compartilhar pelo WhatsApp"
      className="relative z-10 inline-flex size-11 items-center justify-center rounded-sm text-primary-900 transition-colors duration-200 ease-brand hover:text-gold-700 lg:hidden"
    >
      <WhatsAppIcon width={20} height={20} />
    </a>
  );
}
