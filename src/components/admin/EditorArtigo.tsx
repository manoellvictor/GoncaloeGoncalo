"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import {
  despublicarArtigo,
  excluirArtigo,
  publicarArtigo,
  salvarArtigo,
  type Resultado,
} from "@/lib/admin/acoes-artigos";
import {
  AREAS,
  LIMITE_RESUMO,
  LIMITE_SEO_DESCRICAO,
  LIMITE_SEO_TITULO,
  ROTULO_SITUACAO,
  TIPOS,
  deCampoDataHora,
  formatarDataHora,
  formatarHora,
  gerarSlug,
  paraCampoDataHora,
  situacaoDoArtigo,
  temErros,
  validarParaPublicar,
  type DadosArtigo,
  type ErrosArtigo,
} from "@/lib/admin/artigo-dados";
import type { StatusArtigo } from "@/lib/supabase/database.types";
import { CampoCapa } from "./CampoCapa";
import { EditorTexto } from "./EditorTexto";
import {
  ajuda,
  botaoDourado,
  botaoPerigo,
  botaoPrimario,
  botaoSecundario,
  campo,
  cartao,
  erroCampo,
  etiquetaSituacao,
  rotulo,
} from "./estilos";

/** Espera depois da última alteração antes de salvar o rascunho sozinho. */
const ESPERA_SALVAMENTO = 4000;

const NOMES_CAMPOS: Record<keyof DadosArtigo, string> = {
  titulo: "Título",
  slug: "Endereço",
  resumo: "Resumo",
  conteudo: "Texto do artigo",
  capa_url: "Imagem de capa",
  capa_alt: "Descrição da imagem",
  area: "Área",
  tipo: "Tipo",
  autor_nome: "Autor",
  video_instagram_url: "Vídeo do Instagram",
  seo_titulo: "Título no Google",
  seo_descricao: "Descrição no Google",
  destaque: "Destaque",
};

type EstadoSalvamento =
  | { tipo: "salvo"; em: string }
  | { tipo: "salvando" }
  | { tipo: "pendente" }
  | { tipo: "erro"; texto: string };

/**
 * Tela 2 — editor de artigo. Rascunho salva sozinho alguns segundos depois de
 * cada alteração ("Salvo às 14:32"); artigo no ar só muda no site quando o
 * escritório clica em "Salvar alterações". Avisa ao sair com alterações não
 * salvas.
 */
