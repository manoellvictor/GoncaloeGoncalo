import type { AreaArtigo, StatusArtigo, TipoArtigo } from "@/lib/supabase/database.types";

/**
 * Regras dos artigos do painel, usadas na tela (avisos na hora) e de novo nas
 * server actions (que não confiam no navegador). O banco ainda tem a própria
 * trava: artigo publicado incompleto é recusado (artigos_publicado_completo).
 */

export const AREAS: readonly AreaArtigo[] = [
  "Tributário",
  "Cível",
  "Contratual",
  "Empresarial",
  "Administrativo",
  "Trabalhista",
  "Agronegócio",
];

export const TIPOS: readonly TipoArtigo[] = ["Artigo", "Notícia"];

export const LIMITE_RESUMO = 200;
export const LIMITE_SEO_TITULO = 60;
export const LIMITE_SEO_DESCRICAO = 160;

/** O que o editor envia ao salvar. */
export type DadosArtigo = {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  capa_url: string | null;
  capa_alt: string;
  area: AreaArtigo | null;
  tipo: TipoArtigo;
  autor_nome: string;
  video_instagram_url: string;
  seo_titulo: string;
  seo_descricao: string;
  destaque: boolean;
};

export type ErrosArtigo = Partial<Record<keyof DadosArtigo, string>>;

const SLUG_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const INSTAGRAM = /^https:\/\/(www\.)?instagram\.com\//;

/** Texto puro do HTML do editor, para saber se o corpo tem conteúdo. */
function temTexto(html: string): boolean {
  return html.replace(/<img[^>]*>/gi, "x").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim() !== "";
}

/** Erros que impedem até salvar o rascunho. */
export function validarParaSalvar(dados: DadosArtigo): ErrosArtigo {
  const erros: ErrosArtigo = {};
  if (!SLUG_VALIDO.test(dados.slug)) {
    erros.slug = "Use só letras minúsculas sem acento, números e hífens (ex.: reforma-tributaria).";
  }
  if (dados.resumo.length > LIMITE_RESUMO) {
    erros.resumo = `O resumo passou de ${LIMITE_RESUMO} caracteres.`;
  }
  if (dados.video_instagram_url && !INSTAGRAM.test(dados.video_instagram_url)) {
    erros.video_instagram_url =
      "Cole o link de um post do Instagram (começa com https://www.instagram.com/).";
  }
  return erros;
}

/** Erros que impedem publicar ou agendar. */
export function validarParaPublicar(dados: DadosArtigo): ErrosArtigo {
  const erros = validarParaSalvar(dados);
  if (!dados.titulo.trim()) erros.titulo = "Escreva o título do artigo.";
  if (!dados.resumo.trim()) erros.resumo ??= "Escreva o resumo.";
  if (!dados.area) erros.area = "Escolha a área do artigo.";
  if (!dados.autor_nome.trim()) erros.autor_nome = "Informe quem escreveu o artigo.";
  if (!dados.capa_url) erros.capa_url = "Envie a imagem de capa.";
  else if (!dados.capa_alt.trim()) {
    erros.capa_alt = "Descreva a imagem de capa (ajuda quem usa leitor de tela).";
  }
  if (!temTexto(dados.conteudo)) erros.conteudo = "Escreva o texto do artigo.";
  return erros;
}

export function temErros(erros: ErrosArtigo): boolean {
  return Object.keys(erros).length > 0;
}

/** Endereço a partir do título: "Reforma tributária!" → "reforma-tributaria". */
export function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90)
    .replace(/-$/, "");
}

/* ----------------------------------------------------------------- Situação */

export type Situacao = "rascunho" | "agendado" | "publicado";

export function situacaoDoArtigo(
  status: StatusArtigo,
  publicadoEm: string | null,
  agora = Date.now(),
): Situacao {
  if (status === "rascunho") return "rascunho";
  return publicadoEm && new Date(publicadoEm).getTime() > agora ? "agendado" : "publicado";
}

export const ROTULO_SITUACAO: Record<Situacao, string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  publicado: "Publicado",
};

/* -------------------------------------------------------------------- Datas */

/**
 * O escritório trabalha no horário de Brasília. Desde 2019 o Brasil não tem
 * horário de verão, então America/Sao_Paulo é sempre UTC−3.
 */
const FUSO = "America/Sao_Paulo";
const DESLOCAMENTO = "-03:00";

/** "12/11/2026 às 14:32" */
export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  const dia = data.toLocaleDateString("pt-BR", { timeZone: FUSO });
  const hora = data.toLocaleTimeString("pt-BR", {
    timeZone: FUSO,
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dia} às ${hora}`;
}

/** "14:32" */
export function formatarHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    timeZone: FUSO,
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** ISO → valor de <input type="datetime-local"> no horário de Brasília. */
export function paraCampoDataHora(iso: string): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const p = Object.fromEntries(partes.map((parte) => [parte.type, parte.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** Valor de <input type="datetime-local"> (Brasília) → ISO. */
export function deCampoDataHora(valor: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valor)) return null;
  const data = new Date(`${valor}:00${DESLOCAMENTO}`);
  return Number.isNaN(data.getTime()) ? null : data.toISOString();
}
