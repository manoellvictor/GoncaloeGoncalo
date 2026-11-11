"use client";

import { useSyncExternalStore } from "react";

/**
 * Preferências que decidem se as capas em vídeo tocam:
 *
 * - pausa global ("Pausar vídeos"), guardada em localStorage — com try/catch,
 *   porque o armazenamento pode estar bloqueado (aba anônima, cookies off);
 * - prefers-reduced-motion: reduce;
 * - economia de dados ou conexão 2G (navigator.connection, quando existe).
 *
 * No servidor e na hidratação tudo começa como "não tocar": nenhum vídeo é
 * pedido antes de o cliente confirmar que pode.
 */

const STORAGE_KEY = "gg-capas-video-pausadas";
const listeners = new Set<() => void>();
let pausadas: boolean | null = null;

function lerPausadas(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function assinarPausa(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function definirPausaCapas(valor: boolean) {
  pausadas = valor;
  try {
    window.localStorage.setItem(STORAGE_KEY, valor ? "1" : "0");
  } catch {
    // Sem armazenamento a escolha vale só até recarregar a página.
  }
  listeners.forEach((listener) => listener());
}

/** `true` quando o visitante pausou as capas. */
export function usePausaCapas(): boolean {
  return useSyncExternalStore(
    assinarPausa,
    () => (pausadas ??= lerPausadas()),
    () => false,
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function assinarMovimento(listener: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

function conexaoLimitada(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (!connection) return false;
  return (
    connection.saveData === true ||
    connection.effectiveType === "slow-2g" ||
    connection.effectiveType === "2g"
  );
}

/**
 * `true` quando movimento e conexão permitem vídeo (antes da pausa manual).
 * Na hidratação devolve `false`, então só o poster aparece até o cliente
 * avaliar as preferências.
 */
export function useVideoPermitido(): boolean {
  return useSyncExternalStore(
    assinarMovimento,
    () => !window.matchMedia(REDUCED_MOTION).matches && !conexaoLimitada(),
    () => false,
  );
}
