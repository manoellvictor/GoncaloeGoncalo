import { notFound } from "next/navigation";
import Link from "next/link";
import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CheckIcon, DynamicIcon } from "@/components/ui/Icons";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, clampDescription, pageMetadata } from "@/lib/seo";
import { getPracticeAreaBySlug, getPracticeAreas } from "@/lib/supabase/queries";

/**
 * Template único das páginas de área de atuação — cobre Direito Empresarial
 * (prd.md §6.5), Direito Civil (§6.6) e as 6 demais especialidades (§6.7).
 *
 * O PRD trata 04 e 05 como páginas próprias e pede que os cards da 06 levem a
 * páginas "de estrutura análoga": uma rota dinâmica atende as 8 sem duplicar
 * layout, como manda o princípio de templates reutilizáveis (padroes §1.4).
 */

export async function generateStaticParams() {
  const areas = await getPracticeAreas();
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps<"/areas-de-atuacao/[slug]">) {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);

  if (!area) return pageMetadata({
    title: "Área não encontrada",
    description:
      "A área de atuação que você procura não está disponível. Veja todas as especialidades atendidas pelo escritório Gonçalo & Gonçalo Advogados.",
    path: `/areas-de-atuacao/${slug}`,
  });

  return pageMetadata({
    title: area.title,
    // `meta_description` é escrita pelo escritório para caber em 140–160.
    // Sem ela, compomos a partir da descrição curta e cortamos com segurança.
    description:
      area.meta_description ??
      clampDescription(
        `${area.short_description} Conheça a atuação do escritório Gonçalo & Gonçalo e fale com um especialista.`,
      ),
    path: `/areas-de-atuacao/${area.slug}`,
  });
}

export default async function PracticeAreaPage({
  params,
}: PageProps<"/areas-de-atuacao/[slug]">) {
  const { slug } = await params;
  const [area, allAreas] = await Promise.all([
    getPracticeAreaBySlug(slug),
    getPracticeAreas(),
  ]);

  if (!area) notFound();

  const related = allAreas.filter((item) => item.slug !== area.slug).slice(0, 3);

  const breadcrumbs = [
    { name: "Início", path: "/" },
    { name: "Áreas de Atuação", path: "/areas-de-atuacao" },
    { name: area.title, path: `/areas-de-atuacao/${area.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />

      <PageTitleBlock
        eyebrow="Área de Atuação"
        title={area.title}
        description={area.short_description}
        breadcrumbs={breadcrumbs}
      />

      {/* --- Posicionamento + serviços --- */}
      <section className="section-y bg-cream-100">
        <div className="container-site">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div>
              <DynamicIcon
                name={area.icon}
                width={44}
                height={44}
                className="text-gold-700"
              />

              <h2 className="mt-8 text-h2">Como atuamos</h2>
              <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

              {area.body ? (
                <p className="mt-8 texto-padrao">{area.body}</p>
              ) : null}

              {area.services.length > 0 ? (
                <>
                  <h3 className="mt-14 text-h3">O que oferecemos</h3>
                  <ul className="mt-6 flex flex-col gap-4">
                    {area.services.map((service) => (
                      <li key={service} className="flex items-start gap-3 text-neutral-700">
                        <CheckIcon
                          width={20}
                          height={20}
                          className="mt-1 shrink-0 text-gold-700"
                        />
                        {service}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            <ImageFrame
              src={area.image_url}
              alt=""
              ratio="portrait"
              className="rounded-lg lg:sticky lg:top-28"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* --- Outras áreas --- */}
      {related.length > 0 ? (
        <section className="section-y bg-white">
          <div className="container-site">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>Outras Áreas</Eyebrow>
                <h2 className="mt-4 text-h3">Também podemos ajudar em</h2>
              </div>
              <ArrowLink href="/areas-de-atuacao">Ver todas as áreas</ArrowLink>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/areas-de-atuacao/${item.slug}`}
                    className="flex items-center gap-4 rounded-md border border-border-light p-6 transition-colors duration-200 ease-brand hover:border-gold-500"
                  >
                    <DynamicIcon
                      name={item.icon}
                      width={28}
                      height={28}
                      className="shrink-0 text-gold-700"
                    />
                    <span className="font-display text-primary-900">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaBanner
        title={`Precisa de apoio em ${area.title.toLowerCase()}?`}
        description="Fale com o advogado responsável pela área e receba uma avaliação inicial do seu caso."
      />
    </>
  );
}
