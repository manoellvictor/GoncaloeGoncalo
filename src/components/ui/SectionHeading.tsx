import type { ReactNode } from "react";

/**
 * Eyebrow — rótulo curto em caixa alta (máx. 3 palavras, padroes-de-projeto.md §5).
 * Sobre fundo claro usa gold-700 por contraste; sobre navy, gold-300.
 */
export function Eyebrow({
  children,
  onDark = false,
  className,
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={[
        "text-eyebrow font-semibold uppercase",
        onDark ? "text-gold-300" : "text-gold-700",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}

/**
 * Cabeçalho de seção: eyebrow + título + linha dourada de apoio, com slot
 * opcional de ação à direita (o link "Ver todos →" de padroes §4).
 *
 * `as` permite manter um único H1 por página (padroes §8): seções internas
 * usam h2, o bloco de título da página usa h1.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  onDark = false,
  as: Tag = "h2",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  onDark?: boolean;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <div
      className={[
        "flex flex-col gap-6",
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
      ].join(" ")}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? (
          <Eyebrow onDark={onDark} className="mb-3">
            {eyebrow}
          </Eyebrow>
        ) : null}

        <Tag
          className={[
            Tag === "h1" ? "text-h2" : "text-h2",
            onDark ? "text-white" : "text-primary-900",
          ].join(" ")}
        >
          {title}
        </Tag>

        {/* Linha dourada de apoio — accent decorativo (design-system.md §2.3) */}
        <div
          aria-hidden="true"
          className={[
            "mt-5 h-px w-16 bg-gold-500",
            centered ? "mx-auto" : "",
          ].join(" ")}
        />

        {description ? (
          <p
            className={[
              "mt-6 text-body-lg",
              onDark ? "text-white/80" : "text-neutral-700",
            ].join(" ")}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
