"use client";

import { useId, useState } from "react";
import { MinusIcon, PlusIcon } from "./Icons";

/**
 * Accordion de Perguntas Frequentes (padroes-de-projeto.md §3.8).
 *
 * Um item aberto por vez (comportamento padrão recomendado); resposta oculta
 * por padrão; ícone de estado sempre à direita da pergunta.
 *
 * Acessibilidade (padroes §7): o gatilho é um <button> real, então já funciona
 * com Tab/Enter/Espaço, e `aria-expanded`/`aria-controls` ligam pergunta e
 * resposta para o leitor de tela.
 *
 * A animação usa grid-template-rows 0fr→1fr para transicionar até a altura
 * real do conteúdo — `height: auto` não é animável.
 */
export type FaqItem = { id: string; question: string; answer: string };

export function FaqAccordion({
  items,
  onDark = false,
}: {
  items: FaqItem[];
  onDark?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  if (items.length === 0) return null;

  return (
    <div
      className={[
        "divide-y",
        onDark ? "divide-white/15" : "divide-border-light",
      ].join(" ")}
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={[
                  "flex w-full items-start justify-between gap-6 py-6 text-left",
                  "text-body-lg transition-colors duration-200 ease-brand",
                  onDark
                    ? "text-white hover:text-gold-400"
                    : "text-primary-900 hover:text-gold-700",
                ].join(" ")}
              >
                <span className="font-display">{item.question}</span>
                <span
                  className={[
                    "mt-0.5 shrink-0",
                    onDark ? "text-gold-400" : "text-gold-700",
                  ].join(" ")}
                >
                  {isOpen ? (
                    <MinusIcon width={20} height={20} />
                  ) : (
                    <PlusIcon width={20} height={20} />
                  )}
                </span>
              </button>
            </h3>

            {/* `inert` tira o painel fechado da ordem de foco e da árvore de
                acessibilidade — altura zero sozinha não faz isso, e o leitor
                de tela leria respostas visualmente ocultas. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={[
                "grid transition-[grid-template-rows] duration-300 ease-brand",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <p
                  className={[
                    "texto-padrao pb-6 pr-10",
                    onDark ? "text-white/75" : "",
                  ].join(" ")}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