export function EditorArtigo({
  id,
  inicial,
  statusInicial,
  publicadoEmInicial,
  atualizadoEm,
  autores,
  destaqueAtual,
  siteHost,
}: {
  id: string;
  inicial: DadosArtigo;
  statusInicial: StatusArtigo;
  publicadoEmInicial: string | null;
  atualizadoEm: string;
  /** Nomes já usados como autor, para sugestão. */
  autores: string[];
  /** Título do artigo que está em destaque hoje (outro), se houver. */
  destaqueAtual: string | null;
  siteHost: string;
}) {
  const ids = useId();
  const router = useRouter();
  const [dados, setDados] = useState(inicial);
  const [status, setStatus] = useState(statusInicial);
  const [publicadoEm, setPublicadoEm] = useState(publicadoEmInicial);
  const [slugPublicado, setSlugPublicado] = useState(inicial.slug);
  const [erros, setErros] = useState<ErrosArtigo>({});
  const [resumoErros, setResumoErros] = useState<string | null>(null);
  const [salvamento, setSalvamento] = useState<EstadoSalvamento>({ tipo: "salvo", em: atualizadoEm });
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [agendando, setAgendando] = useState(false);
  const [dataAgendada, setDataAgendada] = useState(() =>
    paraCampoDataHora(
      publicadoEmInicial && new Date(publicadoEmInicial) > new Date()
        ? publicadoEmInicial
        : new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    ),
  );

  // O endereço acompanha o título até alguém mexer nele ou o artigo ir ao ar.
  const [slugManual, setSlugManual] = useState(
    statusInicial === "publicado" || !inicial.slug.startsWith("rascunho-"),
  );

  // `revisao` conta as alterações; o salvamento só limpa o "não salvo" se
  // nada mudou enquanto ele acontecia.
  const revisao = useRef(0);
  const [sujo, setSujo] = useState(false);
  const resumoRef = useRef<HTMLDivElement>(null);

  const situacao = situacaoDoArtigo(status, publicadoEm);
  const noAr = status === "publicado";

  const atualizar = useCallback(
    (valores: Partial<DadosArtigo>) => {
      revisao.current += 1;
      setSujo(true);
      setDados((atuais) => {
        const novos = { ...atuais, ...valores };
        if (valores.titulo !== undefined && !slugManual) {
          novos.slug = gerarSlug(valores.titulo) || atuais.slug;
        }
        return novos;
      });
      setErros((atuais) => {
        const restantes = { ...atuais };
        for (const chave of Object.keys(valores) as (keyof DadosArtigo)[]) delete restantes[chave];
        return restantes;
      });
      if (salvamento.tipo !== "salvando") setSalvamento({ tipo: "pendente" });
    },
    [slugManual, salvamento.tipo],
  );

  /** Aplica a resposta de uma ação do servidor. */
  const aplicar = useCallback((resultado: Resultado, revisaoEnviada: number) => {
    if (resultado.ok) {
      setStatus(resultado.status);
      setPublicadoEm(resultado.publicadoEm);
      setSlugPublicado(resultado.slug);
      setDados((atuais) => ({ ...atuais, slug: resultado.slug }));
      setSalvamento({ tipo: "salvo", em: resultado.salvoEm });
      setErros({});
      setResumoErros(null);
      if (revisao.current === revisaoEnviada) setSujo(false);
      if (resultado.status === "publicado") setSlugManual(true);
      return true;
    }
    setErros(resultado.campos ?? {});
    setSalvamento({ tipo: "erro", texto: resultado.erro });
    if (resultado.campos && temErros(resultado.campos)) {
      setResumoErros(resultado.erro);
      requestAnimationFrame(() => resumoRef.current?.focus());
    }
    return false;
  }, []);

  const salvar = useCallback(async () => {
    const enviada = revisao.current;
    setSalvamento({ tipo: "salvando" });
    try {
      return aplicar(await salvarArtigo(id, dados), enviada);
    } catch {
      setSalvamento({ tipo: "erro", texto: "Não foi possível salvar. Verifique sua conexão." });
      return false;
    }
  }, [aplicar, dados, id]);

  // Salvamento automático: só para rascunho (artigo no ar muda só ao clicar).
  useEffect(() => {
    if (!sujo || noAr || ocupado || salvamento.tipo === "salvando") return;
    const espera = window.setTimeout(() => void salvar(), ESPERA_SALVAMENTO);
    return () => window.clearTimeout(espera);
  }, [sujo, noAr, ocupado, salvamento.tipo, salvar]);

  // Aviso do navegador ao fechar/recarregar com alterações não salvas.
  useEffect(() => {
    if (!sujo) return;
    const avisar = (evento: BeforeUnloadEvent) => {
      evento.preventDefault();
      evento.returnValue = "";
    };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sujo]);

  async function executar(acao: () => Promise<Resultado>, depois?: () => void) {
    setMensagem(null);
    setOcupado(true);
    const enviada = revisao.current;
    try {
      const resultado = await acao();
      if (aplicar(resultado, enviada)) {
        setMensagem({ tipo: "ok", texto: resultado.ok && resultado.mensagem ? resultado.mensagem : "Alterações salvas." });
        depois?.();
      } else if (!resultado.ok) {
        setMensagem({ tipo: "erro", texto: resultado.erro });
      }
    } catch {
      setMensagem({ tipo: "erro", texto: "Não foi possível salvar. Verifique sua conexão." });
      setSalvamento({ tipo: "erro", texto: "Não foi possível salvar. Verifique sua conexão." });
    } finally {
      setOcupado(false);
    }
  }

  /** Confere tudo na tela antes de mandar publicar. */
  function conferirParaPublicar(): boolean {
    const encontrados = validarParaPublicar(dados);
    if (!temErros(encontrados)) return true;
    setErros(encontrados);
    setResumoErros("Antes de publicar, complete os campos indicados:");
    setMensagem(null);
    requestAnimationFrame(() => resumoRef.current?.focus());
    return false;
  }

  function publicarAgora() {
    if (!conferirParaPublicar()) return;
    void executar(() => publicarArtigo(id, dados), () => setAgendando(false));
  }

  function confirmarAgendamento() {
    if (!conferirParaPublicar()) return;
    const quando = deCampoDataHora(dataAgendada);
    if (!quando || new Date(quando) <= new Date()) {
      setMensagem({ tipo: "erro", texto: "Escolha uma data e hora no futuro para agendar." });
      return;
    }
    void executar(() => publicarArtigo(id, dados, quando), () => setAgendando(false));
  }

  function despublicar() {
    if (!window.confirm("Tirar este artigo do site? Ele volta a ser rascunho.")) return;
    void executar(() => despublicarArtigo(id));
  }

  async function excluir() {
    if (!window.confirm("Excluir este artigo? Esta ação não pode ser desfeita.")) return;
    setOcupado(true);
    try {
      const resultado = await excluirArtigo(id);
      if (resultado.ok) {
        setSujo(false);
        router.push("/admin?aviso=excluido");
        return;
      }
      setMensagem({ tipo: "erro", texto: resultado.erro ?? "Não foi possível excluir." });
    } catch {
      setMensagem({ tipo: "erro", texto: "Não foi possível excluir. Verifique sua conexão." });
    }
    setOcupado(false);
  }

  /** Pré-visualizar: salva o rascunho antes, para a prévia mostrar o que está na tela. */
  async function previsualizar() {
    const janela = window.open("about:blank", "_blank");
    if (sujo && !noAr) await salvar();
    const endereco = `/admin/artigos/${id}/previa`;
    if (janela) janela.location.href = endereco;
    else router.push(endereco);
    if (sujo && noAr) {
      setMensagem({
        tipo: "erro",
        texto: "A pré-visualização mostra a versão salva. Clique em “Salvar alterações” para ver as mudanças.",
      });
    }
  }

  function alternarDestaque(marcado: boolean) {
    if (marcado && destaqueAtual) {
      const ok = window.confirm(
        `Hoje o destaque é “${destaqueAtual}”. Ao salvar, ele deixa de ser destaque e este artigo passa a ocupar o lugar. Continuar?`,
      );
      if (!ok) return;
    }
    atualizar({ destaque: marcado });
  }

  function voltar(evento: MouseEvent<HTMLAnchorElement>) {
    if (sujo && !window.confirm("Há alterações não salvas. Sair mesmo assim?")) {
      evento.preventDefault();
    }
  }

  const listaErros = (Object.keys(erros) as (keyof DadosArtigo)[]).filter((chave) => erros[chave]);
  const erroDe = (chave: keyof DadosArtigo) => erros[chave];

  const indicador =
    salvamento.tipo === "salvando"
      ? "Salvando…"
      : salvamento.tipo === "erro"
        ? salvamento.texto
        : salvamento.tipo === "pendente" || sujo
          ? noAr
            ? "Alterações ainda não salvas"
            : "Alterações não salvas"
          : `Salvo às ${formatarHora(salvamento.em)}`;

  const seoTitulo = dados.seo_titulo || dados.titulo || "Título do artigo";
  const seoDescricao =
    dados.seo_descricao || dados.resumo || "O resumo do artigo aparece aqui no resultado da busca.";

  return (
    <div>
      {/* Barra fixa: situação, salvamento e ações principais. */}
      <div className="sticky top-[3.75rem] z-30 -mx-4 border-b border-border-light bg-cream-100/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href="/admin"
              onClick={voltar}
              className="inline-flex min-h-11 items-center text-small font-semibold text-primary-900 hover:text-gold-700"
            >
              ← Meus artigos
            </Link>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ring-1 ring-inset ${etiquetaSituacao[situacao]}`}
            >
              {ROTULO_SITUACAO[situacao]}
              {situacao === "agendado" && publicadoEm ? ` para ${formatarDataHora(publicadoEm)}` : ""}
            </span>
            <span
              aria-live="polite"
              className={`text-small ${salvamento.tipo === "erro" ? "font-semibold text-red-800" : "text-neutral-600"}`}
            >
              {indicador}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={previsualizar} disabled={ocupado} className={botaoSecundario}>
              Pré-visualizar
            </button>
            {noAr ? (
              <button
                type="button"
                onClick={() => void executar(() => salvarArtigo(id, dados))}
                disabled={ocupado || !sujo}
                className={botaoPrimario}
              >
                Salvar alterações
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void executar(() => salvarArtigo(id, dados))}
                disabled={ocupado}
                className={botaoSecundario}
              >
                Salvar rascunho
              </button>
            )}
            {situacao !== "publicado" ? (
              <>
                <button
                  type="button"
                  onClick={() => setAgendando((aberto) => !aberto)}
                  aria-expanded={agendando}
                  aria-controls={`${ids}-agendar`}
                  disabled={ocupado}
                  className={botaoSecundario}
                >
                  {situacao === "agendado" ? "Mudar agendamento" : "Agendar publicação"}
                </button>
                <button type="button" onClick={publicarAgora} disabled={ocupado} className={botaoDourado}>
                  Publicar agora
                </button>
              </>
            ) : null}
          </div>
        </div>

        {agendando ? (
          <div
            id={`${ids}-agendar`}
            className="mt-3 flex flex-wrap items-end gap-3 rounded-md border border-border-light bg-white p-3"
          >
            <div>
              <label htmlFor={`${ids}-quando`} className={rotulo}>
                Publicar em (horário de Brasília)
              </label>
              <input
                id={`${ids}-quando`}
                type="datetime-local"
                value={dataAgendada}
                min={paraCampoDataHora(new Date().toISOString())}
                onChange={(evento) => setDataAgendada(evento.target.value)}
                className={`${campo} w-auto`}
              />
            </div>
            <button type="button" onClick={confirmarAgendamento} disabled={ocupado} className={botaoPrimario}>
              Confirmar agendamento
            </button>
            <button type="button" onClick={() => setAgendando(false)} className={botaoSecundario}>
              Cancelar
            </button>
          </div>
        ) : null}
      </div>

      <div aria-live="polite">
        {mensagem ? (
          <p
            className={`mt-5 rounded-md px-4 py-3 text-small ${
              mensagem.tipo === "ok" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 font-semibold text-red-800"
            }`}
          >
            {mensagem.texto}
          </p>
        ) : null}
      </div>

      {resumoErros && listaErros.length > 0 ? (
        <div
          ref={resumoRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-small text-red-900 focus:outline-none"
        >
          <p className="font-semibold">{resumoErros}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {listaErros.map((chave) => (
              <li key={chave}>
                <a href={`#${ids}-${chave}`} className="underline underline-offset-2">
                  {NOMES_CAMPOS[chave]}
                </a>
                : {erros[chave]}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        {/* Coluna principal: título, endereço, resumo e texto. */}
        <div className="space-y-6">
          <div className={cartao}>
            <label htmlFor={`${ids}-titulo`} className={rotulo}>
              Título
            </label>
            <input
              id={`${ids}-titulo`}
              type="text"
              value={dados.titulo}
              onChange={(evento) => atualizar({ titulo: evento.target.value })}
              aria-invalid={Boolean(erroDe("titulo"))}
              placeholder="Ex.: Reforma tributária: o que muda para as empresas"
              className={`${campo} font-display text-[1.375rem]`}
            />
            {erroDe("titulo") ? <p className={erroCampo}>{erroDe("titulo")}</p> : null}

            <div className="mt-5">
              <label htmlFor={`${ids}-slug`} className={rotulo}>
                Endereço da página
              </label>
              <div className="mt-2 flex items-stretch overflow-hidden rounded-md border border-border-light focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/30">
                <span className="hidden items-center bg-cream-100 px-3 text-small text-neutral-600 sm:flex">
                  /artigos/
                </span>
                <input
                  id={`${ids}-slug`}
                  type="text"
                  value={dados.slug}
                  onChange={(evento) => {
                    setSlugManual(true);
                    atualizar({ slug: evento.target.value.toLowerCase().replace(/\s+/g, "-") });
                  }}
                  aria-invalid={Boolean(erroDe("slug"))}
                  aria-describedby={`${ids}-slug-ajuda`}
                  className="min-w-0 flex-1 bg-white px-3 py-2.5 text-body text-primary-900 focus:outline-none"
                />
              </div>
              <p id={`${ids}-slug-ajuda`} className={erroDe("slug") ? erroCampo : ajuda}>
                {erroDe("slug") ??
                  (noAr
                    ? "Atenção: mudar o endereço de um artigo publicado quebra os links já compartilhados."
                    : "Criado a partir do título. Pode ser ajustado.")}
              </p>
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`${ids}-resumo`} className={rotulo}>
                  Resumo
                </label>
                <span
                  className={`text-small ${dados.resumo.length > LIMITE_RESUMO - 20 ? "font-semibold text-amber-800" : "text-neutral-600"}`}
                  aria-live="polite"
                >
                  {dados.resumo.length}/{LIMITE_RESUMO}
                </span>
              </div>
              <textarea
                id={`${ids}-resumo`}
                value={dados.resumo}
                maxLength={LIMITE_RESUMO}
                rows={3}
                onChange={(evento) => atualizar({ resumo: evento.target.value })}
                aria-invalid={Boolean(erroDe("resumo"))}
                aria-describedby={`${ids}-resumo-ajuda`}
                className={campo}
              />
              <p id={`${ids}-resumo-ajuda`} className={erroDe("resumo") ? erroCampo : ajuda}>
                {erroDe("resumo") ?? "Duas ou três frases que aparecem no card e abaixo do título."}
              </p>
            </div>
          </div>

          <div id={`${ids}-conteudo`}>
            <p className={`${rotulo} mb-2`}>Texto do artigo</p>
            <EditorTexto
              artigoId={id}
              valor={inicial.conteudo}
              onChange={(html) => atualizar({ conteudo: html })}
              invalido={Boolean(erroDe("conteudo"))}
              descricaoId={erroDe("conteudo") ? `${ids}-conteudo-erro` : undefined}
            />
            {erroDe("conteudo") ? (
              <p id={`${ids}-conteudo-erro`} className={erroCampo}>
                {erroDe("conteudo")}
              </p>
            ) : null}
          </div>
        </div>

        {/* Coluna lateral: classificação, capa, destaque, vídeo, Google. */}
        <div className="space-y-6">
          <div className={`${cartao} space-y-5`}>
            <div>
              <label htmlFor={`${ids}-area`} className={rotulo}>
                Área
              </label>
              <select
                id={`${ids}-area`}
                value={dados.area ?? ""}
                onChange={(evento) =>
                  atualizar({ area: (evento.target.value || null) as DadosArtigo["area"] })
                }
                aria-invalid={Boolean(erroDe("area"))}
                className={campo}
              >
                <option value="">Escolha a área</option>
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {erroDe("area") ? <p className={erroCampo}>{erroDe("area")}</p> : null}
            </div>

            <fieldset>
              <legend className={rotulo}>Tipo</legend>
              <div className="mt-2 flex gap-2">
                {TIPOS.map((tipo) => (
                  <label
                    key={tipo}
                    className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border px-3 text-small font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500 ${
                      dados.tipo === tipo
                        ? "border-primary-900 bg-primary-900 text-white"
                        : "border-border-light bg-white text-primary-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${ids}-tipo`}
                      value={tipo}
                      checked={dados.tipo === tipo}
                      onChange={() => atualizar({ tipo })}
                      className="sr-only"
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={`${ids}-autor_nome`} className={rotulo}>
                Autor
              </label>
              <input
                id={`${ids}-autor_nome`}
                type="text"
                list={`${ids}-autores`}
                value={dados.autor_nome}
                onChange={(evento) => atualizar({ autor_nome: evento.target.value })}
                aria-invalid={Boolean(erroDe("autor_nome"))}
                aria-describedby={`${ids}-autor-ajuda`}
                placeholder="Ex.: Dra. Fulana de Tal – OAB/MA 0000"
                className={campo}
              />
              <datalist id={`${ids}-autores`}>
                {autores.map((nome) => (
                  <option key={nome} value={nome} />
                ))}
              </datalist>
              <p id={`${ids}-autor-ajuda`} className={erroDe("autor_nome") ? erroCampo : ajuda}>
                {erroDe("autor_nome") ?? "Nome como deve aparecer no artigo, com a OAB."}
              </p>
            </div>
          </div>

          <div id={`${ids}-capa_url`} className={cartao}>
            <div id={`${ids}-capa_alt`} />
            <CampoCapa
              artigoId={id}
              url={dados.capa_url}
              alt={dados.capa_alt}
              erroUrl={erroDe("capa_url")}
              erroAlt={erroDe("capa_alt")}
              onChange={(valores) => atualizar(valores)}
            />
          </div>

          <div className={`${cartao} space-y-5`}>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={dados.destaque}
                onChange={(evento) => alternarDestaque(evento.target.checked)}
                className="mt-1 size-5 shrink-0 accent-primary-900"
              />
              <span>
                <span className="block text-small font-semibold text-primary-900">
                  Destacar na página Conteúdo Jurídico
                </span>
                <span className="mt-0.5 block text-small text-neutral-600">
                  Só um artigo fica em destaque por vez.
                  {destaqueAtual && !dados.destaque ? ` Hoje: “${destaqueAtual}”.` : ""}
                </span>
              </span>
            </label>

            <div id={`${ids}-video_instagram_url`}>
              <label htmlFor={`${ids}-video`} className={rotulo}>
                Vídeo do Instagram relacionado <span className="font-normal text-neutral-600">(opcional)</span>
              </label>
              <input
                id={`${ids}-video`}
                type="url"
                inputMode="url"
                value={dados.video_instagram_url}
                onChange={(evento) => atualizar({ video_instagram_url: evento.target.value })}
                aria-invalid={Boolean(erroDe("video_instagram_url"))}
                placeholder="https://www.instagram.com/p/…"
                className={campo}
              />
              <p className={erroDe("video_instagram_url") ? erroCampo : ajuda}>
                {erroDe("video_instagram_url") ??
                  "Cole o link do post. No artigo aparece “Assista ao vídeo sobre este tema”."}
              </p>
            </div>
          </div>

          <details className={`${cartao} group`}>
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-small font-semibold text-primary-900">
              Aparência no Google
              <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <p className={ajuda}>
              Opcional. Em branco, o Google mostra o título e o resumo do artigo.
            </p>

            <div className="mt-4 rounded-md border border-border-light bg-white p-4" aria-label="Prévia no Google">
              <p className="truncate text-[0.8125rem] text-neutral-600">
                {siteHost} › artigos › {dados.slug}
              </p>
              <p className="mt-1 line-clamp-2 text-[1.125rem] leading-snug text-[#1a0dab]">
                {seoTitulo.length > LIMITE_SEO_TITULO ? `${seoTitulo.slice(0, LIMITE_SEO_TITULO - 1)}…` : seoTitulo}
              </p>
              <p className="mt-1 line-clamp-2 text-small text-neutral-700">
                {seoDescricao.length > LIMITE_SEO_DESCRICAO
                  ? `${seoDescricao.slice(0, LIMITE_SEO_DESCRICAO - 1)}…`
                  : seoDescricao}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <label htmlFor={`${ids}-seo-titulo`} className={rotulo}>
                  Título no Google
                </label>
                <span className="text-small text-neutral-600">
                  {dados.seo_titulo.length}/{LIMITE_SEO_TITULO}
                </span>
              </div>
              <input
                id={`${ids}-seo-titulo`}
                type="text"
                value={dados.seo_titulo}
                maxLength={LIMITE_SEO_TITULO + 20}
                placeholder={dados.titulo}
                onChange={(evento) => atualizar({ seo_titulo: evento.target.value })}
                className={campo}
              />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <label htmlFor={`${ids}-seo-descricao`} className={rotulo}>
                  Descrição no Google
                </label>
                <span className="text-small text-neutral-600">
                  {dados.seo_descricao.length}/{LIMITE_SEO_DESCRICAO}
                </span>
              </div>
              <textarea
                id={`${ids}-seo-descricao`}
                rows={3}
                value={dados.seo_descricao}
                maxLength={LIMITE_SEO_DESCRICAO + 40}
                placeholder={dados.resumo}
                onChange={(evento) => atualizar({ seo_descricao: evento.target.value })}
                className={campo}
              />
            </div>
          </details>

          <div className={`${cartao} space-y-3`}>
            {noAr ? (
              <>
                {situacao === "publicado" ? (
                  <a
                    href={`/artigos/${slugPublicado}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${botaoSecundario} w-full`}
                  >
                    Ver no site
                  </a>
                ) : null}
                <button type="button" onClick={despublicar} disabled={ocupado} className={`${botaoSecundario} w-full`}>
                  Despublicar
                </button>
              </>
            ) : null}
            <button type="button" onClick={excluir} disabled={ocupado} className={`${botaoPerigo} w-full`}>
              Excluir artigo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
