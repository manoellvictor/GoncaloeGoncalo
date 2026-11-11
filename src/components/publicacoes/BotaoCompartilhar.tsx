"use client";

import type { MouseEvent } from "react";
import { whatsappCompartilhar, urlPublicacao } from "@/lib/publicacoes";

/**
 * "Compartilhar" da página do artigo. Onde o navegador oferece o painel nativo
 * (celulares, Safari, Edge), abre esse painel; nos demais — e sem
 * JavaScript — segue o link do WhatsApp com título + URL.
 */
export function BotaoCompartilhar({ titulo, slug }: { titulo: string; slug: string }) {
  async function compartilhar(event: MouseEvent<HTMLAnchorElement>) {
    if (typeof navigator.share !== "function") return;
    event.preventDefault();
    try {
      await navigator.share({ title: titulo, url: urlPublicacao(slug) });
    } catch {
      // Cancelado pelo visitante: nada a fazer.
    }
  }

  return (
    <a
      href={whatsappCompartilhar(titulo, slug)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={compartilhar}
      className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-light bg-white px-4 text-small font-semibold text-primary-900 transition-colors duration-200 ease-brand hover:border-gold-500"
    >
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
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      Compartilhar
    </a>
  );
}
