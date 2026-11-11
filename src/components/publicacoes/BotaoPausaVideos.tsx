"use client";

import { definirPausaCapas, usePausaCapas, useVideoPermitido } from "./preferencias-video";

/**
 * "Pausar vídeos / Retomar vídeos" — vale para todas as capas da página e
 * fica guardado para as próximas visitas. Com reduced-motion ou economia de
 * dados as capas já não tocam, então o botão não aparece.
 */
export function BotaoPausaVideos({ className }: { className?: string }) {
  const pausada = usePausaCapas();
  const permitido = useVideoPermitido();

  if (!permitido) return null;

  return (
    <button
      type="button"
      // O rótulo já muda com o estado; aria-pressed aqui leria "Retomar
      // vídeos, pressionado", o oposto do que acontece.
      onClick={() => definirPausaCapas(!pausada)}
      className={[
        "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-border-light bg-white px-4 text-small font-semibold text-primary-900",
        "transition-colors duration-200 ease-brand hover:border-gold-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true" className="flex w-3 justify-center">
        {pausada ? (
          <svg viewBox="0 0 12 12" width={12} height={12} fill="currentColor">
            <path d="M2 1l9 5-9 5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" width={12} height={12} fill="currentColor">
            <path d="M2 1h3v10H2zM7 1h3v10H7z" />
          </svg>
        )}
      </span>
      {pausada ? "Retomar vídeos" : "Pausar vídeos"}
    </button>
  );
}
