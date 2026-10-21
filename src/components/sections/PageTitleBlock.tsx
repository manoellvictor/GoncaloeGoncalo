import Link from "next/link";

/**
 * Bloco de Título de Página — páginas 01 a 11 (padroes-de-projeto.md §3.2).
 *
 * Eyebrow + H1 + parágrafo de apoio opcional, com altura reduzida em relação
 * ao hero da home, que não deve ser reutilizado aqui.
 *
 * Migalhas opcionais: recomendadas em áreas de atuação e artigos individuais
 * para SEO e orientação do usuário (padroes §4).
 */
export function PageTitleBlock({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs?: { name: string; path: string }[];
}) {
  return (
    <section className="bg-primary-900">
      <div className="container-site py-16 lg:py-20">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Migalhas de pão" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-small text-white/60">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={crumb.path} className="flex items-center gap-2">
                    {index > 0 ? (
                      <span aria-hidden="true" className="text-white/30">
                        /
                      </span>
                    ) : null}
                    {isLast ? (
                      <span aria-current="page" className="text-gold-400">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.path}
                        className="transition-colors duration-200 ease-brand hover:text-gold-400"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <p className="text-eyebrow font-semibold uppercase text-gold-400">
          {eyebrow}
        </p>

        <h1 className="mt-4 text-h2 text-white">{title}</h1>

        <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

        {description ? (
          <p className="mt-6 max-w-2xl text-body-lg text-white/80">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
