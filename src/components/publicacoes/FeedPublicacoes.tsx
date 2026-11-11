"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { hrefListagem, type PublicacaoCard } from "@/lib/publicacoes";
import { CardPublicacao } from "./CardPublicacao";

/**
 * Grade de "Últimas publicações" com "Carregar mais conteúdos".
 *
 * O botão é um link para a próxima página numerada (?pagina=N): sem
 * JavaScript, ou aberto em nova aba, ele navega normalmente. Com JavaScript,
 * busca a página em /api/publicacoes e acrescenta os cards à grade; o foco vai
 * para o primeiro card novo, e a contagem é anunciada para leitores de tela.
 *
 * A página monta este componente com `key` por filtro/página, então trocar de
 * área zera a lista.
 */
export function FeedPublicacoes({
  iniciais,
  pagina,
  totalPaginas,
  area,
  query,
}: {
  iniciais: PublicacaoCard[];
  pagina: number;
  totalPaginas: number;
  /** Chave da área na URL (ex.: "tributario"). */
  area: string | null;
  query?: string;
}) {
  const [itens, setItens] = useState(iniciais);
  const [ultimaPagina, setUltimaPagina] = useState(pagina);
  const [carregando, setCarregando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState(false);
  const [focarEm, setFocarEm] = useState<number | null>(null);
  const primeiroNovoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (focarEm !== null) primeiroNovoRef.current?.focus();
  }, [focarEm]);

  const proxima = ultimaPagina + 1;
  const temMais = proxima <= totalPaginas;

  async function carregarMais(event: MouseEvent<HTMLAnchorElement>) {
    // Ctrl/Cmd+clique abre a página numerada em outra aba, como um link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    if (carregando) return;

    setCarregando(true);
    setAviso("");
    setErro(false);
    try {
      const params = new URLSearchParams({ pagina: String(proxima) });
      if (area) params.set("area", area);
      if (query) params.set("q", query);
      const resposta = await fetch(`/api/publicacoes?${params}`);
      if (!resposta.ok) throw new Error(String(resposta.status));
      const { itens: novos } = (await resposta.json()) as { itens: PublicacaoCard[] };

      setFocarEm(itens.length);
      setItens((atuais) => [...atuais, ...novos]);
      setUltimaPagina(proxima);
      setAviso(
        `${novos.length} ${novos.length === 1 ? "publicação carregada" : "publicações carregadas"}.`,
      );
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-8">
        {itens.map((publicacao, index) => (
          <CardPublicacao
            key={publicacao.slug}
            publicacao={publicacao}
            linkRef={index === focarEm ? primeiroNovoRef : undefined}
          />
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {aviso}
      </p>

      {erro ? (
        <p role="alert" className="mt-10 text-center text-neutral-700">
          Não foi possível carregar mais conteúdos. Tente novamente.
        </p>
      ) : null}

      {temMais ? (
        <div className={`${erro ? "mt-4" : "mt-12"} flex justify-center`}>
          <a
            href={hrefListagem({ area, q: query, pagina: proxima })}
            onClick={carregarMais}
            aria-busy={carregando}
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-primary-900 px-8 text-small font-semibold uppercase tracking-[0.12em] text-primary-900 transition-colors duration-200 ease-brand hover:bg-primary-900 hover:text-white"
          >
            {carregando ? "Carregando…" : "Carregar mais conteúdos"}
          </a>
        </div>
      ) : null}
    </>
  );
}
