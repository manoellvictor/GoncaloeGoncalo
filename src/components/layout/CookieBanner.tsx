"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

/**
 * Banner de consentimento de cookies — exigência de LGPD (prd.md §7, §9).
 *
 * O consentimento vive no localStorage, que é estado externo ao React: por isso
 * `useSyncExternalStore` em vez de useState + useEffect. Ele também resolve a
 * hidratação — o snapshot do servidor devolve `SSR`, o banner não é renderizado
 * no HTML, e a decisão só acontece no cliente, sem divergência.
 *
 * "Recusar" tem o mesmo peso visual de "Aceitar": sob a LGPD o consentimento
 * precisa ser livre, e um botão de recusa escondido o descaracteriza.
 */
const STORAGE_KEY = "gg-cookie-consent";

type Consent = "accepted" | "rejected" | "unset" | "unavailable" | "SSR";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function readConsent(): Consent {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") return stored;
    return "unset";
  } catch {
    // Navegador com armazenamento bloqueado: sem consentimento registrável,
    // seguimos sem analytics e sem incomodar com o banner.
    return "unavailable";
  }
}

function writeConsent(choice: "accepted" | "rejected") {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* segue sem persistir */
  }
  for (const listener of listeners) listener();
}

/** Consulte antes de carregar qualquer script de analytics (GA4, tags). */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return readConsent() === "accepted";
}

export function CookieBanner() {
  const consent = useSyncExternalStore<Consent>(
    subscribe,
    readConsent,
    () => "SSR",
  );

  if (consent !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-primary-900 shadow-elevated"
    >
      <div className="container-site flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-2xl text-small text-white/80">
          Usamos cookies para entender como o site é utilizado e melhorar sua
          experiência. Você pode recusar sem prejuízo à navegação. Saiba mais na{" "}
          <Link
            href="/politicas#cookies"
            className="text-gold-300 underline underline-offset-2"
          >
            Política de Cookies
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => writeConsent("rejected")}
            className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 ease-brand hover:bg-white hover:text-primary-900"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => writeConsent("accepted")}
            className="rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-primary-900 transition-colors duration-200 ease-brand hover:bg-gold-300"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
