import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { Azulejo } from "@/components/ui/Azulejo";
import { DynamicIcon } from "@/components/ui/Icons";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { legalServiceJsonLd } from "@/lib/seo";
import { practiceAreas } from "@/lib/site-config";
import { getArticles, getFaqs } from "@/lib/supabase/queries";
import equipe from "../../public/images/home-institucional-equipe.jpg";

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
                  No Gonçalo &amp; Gonçalo, assumimos a condução do seu caso para que
                  você possa seguir com sua rotina com mais tranquilidade. Desde a
                  primeira conversa, ouvimos suas preocupações, avaliamos os caminhos
                  possíveis e explicamos o que cada um significa para você.
                </p>
                <p>
                  Nossa equipe cuida das providências jurídicas, acompanha os prazos e
                  mantém você a par do que importa. Quando uma decisão depende de você,
                  esclarecemos as opções e orientamos os próximos passos.
                </p>
                <p>
                  Atuamos nas áreas de Direito Tributário, Cível, Contratual,
                  Empresarial, Administrativo, Trabalhista e do Agronegócio, com uma
                  estratégia definida a partir das particularidades de cada caso e das
                  prioridades de cada cliente.
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
                  src={equipe}
                  alt="Equipe do escritório Gonçalo & Gonçalo Advogados Associados: seis advogados em trajes formais, dois sentados em poltronas e quatro em pé"
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
          <div className="text-center">
            <Eyebrow>Escritório</Eyebrow>
            <h2 className={sectionTitle}>Áreas de Atuação</h2>
            <div aria-hidden="true" className="mx-auto mt-5 h-px w-16 bg-gold-500" />
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {practiceAreas.map((area) => (
              <li key={area.slug}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border-light bg-white transition-shadow duration-200 ease-brand hover:shadow-elevated">
                  <Azulejo
                    id={area.slug}
                    padrao={area.azulejo.padrao}
                    fundo={area.azulejo.fundo}
                    destaqueDourado={area.azulejo.dourado}
                    className="block h-24 w-full border-b-2 border-gold-500 sm:h-28"
                  />
                  <div className="flex flex-1 flex-col p-6">
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
                      className="mt-5 inline-flex items-center gap-1.5 text-small font-semibold text-gold-700"
                    >
                      Saiba mais
                      <span className="transition-transform duration-200 ease-brand group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </article>
              </li>
            ))}

            {/* Oitavo card: fecha a grade de 4 colunas com um ponto de contato. */}
            <li>
              <div className="flex h-full flex-col rounded-sm bg-primary-900 p-6 sm:p-7">
                <div aria-hidden="true" className="h-px w-10 bg-gold-500" />
                <h3 className="mt-5 font-editorial text-[1.75rem] font-medium leading-tight text-white">
                  Não encontrou o seu caso?
                </h3>
                <p className="mt-3 flex-1 text-small text-white/75">
                  Fale com a equipe e entenda como podemos ajudar.
                </p>
                <Link
                  href="/contato"
                  className="mt-8 inline-flex min-h-11 items-center self-start rounded-[2px] border border-white/40 px-5 text-small font-semibold text-white transition-colors duration-200 ease-brand hover:border-gold-500 hover:bg-gold-500 hover:text-primary-900"
                >
                  Agendar conversa
                </Link>
              </div>
            </li>
          </ul>

          <p className="mt-10 text-center text-[0.8125rem] text-neutral-600">
            Padrões inspirados nos azulejos do Centro Histórico de São Luís.
          </p>
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
