import Link from "next/link";
import { AcoesArtigo } from "@/components/admin/AcoesArtigo";
import {
  botaoDourado,
  botaoSecundario,
  campo,
  etiquetaSituacao,
  rotulo,
} from "@/components/admin/estilos";
import { criarArtigo } from "@/lib/admin/acoes-artigos";
import {
  AREAS,
  ROTULO_SITUACAO,
  formatarDataHora,
  situacaoDoArtigo,
  type Situacao,
} from "@/lib/admin/artigo-dados";
import { exigirEscritorio } from "@/lib/supabase/sessao";
import type { AreaArtigo } from "@/lib/supabase/database.types";

export const metadata = { title: "Meus artigos" };

const AVISOS: Record<string, string> = {
  senha: "Senha alterada.",
  excluido: "Artigo excluído.",
  "erro-novo": "Não foi possível criar o artigo. Verifique sua conexão e tente de novo.",
};

function primeiro(valor: string | string[] | undefined) {
  return (Array.isArray(valor) ? valor[0] : valor)?.trim() || undefined;
}

/** Tela 1 — lista de artigos com busca, filtros e ações. */
export default async function MeusArtigosPage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;
  const busca = primeiro(params.busca);
  const situacao = primeiro(params.situacao) as Situacao | undefined;
  const area = AREAS.find((a) => a === primeiro(params.area)) as AreaArtigo | undefined;
  const aviso = AVISOS[primeiro(params.aviso) ?? ""];

  const { supabase } = await exigirEscritorio();

  let consulta = supabase
    .from("artigos")
    .select("id, titulo, slug, area, tipo, status, publicado_em, atualizado_em, destaque")
    .order("atualizado_em", { ascending: false });

  if (busca) {
    consulta = consulta.ilike("titulo", `%${busca.replace(/[%_\\]/g, "\\$&")}%`);
  }
  if (area) consulta = consulta.eq("area", area);
  const agora = new Date().toISOString();
  if (situacao === "rascunho") consulta = consulta.eq("status", "rascunho");
  if (situacao === "publicado") {
    consulta = consulta.eq("status", "publicado").lte("publicado_em", agora);
  }
  if (situacao === "agendado") {
    consulta = consulta.eq("status", "publicado").gt("publicado_em", agora);
  }

  const { data: artigos, error } = await consulta;
  const filtrando = Boolean(busca || situacao || area);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[2rem] leading-tight">Meus artigos</h1>
        <form action={criarArtigo}>
          <button type="submit" className={`${botaoDourado} min-h-12 w-full px-6 text-body sm:w-auto`}>
            <span aria-hidden="true" className="text-[1.25rem] leading-none">
              +
            </span>
            Novo artigo
          </button>
        </form>
      </div>

      {aviso ? (
        <p role="status" className="mt-6 rounded-md bg-emerald-50 px-4 py-3 text-small text-emerald-900">
          {aviso}
        </p>
      ) : null}

      {/* Filtros por GET: funcionam sem JavaScript e ficam no endereço. */}
      <form
        role="search"
        className="mt-8 grid gap-4 rounded-lg border border-border-light bg-white p-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end sm:p-5"
      >
        <div>
          <label htmlFor="busca" className={rotulo}>
            Buscar pelo título
          </label>
          <input id="busca" name="busca" type="search" defaultValue={busca} className={campo} />
        </div>
        <div>
          <label htmlFor="situacao" className={rotulo}>
            Situação
          </label>
          <select id="situacao" name="situacao" defaultValue={situacao ?? ""} className={campo}>
            <option value="">Todas</option>
            <option value="rascunho">Rascunho</option>
            <option value="agendado">Agendado</option>
            <option value="publicado">Publicado</option>
          </select>
        </div>
        <div>
          <label htmlFor="area" className={rotulo}>
            Área
          </label>
          <select id="area" name="area" defaultValue={area ?? ""} className={campo}>
            <option value="">Todas</option>
            {AREAS.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className={botaoSecundario}>
            Filtrar
          </button>
          {filtrando ? (
            <Link href="/admin" className={botaoSecundario}>
              Limpar
            </Link>
          ) : null}
        </div>
      </form>

      {error ? (
        <p role="alert" className="mt-8 rounded-md bg-red-50 px-4 py-3 text-small font-semibold text-red-800">
          Não foi possível carregar os artigos. Verifique sua conexão e recarregue a página.
        </p>
      ) : artigos && artigos.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {artigos.map((artigo) => {
            const atual = situacaoDoArtigo(artigo.status, artigo.publicado_em);
            const data =
              atual === "rascunho"
                ? `Editado em ${formatarDataHora(artigo.atualizado_em)}`
                : atual === "agendado"
                  ? `Será publicado em ${formatarDataHora(artigo.publicado_em!)}`
                  : `Publicado em ${formatarDataHora(artigo.publicado_em!)}`;

            return (
              <li
                key={artigo.id}
                className="flex flex-col gap-4 rounded-lg border border-border-light bg-white p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ring-1 ring-inset ${etiquetaSituacao[atual]}`}
                    >
                      {ROTULO_SITUACAO[atual]}
                    </span>
                    {artigo.destaque ? (
                      <span className="inline-flex items-center rounded-full bg-primary-900 px-2.5 py-0.5 text-[0.75rem] font-semibold text-gold-400">
                        Em destaque
                      </span>
                    ) : null}
                    {artigo.area ? (
                      <span className="text-small text-neutral-600">
                        {artigo.area} · {artigo.tipo}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 font-sans text-body-lg font-semibold leading-snug">
                    <Link
                      href={`/admin/artigos/${artigo.id}`}
                      className="text-primary-900 hover:text-gold-700 hover:underline"
                    >
                      {artigo.titulo || "(sem título)"}
                    </Link>
                  </h2>
                  <p className="mt-1 text-small text-neutral-600">{data}</p>
                </div>

                <AcoesArtigo
                  id={artigo.id}
                  titulo={artigo.titulo}
                  slug={artigo.slug}
                  situacao={atual}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border-light bg-white px-6 py-12 text-center">
          <p className="text-body-lg text-primary-900">
            {filtrando
              ? "Nenhum artigo encontrado com esses filtros."
              : "Você ainda não escreveu nenhum artigo."}
          </p>
          <p className="mt-2 text-small text-neutral-600">
            {filtrando
              ? "Tente outra busca ou limpe os filtros."
              : "Clique em “Novo artigo” para começar."}
          </p>
        </div>
      )}
    </>
  );
}
