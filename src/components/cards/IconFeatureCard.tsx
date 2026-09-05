import { DynamicIcon } from "@/components/ui/Icons";

/**
 * Card de Ícone — valores, diferenciais e infraestrutura
 * (padroes-de-projeto.md §3.6).
 * Campos: ícone, título curto (2–4 palavras), descrição de 1 linha.
 *
 * Duas variantes: sobre navy (faixas da home) e sobre fundo claro (Estrutura
 * do Escritório). Nunca mais de 6 por grade.
 */
export function IconFeatureCard({
  icon,
  title,
  description,
  onDark = false,
}: {
  icon: string;
  title: string;
  description: string;
  onDark?: boolean;
}) {
  return (
    <div
      className={
        onDark
          ? "flex flex-col"
          : "flex flex-col rounded-md border border-border-light bg-white p-8 shadow-card"
      }
    >
      <DynamicIcon
        name={icon}
        width={36}
        height={36}
        className={onDark ? "text-gold-500" : "text-gold-700"}
      />
      <h3
        className={[
          "mt-5 text-h3",
          onDark ? "text-white" : "text-primary-900",
        ].join(" ")}
      >
        {title}
      </h3>
      <p className={["mt-3", onDark ? "text-white/70" : "text-neutral-700"].join(" ")}>
        {description}
      </p>
    </div>
  );
}
