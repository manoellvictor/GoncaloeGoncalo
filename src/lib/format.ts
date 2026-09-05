/**
 * Data no formato `dd mmm aaaa` (ex.: "20 mai 2024") — padrão único em todo o
 * site (padroes-de-projeto.md §5).
 *
 * Formata em UTC de propósito: `published_at` é uma data editorial, e converter
 * para o fuso do servidor faria um artigo publicado à meia-noite aparecer no
 * dia anterior.
 */
const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Valor de `datetime` para o elemento <time>. */
export function isoDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

/** Rótulo de categoria de artigo em caixa alta (padroes §3.4). */
export function categoryLabel(category: string): string {
  return category === "noticia" ? "Notícia" : "Artigo";
}
