import Link from "next/link";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { categoryLabel, formatDate, isoDate } from "@/lib/format";
import type { Article } from "@/lib/supabase/database.types";

/**
 * Card de Artigo (padroes-de-projeto.md §3.4).
 * Campos: imagem, categoria (Artigo/Notícia), título, data.
 * A data fica sempre abaixo do título, no formato `dd mmm aaaa`.
 */
export function ArticleCard({
  article,
}: {
  article: Pick<
    Article,
    "slug" | "title" | "excerpt" | "category" | "published_at" | "cover_image_url"
  >;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-border-light bg-white shadow-card transition-shadow duration-200 ease-brand hover:shadow-elevated">
      <ImageFrame
        src={article.cover_image_url}
        alt=""
        ratio="wide"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />

      <div className="flex flex-1 flex-col p-7">
        <p className="text-eyebrow font-semibold uppercase text-gold-700">
          {categoryLabel(article.category)}
        </p>

        <h3 className="mt-3 text-h3">
          <Link
            href={`/artigos/${article.slug}`}
            className="after:absolute after:inset-0"
          >
            {article.title}
          </Link>
        </h3>

        <time
          dateTime={isoDate(article.published_at)}
          className="mt-3 text-small text-neutral-600"
        >
          {formatDate(article.published_at)}
        </time>

        <p className="mt-4 flex-1 text-neutral-700">{article.excerpt}</p>
      </div>
    </article>
  );
}
