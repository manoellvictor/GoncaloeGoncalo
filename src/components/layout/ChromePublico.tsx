"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Mostra o cabeçalho, o rodapé e o aviso de cookies do site em todas as
 * páginas, menos no painel /admin — que tem a própria barra. A
 * pré-visualização de artigo (/admin/artigos/[id]/previa) mantém o site em
 * volta, para mostrar o artigo exatamente como ficará.
 */
export function ChromePublico({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noPainel = pathname.startsWith("/admin") && !pathname.endsWith("/previa");
  return noPainel ? null : children;
}
