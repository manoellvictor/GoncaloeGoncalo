/**
 * Classes do painel /admin — mesmas cores e fontes do site, num visual de
 * ferramenta: campos grandes (bons de tocar no celular), foco visível e
 * botões com hierarquia clara.
 */

export const rotulo = "block text-small font-semibold text-primary-900";

export const ajuda = "mt-1 text-small text-neutral-600";

export const campo =
  "mt-2 block w-full rounded-md border border-border-light bg-white px-3.5 py-2.5 text-body text-primary-900 placeholder:text-neutral-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 aria-[invalid=true]:border-red-700";

export const erroCampo = "mt-1.5 text-small font-semibold text-red-800";

const botao =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-small font-semibold transition-colors duration-200 ease-brand disabled:cursor-not-allowed disabled:opacity-60";

export const botaoPrimario = `${botao} bg-primary-900 text-white hover:bg-primary-800`;

export const botaoDourado = `${botao} bg-gold-500 text-primary-900 hover:bg-gold-600`;

export const botaoSecundario = `${botao} border border-border-light bg-white text-primary-900 hover:border-gold-500`;

export const botaoPerigo = `${botao} border border-red-200 bg-white text-red-800 hover:border-red-700 hover:bg-red-50`;

export const cartao = "rounded-lg border border-border-light bg-white p-5 sm:p-6";

/** Etiquetas de situação: Rascunho, Agendado, Publicado. */
export const etiquetaSituacao = {
  rascunho: "bg-neutral-100 text-neutral-700 ring-neutral-300",
  agendado: "bg-amber-50 text-amber-900 ring-amber-300",
  publicado: "bg-emerald-50 text-emerald-900 ring-emerald-300",
} as const;
