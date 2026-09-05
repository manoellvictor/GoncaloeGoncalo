import { HeroSection } from "@/components/sections/HeroSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeading, Eyebrow } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { DynamicIcon } from "@/components/ui/Icons";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PracticeAreaCard } from "@/components/cards/PracticeAreaCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { IconFeatureCard } from "@/components/cards/IconFeatureCard";
import { JsonLd } from "@/components/JsonLd";
import { legalServiceJsonLd } from "@/lib/seo";
import {
  getArticles,
  getFaqs,
  getFeaturedPracticeAreas,
} from "@/lib/supabase/queries";

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

/** Faixa final de diferenciais (prd.md §6.1). */
const DIFFERENTIATORS = [
  { icon: "sparkle", title: "Design Sofisticado" },
  { icon: "award", title: "Experiência Consolidada" },
  { icon: "compass", title: "Navegação Intuitiva" },
  { icon: "trending-up", title: "Foco em Resultados" },
];

export default async function HomePage() {
  const [areas, articles, faqs] = await Promise.all([
    getFeaturedPracticeAreas(),
    getArticles({ limit: 3 }),
    getFaqs({ featuredOnly: true }),
  ]);

  return (
    <>
      <JsonLd data={legalServiceJsonLd()} />

      <HeroSection />

      {/* --- Institucional resumido --- */}
      <section className="section-y bg-cream-100">
        <div className="container-site">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <Eyebrow>Quem Somos</Eyebrow>
              <h2 className="mt-4 text-h2">
                Tradição jurídica com a leitura de quem vive o presente
              </h2>
              <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

              <p className="mt-8 text-body-lg text-neutral-700">
                Somos um escritório boutique: atendemos menos clientes para
                atender melhor cada um. Essa escolha nos permite conhecer a fundo
                o negócio e a história de quem nos procura — e é dela que nasce a
                estratégia jurídica.
              </p>

              <blockquote className="mt-10 border-l-2 border-gold-500 pl-6">
                <p className="font-display text-h3 text-primary-900">
                  &ldquo;Mais que Direito. Resultados Duradouros.&rdquo;
                </p>
              </blockquote>

              <div className="mt-10">
                <Button href="/quem-somos" variant="outline">
                  Conheça Nossa História
                </Button>
              </div>
            </div>

            <ImageFrame
              src={null}
              alt=""
              ratio="landscape"
              className="rounded-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* --- Faixa de valores --- */}
      <section className="section-y bg-primary-900">
        <div className="container-site">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <IconFeatureCard key={value.title} {...value} onDark />
            ))}
          </div>
        </div>
      </section>

      {/* --- Áreas de Atuação --- */}
      {areas.length > 0 ? (
        <section className="section-y bg-cream-100">
          <div className="container-site">
            <SectionHeading
              eyebrow="Áreas de Atuação"
              title="Especialidades que sustentam decisões"
              action={<ArrowLink href="/areas-de-atuacao">Ver todas as áreas</ArrowLink>}
            />

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {areas.map((area) => (
                <PracticeAreaCard key={area.slug} area={area} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* --- Conteúdo Jurídico + FAQ --- */}
      <section className="section-y bg-white">
        <div className="container-site">
          <div className="grid gap-16 lg:grid-cols-[2fr_1fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Conteúdo Jurídico"
                title="Artigos recentes"
                action={<ArrowLink href="/artigos">Ver todos os artigos</ArrowLink>}
              />

              {articles.length > 0 ? (
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              ) : (
                <p className="mt-12 text-neutral-700">
                  Nenhum artigo publicado no momento.
                </p>
              )}
            </div>

            {/* Bloco lateral de Perguntas Frequentes */}
            <aside>
              <Eyebrow>Dúvidas Frequentes</Eyebrow>
              <h2 className="mt-4 text-h3">Perguntas que mais recebemos</h2>
              <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

              <div className="mt-6">
                <FaqAccordion
                  items={faqs.map((faq) => ({
                    id: faq.id,
                    question: faq.question,
                    answer: faq.answer,
                  }))}
                />
              </div>

              <ArrowLink href="/perguntas-frequentes" className="mt-8">
                Ver todas as perguntas
              </ArrowLink>
            </aside>
          </div>
        </div>
      </section>

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
