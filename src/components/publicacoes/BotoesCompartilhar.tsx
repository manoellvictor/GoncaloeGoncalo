"use client";

import { useState } from "react";
import { LinkedInIcon, WhatsAppIcon } from "@/components/ui/Icons";
import {
  linkedinCompartilhar,
  urlPublicacao,
  whatsappCompartilhar,
} from "@/lib/publicacoes";

/**
 * Compartilhar o artigo: WhatsApp, LinkedIn e copiar o link. Os dois
 * primeiros são links comuns (funcionam sem JavaScript); "Copiar link" usa a
 * área de transferência e confirma com "Link copiado".
 */
export function BotoesCompartilhar({ titulo, slug }: { titulo: string; slug: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(urlPublicacao(slug));
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sem permissão para a área de transferência: mostra o link para copiar.
      window.prompt("Copie o link do artigo:", urlPublicacao(slug));
    }
  }

  const botao =
    "inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-light bg-white px-3.5 text-small font-semibold text-primary-900 transition-colors duration-200 ease-brand hover:border-gold-500";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="sr-only">Compartilhar:</span>
      <a
        href={whatsappCompartilhar(titulo, slug)}
        target="_blank"
        rel="noopener noreferrer"
        className={botao}
      >
        <WhatsAppIcon width={18} height={18} />
        WhatsApp
      </a>
      <a
        href={linkedinCompartilhar(slug)}
        target="_blank"
        rel="noopener noreferrer"
        className={botao}
      >
        <LinkedInIcon width={18} height={18} />
        LinkedIn
      </a>
      <button type="button" onClick={copiar} className={botao}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
          <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
        <span aria-live="polite">{copiado ? "Link copiado" : "Copiar link"}</span>
      </button>
    </div>
  );
}
