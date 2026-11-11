"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { hrefListagem } from "@/lib/publicacoes";

/**
 * Filtros por área de /artigos. O filtro ativo vai para a URL
 * (?area=tributario): o link pode ser compartilhado e o botão voltar do
 * navegador desfaz o filtro. Trocar de área volta para a página 1 e mantém a
 * busca do header (?q=), se houver.
 *
 * No celular a fileira desliza na horizontal; cada botão tem 44px de altura.
 */
export function FiltrosArea({
  opcoes,
  ativa,
  query,
}: {
  opcoes: { chave: string; nome: string; total: number }[];
  ativa: string | null;
  query?: string;
}) {
  const router = useRouter();
  const [pendente, startTransition] = useTransition();
  const ativoRef = useRef<HTMLButtonElement>(null);

  // No celular, o filtro vindo da URL pode estar fora da área visível.
  useEffect(() => {
    ativoRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [ativa]);

  function escolher(chave: string | null) {
    if (chave === ativa) return;
    startTransition(() => {
      router.push(hrefListagem({ area: chave, q: query }), { scroll: false });
    });
  }

  const itens: { chave: string | null; rotulo: string }[] = [
    { chave: null, rotulo: "Todas" },
    ...opcoes.map((opcao) => ({
      chave: opcao.chave,
      rotulo: `${opcao.nome} (${opcao.total})`,
    })),
  ];

  return (
    <div
      role="group"
      aria-label="Filtrar por área"
      aria-busy={pendente}
      className="-mx-6 flex snap-x scroll-px-6 gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:min-w-0 lg:flex-1 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {itens.map(({ chave, rotulo }) => {
        const pressionado = chave === ativa;
        return (
          <button
            key={chave ?? "todas"}
            ref={pressionado ? ativoRef : undefined}
            type="button"
            aria-pressed={pressionado}
            onClick={() => escolher(chave)}
            className={[
              "min-h-11 shrink-0 snap-start whitespace-nowrap rounded-sm border px-4 text-small font-semibold",
              "transition-colors duration-200 ease-brand",
              pressionado
                ? "border-primary-900 bg-primary-900 text-white"
                : "border-border-light bg-white text-primary-900 hover:border-gold-500",
            ].join(" ")}
          >
            {rotulo}
          </button>
        );
      })}
    </div>
  );
}
