"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  despublicarArtigo,
  excluirArtigo,
  publicarPelaLista,
} from "@/lib/admin/acoes-artigos";
import type { Situacao } from "@/lib/admin/artigo-dados";
import { botaoPerigo, botaoSecundario } from "./estilos";

/**
 * Ações de cada artigo na lista: Editar, Ver no site, Publicar/Despublicar e
 * Excluir (com confirmação). A resposta aparece logo abaixo, em português.
 */
export function AcoesArtigo({
  id,
  titulo,
  slug,
  situacao,
}: {
  id: string;
  titulo: string;
  slug: string;
  situacao: Situacao;
}) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const nome = titulo || "este artigo sem título";

  function executar(acao: () => Promise<{ ok: boolean; erro?: string; mensagem?: string }>) {
    setMensagem(null);
    iniciar(async () => {
      try {
        const resultado = await acao();
        setMensagem(
          resultado.ok
            ? { tipo: "ok", texto: resultado.mensagem ?? "Pronto." }
            : { tipo: "erro", texto: resultado.erro ?? "Algo deu errado." },
        );
        if (resultado.ok) router.refresh();
      } catch {
        setMensagem({ tipo: "erro", texto: "Não foi possível concluir. Verifique sua conexão." });
      }
    });
  }

  function excluir() {
    if (!window.confirm(`Excluir “${nome}”? Esta ação não pode ser desfeita.`)) return;
    executar(async () => {
      const resultado = await excluirArtigo(id);
      return resultado.ok ? { ...resultado, mensagem: "Artigo excluído." } : resultado;
    });
  }

  function despublicar() {
    if (!window.confirm(`Tirar “${nome}” do site? Ele volta a ser rascunho.`)) return;
    executar(() => despublicarArtigo(id));
  }

  return (
    <div className="flex flex-col gap-2 lg:items-end">
      <div className="flex flex-wrap gap-2">
        <Link href={`/admin/artigos/${id}`} className={botaoSecundario}>
          Editar
        </Link>
        {situacao === "publicado" ? (
          <a
            href={`/artigos/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={botaoSecundario}
          >
            Ver no site
          </a>
        ) : null}
        {situacao === "rascunho" ? (
          <button
            type="button"
            disabled={pendente}
            onClick={() => executar(() => publicarPelaLista(id))}
            className={botaoSecundario}
          >
            Publicar
          </button>
        ) : (
          <button type="button" disabled={pendente} onClick={despublicar} className={botaoSecundario}>
            Despublicar
          </button>
        )}
        <button type="button" disabled={pendente} onClick={excluir} className={botaoPerigo}>
          Excluir
        </button>
      </div>
      <p aria-live="polite" className="max-w-md text-small lg:text-right">
        {pendente ? <span className="text-neutral-600">Aguarde…</span> : null}
        {!pendente && mensagem ? (
          <span className={mensagem.tipo === "ok" ? "text-emerald-800" : "font-semibold text-red-800"}>
            {mensagem.texto}
          </span>
        ) : null}
      </p>
    </div>
  );
}
