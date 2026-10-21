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

/** Valores do escritório. */
const VALUES = [
  {
    title: "Velocidade e ação",
    text: "Entre planejar e fazer, fazemos. Demanda recebida é demanda iniciada.",
  },
  {
    title: "Sem procrastinar",
    text: "O que pode ser feito hoje não fica para amanhã. Prazo interno vence antes do prazo legal.",
  },
  {
    title: "Proatividade",
    text: "Agimos antes de sermos cobrados, seja pelo cliente, pelo sócio ou pelo tribunal.",
  },
  {
    title: "Cultura dos fazedores",
    text: "Sábio não é quem sabe, é quem faz. Valorizamos quem entrega.",
  },
  {
    title: "Ética, excelência e integridade",
    text: "O resultado só vale se for alcançado do jeito certo.",
  },
];

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
              <h2 className="mt-4 text-h2">Visão estratégica para decisões importantes</h2>
              <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

              <div className="mt-8 flex flex-col gap-6 text-body-lg text-neutral-700">
                <p>
                  O Gonçalo &amp; Gonçalo é um escritório de advocacia que existe para
                  tirar o problema das mãos do cliente. Atuamos em Direito Tributário,
                  Cível, Contratual, Empresarial, Administrativo e Previdenciário, com
                  soluções jurídicas estratégicas e personalizadas.
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

              <h2 className="mt-14 text-h3">Missão</h2>
              <p className="mt-4 text-neutral-700">
                Transformar complexidade jurídica em decisões claras, oferecendo
                a cada cliente a segurança de saber exatamente onde está e quais
                são os caminhos possíveis.
              </p>

              <h2 className="mt-10 text-h3">Valores</h2>
              <ol className="mt-6 flex flex-col gap-5 text-neutral-700">
                {VALUES.map((value, index) => (
                  <li key={value.title} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 font-editorial text-[1.25rem] leading-none text-gold-700"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p>
                      <strong className="font-semibold text-primary-900">
                        {value.title}
                      </strong>{" "}
                      — {value.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <ImageFrame
              src="/images/quem-somos-historia-equipe.jpg"
              alt="Equipe do escritório Gonçalo & Gonçalo Advogados Associados"
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
