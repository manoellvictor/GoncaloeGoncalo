import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Link "Ver todos/todas →" — sempre texto + seta, nunca botão sólido
 * (padroes-de-projeto.md §4).
 *
 * Sobre fundo claro usa gold-700 (4,84:1); sobre navy, gold-500 (6,96:1).
 * A seta é decorativa e fica escondida de leitores de tela.
 */
export function ArrowLink({
  href,
  children,
  onDark = false,
  className,
}: {
  href: string;
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "group inline-flex items-center gap-2 text-sm font-semibold",
        "transition-colors duration-200 ease-brand",
        onDark
          ? "text-gold-500 hover:text-gold-300"
          : "text-gold-700 hover:text-primary-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 ease-brand group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
