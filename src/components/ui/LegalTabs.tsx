"use client";

import { useRef, useSyncExternalStore } from "react";

/**
 * Abas de Políticas / Privacidade / Cookies / Termos
 * (padroes-de-projeto.md §3.12).
 *
 * Três abas em ordem fixa, troca client-side sem reload. Implementa o padrão
 * ARIA tablist completo (padroes §7): setas ←/→ e Home/End navegam entre as
 * abas, e só a aba ativa fica na ordem de Tab.
 *
 * O hash da URL é a fonte única de verdade da aba ativa. Isso mantém os links
 * do rodapé (#privacidade, #cookies, #termos) funcionando mesmo quando o
 * usuário já está nesta página — caso em que não há navegação, só mudança de
 * hash — e faz o botão "voltar" do navegador percorrer as abas.
 */
export type LegalTab = { id: string; label: string; content: React.ReactNode };

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getHash() {
  return window.location.hash.replace("#", "");
}

export function LegalTabs({ tabs }: { tabs: LegalTab[] }) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = tabs.some((tab) => tab.id === hash) ? hash : tabs[0]?.id;

  function select(id: string) {
    window.history.pushState(null, "", `#${id}`);
    // pushState não dispara hashchange; avisamos manualmente para o store.
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const targets: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;

    event.preventDefault();
    const next = (target + tabs.length) % tabs.length;
    select(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Documentos legais"
        className="flex flex-wrap gap-1 border-b border-border-light"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={[
                "-mb-px border-b-2 px-6 py-4 text-sm font-semibold",
                "transition-colors duration-200 ease-brand",
                isActive
                  ? "border-gold-500 text-primary-900"
                  : "border-transparent text-neutral-600 hover:text-primary-900",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          className="pt-10"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
