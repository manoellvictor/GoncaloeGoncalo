import Link from "next/link";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { formatDate, isoDate } from "@/lib/format";
import type { PublicacaoCard } from "@/lib/publicacoes";

/**
 * Card de Artigo da home (padroes-de-projeto.md §3.4), ao lado do FAQ.
 * Campos: capa, "ÁREA · TIPO", título serifado, data e seta dourada.
 * A data fica sempre abaixo do título, no formato `dd mmm aaaa`.
 */
export function ArticleCard({ article }: { article: PublicacaoCard }) {
  const rotulo = [article.area?.nome, article.tipo].filter(Boolean).join(" · ");

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-border-light bg-white shadow-card transition-shadow duration-200 ease-brand hover:shadow-elevated">
      <ImageFrame
        src={article.capa?.url}
        alt={article.capa?.alt ?? ""}
        ratio="wide"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />

      <div className="flex flex-1 flex-col p-6">
        <p className="text-eyebrow font-semibold uppercase text-gold-700">{rotulo}</p>

        <h3 className="mt-3 flex-1 font-editorial text-[1.375rem] font-medium leading-snug text-primary-900">
          <Link href={`/artigos/${article.slug}`} className="after:absolute after:inset-0">
            {article.titulo}
          </Link>
        </h3>

        <time
          dateTime={isoDate(article.dataPublicacao)}
          className="mt-3 text-small text-neutral-600"
        >
          {formatDate(article.dataPublicacao)}
        </time>

        <span
          aria-hidden="true"
          className="mt-4 text-gold-700 transition-transform duration-200 ease-brand group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </article>
  );
}
