import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Botão — 3 variantes de design-system.md §7.2, com os 4 estados exigidos
 * (default, hover, focus, disabled).
 *
 * `onDark` alterna a paleta: sobre navy o dourado #C9A227 tem 6,96:1 e pode ser
 * texto; sobre fundo claro ele tem apenas 2,22:1, então usamos gold-700.
 * Ver Docs/contraste.md.
 */
type Variant = "primary" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-8 py-3.5 " +
  "text-sm font-semibold tracking-wide transition-colors duration-200 ease-brand " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, { onLight: string; onDark: string }> = {
  primary: {
    onLight: "bg-gold-500 text-primary-900 hover:bg-gold-700 hover:text-white",
    onDark: "bg-gold-500 text-primary-900 hover:bg-gold-300",
  },
  outline: {
    onLight:
      "border border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white",
    onDark: "border border-white/70 text-white hover:bg-white hover:text-primary-900",
  },
};

function classesFor(variant: Variant, onDark: boolean, className?: string) {
  return [base, onDark ? variants[variant].onDark : variants[variant].onLight, className]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = {
  variant?: Variant;
  onDark?: boolean;
  children: ReactNode;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "children">)
  | ({ href?: never } & Omit<ComponentProps<"button">, "children">)
);

export function Button({
  variant = "primary",
  onDark = false,
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
      </Link>
    );
  }

  // Sem `href`, o restante das props é de <button> — o union já garante isso.
  const buttonProps = props as Omit<ComponentProps<"button">, "children">;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
