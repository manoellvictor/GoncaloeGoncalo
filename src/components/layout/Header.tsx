"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { mainNav, practiceAreaFallback } from "@/lib/site-config";

/**
 * Header global — instância única em app/layout.tsx, nunca copiada por página
 * (padroes-de-projeto.md §2).
 *
 * Ordem do menu fixa em todas as páginas (padroes §4). O dropdown de Áreas
 * lista as 8 especialidades. Mobile usa hambúrguer com overlay (padroes §6).
 *
 * A busca do header (prd.md §6.1) não tem página própria no sitemap, então
 * consulta o hub de artigos via `/artigos?q=`.
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const dropdownId = useId();
  const mobileId = useId();
  const searchId = useId();

  const dropdownRef = useRef<HTMLLIElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fecha tudo ao navegar. Ajuste de estado durante o render (comparando com o
  // pathname anterior) em vez de useEffect: o React reprocessa antes de pintar,
  // sem o flash de menu aberto que um efeito causaria.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
  }

  // Escape fecha qualquer camada aberta
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setDropdownOpen(false);
      setSearchOpen(false);
      setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Clique fora fecha o dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dropdownOpen]);

  // Trava o scroll do fundo enquanto o menu mobile estiver aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    const term = typeof query === "string" ? query.trim() : "";
    if (!term) return;
    router.push(`/artigos?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  }

  const linkBase =
    "text-sm transition-colors duration-200 ease-brand hover:text-gold-400";

  // Item ativo: dourado com sublinhado fino abaixo do rótulo.
  const activeUnderline =
    "relative text-gold-400 after:absolute after:inset-x-0 after:-bottom-2 after:h-px after:bg-gold-500";

  return (
    <header className="sticky top-0 z-50 bg-primary-900">
      <div className="container-site">
        <div className="flex h-20 items-center justify-between gap-6">
          <Logo />

          {/* --- Navegação desktop --- */}
          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {mainNav.map((item) =>
                item.hasDropdown ? (
                  <li key={item.href} ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      aria-expanded={dropdownOpen}
                      aria-controls={dropdownId}
                      onClick={() => setDropdownOpen((open) => !open)}
                      className={`flex items-center gap-1.5 ${linkBase} ${
                        isActive(item.href) ? activeUnderline : "text-white"
                      }`}
                    >
                      {item.label}
                      <ChevronDownIcon
                        width={16}
                        height={16}
                        className={`transition-transform duration-200 ease-brand ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      id={dropdownId}
                      hidden={!dropdownOpen}
                      className="absolute left-1/2 top-full z-10 mt-4 w-72 -translate-x-1/2 rounded-md bg-white py-2 shadow-elevated"
                    >
                      <ul>
                        <li>
                          <Link
                            href="/areas-de-atuacao"
                            className="block px-5 py-2.5 text-sm font-semibold text-primary-900 transition-colors duration-200 ease-brand hover:bg-cream-100"
                          >
                            Todas as áreas
                          </Link>
                        </li>
                        <li aria-hidden="true" className="my-2 border-t border-border-light" />
                        {practiceAreaFallback.map((area) => (
                          <li key={area.slug}>
                            <Link
                              href={`/areas-de-atuacao/${area.slug}`}
                              className="block px-5 py-2.5 text-sm text-neutral-700 transition-colors duration-200 ease-brand hover:bg-cream-100 hover:text-primary-900"
                            >
                              {area.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`${linkBase} ${
                        isActive(item.href) ? activeUnderline : "text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* --- Ações --- */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-controls={searchId}
              aria-label={searchOpen ? "Fechar busca" : "Abrir busca"}
              className="rounded-sm p-2 text-white transition-colors duration-200 ease-brand hover:text-gold-400"
            >
              {searchOpen ? (
                <CloseIcon width={20} height={20} />
              ) : (
                <SearchIcon width={20} height={20} />
              )}
            </button>

            {/* Wrapper: `hidden` direto no Button perde para o `inline-flex` dele. */}
            <div className="hidden sm:block">
              <Button href="/contato" variant="gold-outline" onDark>
                Fale Conosco
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls={mobileId}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              className="rounded-sm p-2 text-white transition-colors duration-200 ease-brand hover:text-gold-400 lg:hidden"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* --- Busca --- */}
        <div id={searchId} hidden={!searchOpen} className="pb-5">
          <form role="search" onSubmit={handleSearch} className="flex gap-2">
            <label htmlFor="header-search" className="sr-only">
              Buscar no site
            </label>
            <input
              ref={searchInputRef}
              id="header-search"
              name="q"
              type="search"
              placeholder="Buscar artigos e conteúdo jurídico"
              className="w-full rounded-sm border border-white/25 bg-primary-800 px-4 py-3 text-sm text-white placeholder:text-white/50"
            />
            <Button onDark type="submit">
              Buscar
            </Button>
          </form>
        </div>
      </div>

      {/* --- Menu mobile (overlay) --- */}
      <div
        id={mobileId}
        hidden={!mobileOpen}
        className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-primary-900 lg:hidden"
      >
        <nav aria-label="Navegação principal (mobile)" className="container-site py-8">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block border-b border-white/10 py-4 text-body-lg ${
                    isActive(item.href) ? "text-gold-400" : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-3 text-eyebrow font-semibold uppercase text-gold-400">
            Áreas de Atuação
          </p>
          <ul className="flex flex-col gap-1">
            {practiceAreaFallback.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/areas-de-atuacao/${area.slug}`}
                  className="block py-2.5 text-sm text-white/80"
                >
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>

          <Button href="/contato" variant="gold-outline" onDark className="mt-10 w-full">
            Fale Conosco
          </Button>
        </nav>
      </div>
    </header>
  );
}
