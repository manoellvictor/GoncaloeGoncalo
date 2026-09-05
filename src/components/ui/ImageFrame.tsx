import Image from "next/image";

/**
 * Quadro de imagem com placeholder de marca.
 *
 * Enquanto o escritório não fornece a fotografia final (ver
 * public/images/PENDENTES.md), renderiza um bloco navy com o monograma em vez
 * de imagem externa — mantém o tom "quiet luxury" e evita requisição a
 * terceiros. Assim que `src` existir, a imagem real assume sem mudar o layout.
 *
 * `alt` vazio marca imagem decorativa; imagem informativa exige alt descritivo
 * (design-system.md §10).
 */
export function ImageFrame({
  src,
  alt,
  ratio = "landscape",
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  overlay = false,
}: {
  src?: string | null;
  alt: string;
  ratio?: "landscape" | "portrait" | "square" | "wide";
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Overlay navy para texto sobreposto (design-system.md §6). */
  overlay?: boolean;
}) {
  const ratios = {
    landscape: "aspect-[4/3]",
    portrait: "aspect-[3/4]",
    square: "aspect-square",
    wide: "aspect-[16/9]",
  } as const;

  return (
    <div
      className={[
        "relative overflow-hidden bg-primary-900",
        ratios[ratio],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800"
        >
          <span className="font-display text-5xl text-gold-500/25">G</span>
        </div>
      )}

      {overlay ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/45 to-primary-900/20"
        />
      ) : null}
    </div>
  );
}
