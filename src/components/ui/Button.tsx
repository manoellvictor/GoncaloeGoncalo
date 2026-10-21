import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Botão — variantes de design-system.md §7.2, com os 4 estados exigidos
 * (default, hover, focus, disabled).
 *
 * `onDark` alterna a paleta: sobre navy o dourado gold-500 tem 7,76:1 e pode ser
 * texto; sobre fundo claro ele tem apenas 2,26:1, então usamos gold-700.
 * Ver Docs/contraste.md.
 *
 * `gold-outline` é o botão editorial da home: contorno dourado fino, texto em
 * caixa alta espaçada; no hover preenche de dourado. `arrow` acrescenta "→".
 */
type Variant = "primary" | "outline" | "gold-outline";

const base =
  "group inline-flex items-center justify-center gap-2 transition-colors duration-200 ease-brand " +
  "disabled:pointer-events-none disabled:opacity-50";

const standardShape = "rounded-md px-8 py-3.5 text-sm font-semibold tracking-wide";
const editorialShape =
  "gap-3 rounded-sm px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em]";

const variants: Record<Variant, { shape: string; onLight: string; onDark: string }> = {
  primary: {
    shape: standardShape,
    onLight: "bg-gold-500 text-primary-900 hover:bg-gold-700 hover:text-white",
    onDark: "bg-gold-500 text-primary-900 hover:bg-gold-600",
  },
  outline: {
    shape: standardShape,
    onLight:
      "border border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white",
    onDark: "border border-white/70 text-white hover:bg-white hover:text-primary-900",
  },
  "gold-outline": {
    shape: editorialShape,
    onLight:
      "border border-gold-500 text-primary-900 hover:bg-gold-500 hover:text-primary-900",
    onDark: "border border-gold-500 text-white hover:bg-gold-500 hover:text-primary-900",
  },
};

function classesFor(variant: Variant, onDark: boolean, className?: string) {
  const v = variants[variant];
  return [base, v.shape, onDark ? v.onDark : v.onLight, className]
    .filter(Boolean)
    .join(" ");
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="transition-transform duration-200 ease-brand group-hover:translate-x-1"
    >
      →
    </span>
  );
}

type ButtonProps = {
  variant?: Variant;
  onDark?: boolean;
  /** Acrescenta a seta "→" depois do rótulo. */
  arrow?: boolean;
  children: ReactNode;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "children">)
  | ({ href?: never } & Omit<ComponentProps<"button">, "children">)
);

export function Button({
  variant = "primary",
  onDark = false,
  arrow = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = classesFor(variant, onDark, className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
        {arrow ? <Arrow /> : null}
      </Link>
    );
  }

  // Sem `href`, o restante das props é de <button> — o union já garante isso.
  const buttonProps = props as Omit<ComponentProps<"button">, "children">;
  return (
    <button className={classes} {...buttonProps}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}
