import Image from "next/image";
import Link from "next/link";
import logoSelo from "../../../public/images/logo-selo.png";

/**
 * Logo — selo oficial (monograma "G" com legenda circular) + nome por extenso
 * (design-system.md §7.1). O selo é um PNG com fundo transparente e traço
 * branco/dourado, pensado para fundo navy; sobre fundo claro ganha um disco navy.
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
      <Image
        src={logoSelo}
        alt=""
        aria-hidden="true"
        priority
        sizes="64px"
        className={[
          "size-16 shrink-0 rounded-full",
          "transition-transform duration-200 ease-brand group-hover:scale-105",
          onDark ? "" : "bg-primary-900",
        ].join(" ")}
      />

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
