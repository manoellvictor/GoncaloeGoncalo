import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { StatCard } from "@/components/cards/StatCard";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Quem Somos",
  description:
    "Conheça a história, os valores e os números do escritório Gonçalo & Gonçalo: advocacia boutique com atendimento próximo e foco em resultados duradouros.",
  path: "/quem-somos",
});

/** Indicadores de credibilidade (prd.md §6.2). Valores placeholder. */
const STATS = [
  { value: "+20", label: "Anos de experiência" },
  { value: "+500", label: "Clientes atendidos" },
  { value: "98%", label: "Índice de satisfação" },
  { value: "★", label: "Excelência reconhecida" },
];

export default function QuemSomosPage() {
  return (
    <>
      <PageTitleBlock
        eyebrow="Quem Somos"
        title="Mais que Direito. Resultados Duradouros."
        description="Um escritório construído sobre a convicção de que a melhor advocacia é aquela que evita o problema antes de precisar resolvê-lo."
      />

      {/* --- História --- */}
      <section className="section-y bg-cream-100">
        <div className="container-site">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div>
              <Eyebrow>Nossa História</Eyebrow>
              <h2 className="mt-4 text-h2">Duas décadas ao lado de quem decide</h2>
              <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

              <div className="mt-8 flex flex-col gap-6 text-body-lg text-neutral-700">
                <p>
                  O Gonçalo &amp; Gonçalo nasceu da união entre a experiência de
                  quem construiu carreira no contencioso tradicional e a visão de
                  quem entende o ritmo dos negócios contemporâneos. Dessa
                  combinação surgiu um escritório que fala a língua do cliente
                  sem abrir mão do rigor técnico.
                </p>
                <p>
                  Ao longo de mais de vinte anos, acompanhamos empresas em
                  momentos decisivos — reestruturações, sucessões, disputas que
                  definiriam o futuro do negócio — e famílias em questões que
                  exigem tanto competência quanto discrição.
                </p>
              </div>

              <h2 className="mt-14 text-h3">Missão</h2>
              <p className="mt-4 text-neutral-700">
                Transformar complexidade jurídica em decisões claras, oferecendo
                a cada cliente a segurança de saber exatamente onde está e quais
                são os caminhos possíveis.
              </p>

              <h2 className="mt-10 text-h3">Valores</h2>
              <ul className="mt-4 flex flex-col gap-3 text-neutral-700">
                {[
                  "Excelência técnica em cada parecer e cada peça.",
                  "Transparência sobre custos, prazos e riscos desde o primeiro contato.",
                  "Discrição absoluta no tratamento das informações do cliente.",
                  "Compromisso com o resultado, não com o volume de processos.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <ImageFrame
              src={null}
              alt=""
              ratio="portrait"
              className="rounded-lg lg:sticky lg:top-28"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* --- Indicadores --- */}
      <section className="bg-primary-900 py-16 lg:py-20">
        <div className="container-site">
          <h2 className="sr-only">Indicadores do escritório</h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} onDark />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
