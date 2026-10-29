import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { DynamicIcon } from "@/components/ui/Icons";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { legalServiceJsonLd } from "@/lib/seo";
import { practiceAreas } from "@/lib/site-config";
import { getArticles, getFaqs } from "@/lib/supabase/queries";
import escritorio from "../../public/images/home-institucional-escritorio.jpg";

/** Faixa de valores sobre navy (prd.md §6.1). */
const VALUES = [
  {
    icon: "diamond",
    title: "Excelência Técnica",
    description: "Pareceres fundamentados e teses sustentadas em pesquisa própria.",
  },
  {
    icon: "users",
    title: "Atendimento Personalizado",
    description: "Cada cliente acompanhado diretamente por um advogado responsável.",
  },
  {
    icon: "target",
    title: "Atuação Estratégica",
    description: "Decisões orientadas pelo resultado do cliente, não pelo litígio.",
  },
  {
    icon: "scale",
    title: "Ética e Transparência",
    description: "Custos, prazos e riscos comunicados com clareza desde o início.",
  },
];

/** Título de seção da home: borda dourada à esquerda + eyebrow + serifada. */
const sectionTitle =
  "mt-3 font-editorial text-[clamp(2rem,3.6vw,2.75rem)] font-medium leading-[1.1] text-primary-900";

/** Faixa final de diferenciais (prd.md §6.1). */
const DIFFERENTIATORS = [
  { icon: "sparkle", title: "Design Sofisticado" },
  { icon: "award", title: "Experiência Consolidada" },
  { icon: "compass", title: "Navegação Intuitiva" },
  { icon: "trending-up", title: "Foco em Resultados" },
];

