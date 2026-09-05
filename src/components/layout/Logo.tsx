import Link from "next/link";

/**
 * Logo — monograma "G" + nome por extenso (design-system.md §7.1).
 * Placeholder tipográfico até o escritório fornecer o arquivo de marca oficial.
 */
export function Logo({
  onDark = true,
  showTagline = false,
}: {
  onDark?: boolean;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3"
      aria-label="Gonçalo & Gonçalo Advogados Associados — ir para a página inicial"
    >
      <span
        aria-hidden="true"
        className={[
          "flex size-11 shrink-0 items-center justify-center rounded-sm border",
          "font-display text-2xl leading-none",
          "transition-colors duration-200 ease-brand",
          onDark
            ? "border-gold-500 text-gold-500 group-hover:bg-gold-500 group-hover:text-primary-900"
            : "border-gold-700 text-gold-700 group-hover:bg-gold-700 group-hover:text-white",
        ].join(" ")}
      >
        G
      </span>

      <span className="flex flex-col leading-tight">
        <span
          className={[
            "font-display text-base tracking-wide",
            onDark ? "text-white" : "text-primary-900",
          ].join(" ")}
        >
          Gonçalo &amp; Gonçalo
        </span>
        <span
          className={[
            "text-[0.6875rem] uppercase tracking-[0.18em]",
            onDark ? "text-white/60" : "text-neutral-600",
          ].join(" ")}
        >
          Advogados Associados
        </span>
        {showTagline ? (
          <span className="mt-2 text-small text-white/70 normal-case tracking-normal">
            Mais que Direito. Resultados Duradouros.
          </span>
        ) : null}
      </span>
    </Link>
  );
}
