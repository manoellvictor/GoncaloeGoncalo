import Link from "next/link";
import { sair } from "@/lib/admin/acoes-acesso";
import { exigirEscritorio } from "@/lib/supabase/sessao";

/**
 * Telas do painel com login (lista e editor): barra com "Meus artigos",
 * "Ver o site" e "Sair". A sessão é conferida aqui no servidor, além do proxy.
 */
export default async function PainelLayout({ children }: LayoutProps<"/admin">) {
  await exigirEscritorio();

  const link =
    "inline-flex min-h-11 items-center rounded-md px-3 text-small font-semibold text-white/85 transition-colors duration-200 ease-brand hover:bg-white/10 hover:text-white";

  return (
    <>
      <header className="sticky top-0 z-40 bg-primary-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
          <Link href="/admin" className="flex min-h-11 items-center gap-2">
            <span className="font-editorial text-[1.25rem] font-medium text-white">
              Gonçalo &amp; Gonçalo
            </span>
            <span className="hidden text-eyebrow font-semibold uppercase text-gold-400 sm:inline">
              Painel
            </span>
          </Link>
          <nav aria-label="Painel" className="flex items-center gap-1">
            <Link href="/admin" className={link}>
              Meus artigos
            </Link>
            <a href="/artigos" target="_blank" rel="noopener noreferrer" className={link}>
              Ver o site
            </a>
            <form action={sair}>
              <button type="submit" className={link}>
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</div>
    </>
  );
}
