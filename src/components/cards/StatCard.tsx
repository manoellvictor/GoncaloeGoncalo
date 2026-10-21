/**
 * Card de Estatística (padroes-de-projeto.md §3.7).
 * Campos: número/percentual em destaque + rótulo curto.
 *
 * O "+" de valores aproximados ("+20", "+500") faz parte do dado e vem pronto
 * na prop `value`, conforme a regra da §3.7.
 */
export function StatCard({
  value,
  label,
  onDark = false,
}: {
  value: string;
  label: string;
  onDark?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={[
          "font-display text-h2 font-semibold",
          onDark ? "text-gold-400" : "text-gold-700",
        ].join(" ")}
      >
        {value}
      </p>
      <div
        aria-hidden="true"
        className="mx-auto mt-4 h-px w-10 bg-gold-500"
      />
      <p
        className={[
          "mt-4 text-small",
          onDark ? "text-white/75" : "text-neutral-700",
        ].join(" ")}
      >
        {label}
      </p>
    </div>
  );
}
