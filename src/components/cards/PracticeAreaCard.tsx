import Link from "next/link";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { DynamicIcon } from "@/components/ui/Icons";
import type { PracticeArea } from "@/lib/supabase/database.types";

/**
 * Card de Área de Atuação (padroes-de-projeto.md §3.3).
 * Campos: imagem, título, descrição curta, link com seta.
 *
 * `variant="image"` na home (4 destaques); `variant="icon"` na página 06,
 * onde o ícone substitui a imagem.
 *
 * O card inteiro é clicável via pseudo-elemento sobre o link do título: mantém
 * um único destino no leitor de tela em vez de repetir o link para cada parte.
 */
export function PracticeAreaCard({
  area,
  variant = "image",
}: {
  area: Pick<PracticeArea, "slug" | "title" | "short_description" | "icon" | "image_url">;
  variant?: "image" | "icon";
}) {
  const href = `/areas-de-atuacao/${area.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-border-light bg-white shadow-card transition-shadow duration-200 ease-brand hover:shadow-elevated">
      {variant === "image" ? (
        <ImageFrame
          src={area.image_url}
          alt=""
          ratio="landscape"
          sizes="(min-width: 1024px) 25vw, 100vw"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-8">
        {variant === "icon" ? (
          <DynamicIcon
            name={area.icon}
            width={40}
            height={40}
            className="mb-6 text-gold-700 transition-colors duration-200 ease-brand group-hover:text-primary-900"
          />
        ) : null}

        <h3 className="text-h3">
          <Link href={href} className="after:absolute after:inset-0">
            {area.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-neutral-700">{area.short_description}</p>

        <span
          aria-hidden="true"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-700"
        >
          Saiba mais
          <span className="transition-transform duration-200 ease-brand group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </article>
  );
}