export default async function HomePage() {
  const [articles, faqs] = await Promise.all([
    getArticles({ limit: 3 }),
    getFaqs({ featuredOnly: true }),
  ]);

  const featuredFaqs = faqs.slice(0, 4);
  const hasArticles = articles.length > 0;
  const hasFaqs = featuredFaqs.length > 0;

  return (
    <>
      <JsonLd data={legalServiceJsonLd()} />

      <HeroSection />

      {/* --- Quem Somos --- */}
      <section className="section-y bg-cream-100">
        <div className="container-site">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="border-l border-gold-500 pl-8 lg:pl-10">
              <Eyebrow>Quem Somos</Eyebrow>
              <h2 className="mt-3 font-editorial text-[clamp(1.625rem,2.5vw,2.125rem)] font-medium uppercase leading-[1.15] tracking-[0.03em] text-primary-900 sm:[&>span]:whitespace-nowrap">
                <span className="block">Gonçalo &amp; Gonçalo</span>
                <span className="block">Advogados Associados</span>
              </h2>

              <div className="mt-8 texto-padrao">
                <p>
                  O Gonçalo &amp; Gonçalo é um escritório de advocacia que existe para
                  tirar o problema das mãos do cliente. Atuamos em Direito Tributário,
                  Cível, Contratual, Empresarial, Administrativo, Trabalhista e do
                  Agronegócio, com soluções jurídicas estratégicas e personalizadas.
                </p>
                <p>
                  Nosso diferencial é a atuação técnica e presencial junto ao Tribunal
                  de Justiça do Maranhão (TJMA) e ao Tribunal Regional Federal (TRF).
                  Temos ampla experiência em despachos com desembargadores e
                  interlocução qualificada com os gabinetes. Essa proximidade nos
                  permite antecipar riscos, agir com agilidade e aumentar as chances
                  de êxito.
                </p>
              </div>

              <div className="mt-10">
                <Button href="/quem-somos" variant="gold-outline" arrow>
                  Conheça nossa história
                </Button>
              </div>
            </div>

            <figure className="relative pb-28 sm:pb-16">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src={escritorio}
                  alt="Sala de espera do escritório, com sofá verde, poltronas de couro e painéis de madeira"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <blockquote className="absolute bottom-0 left-4 right-4 bg-primary-900 p-7 sm:left-auto sm:right-8 sm:w-[22rem] lg:-left-10 lg:right-auto">
                <p className="font-editorial text-[1.375rem] italic leading-snug text-gold-400">
                  &ldquo;Direito é mais que norma. É a base para um futuro mais
                  seguro.&rdquo;
                </p>
                <span aria-hidden="true" className="mt-5 block h-px w-10 bg-gold-500" />
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      {/* --- Faixa de valores --- */}
      <section className="bg-primary-900 py-16 lg:py-20">
        <div className="container-site">
          <ul className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/15">
            {VALUES.map((value) => (
              <li key={value.title} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <DynamicIcon
                  name={value.icon}
                  width={34}
                  height={34}
                  className="text-gold-500"
                />
                <h3 className="mt-6 font-editorial text-[1.5rem] font-medium leading-tight text-white">
                  {value.title}
                </h3>
                <p className="mt-3 text-small text-white/65">{value.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Áreas de Atuação --- */}
      <section className="section-y bg-cream-100">
        <div className="container-site">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="border-l border-gold-500 pl-8">
              <Eyebrow>Áreas de Atuação</Eyebrow>
              <h2 className={sectionTitle}>Soluções jurídicas para cada desafio.</h2>
            </div>
            <ArrowLink
              href="/areas-de-atuacao"
              className="shrink-0 text-xs uppercase tracking-[0.16em]"
            >
              Ver todas as áreas
            </ArrowLink>
          </div>

          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area) => (
              <li key={area.slug}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border-light bg-white transition-shadow duration-200 ease-brand hover:shadow-elevated">
                  <ImageFrame
                    src={null}
                    alt=""
                    ratio="landscape"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-editorial text-[1.5rem] font-medium leading-tight text-primary-900">
                      <Link
                        href={`/areas-de-atuacao/${area.slug}`}
                        className="after:absolute after:inset-0"
                      >
                        {area.title}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-small text-neutral-600">
                      {area.shortDescription}
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-5 text-gold-700 transition-transform duration-200 ease-brand group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Conteúdo Jurídico + FAQ ---
          Só aparece com conteúdo publicado: sem artigos, o FAQ ocupa a largura;
          sem nenhum dos dois, a seção inteira some. */}
      {hasArticles || hasFaqs ? (
        <section className="section-y bg-white">
          <div className="container-site">
            <div
              className={
                hasArticles && hasFaqs ? "grid gap-16 lg:grid-cols-[2fr_1fr]" : "grid"
              }
            >
              {hasArticles ? (
                <div>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="border-l border-gold-500 pl-8">
                      <Eyebrow>Conteúdo Jurídico</Eyebrow>
                      <h2 className={sectionTitle}>Artigos recentes</h2>
                    </div>
                    <ArrowLink
                      href="/artigos"
                      className="shrink-0 text-xs uppercase tracking-[0.16em]"
                    >
                      Ver todos os artigos
                    </ArrowLink>
                  </div>

                  <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                      <ArticleCard key={article.slug} article={article} compact />
                    ))}
                  </div>
                </div>
              ) : null}

              {hasFaqs ? (
                <aside className={hasArticles ? "" : "mx-auto w-full max-w-3xl"}>
                  <Eyebrow>Perguntas Frequentes</Eyebrow>
                  <div aria-hidden="true" className="mt-4 h-px w-10 bg-gold-500" />

                  <div className="mt-4">
                    <FaqAccordion
                      items={featuredFaqs.map((faq) => ({
                        id: faq.id,
                        question: faq.question,
                        answer: faq.answer,
                      }))}
                    />
                  </div>

                  <Button
                    href="/perguntas-frequentes"
                    variant="gold-outline"
                    arrow
                    className="mt-8"
                  >
                    Ver todas as perguntas
                  </Button>
                </aside>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner />

      {/* --- Faixa final de diferenciais --- */}
      <section className="border-t border-border-light bg-cream-100 py-14">
        <div className="container-site">
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map((item) => (
              <li key={item.title} className="flex items-center gap-4">
                <DynamicIcon
                  name={item.icon}
                  width={28}
                  height={28}
                  className="shrink-0 text-gold-700"
                />
                <span className="text-small font-semibold uppercase tracking-[0.1em] text-primary-900">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
