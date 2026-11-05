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

              <div className="mt-8 texto-padrao">
                <p>
                  O Gonçalo &amp; Gonçalo nasceu com um propósito claro — assumir a
                  condução das questões jurídicas de seus clientes para que possam
                  dedicar tempo e atenção à própria vida e aos seus negócios. Para nós,
                  isso significa compreender cada situação, definir os caminhos
                  possíveis e cuidar das providências necessárias, com
                  responsabilidade, proximidade e comunicação clara em cada etapa.
                </p>
                <p>
                  Fundado há quatro anos por duas sócias que construíram juntas sua
                  trajetória acadêmica e profissional no Direito, o escritório reúne
                  formações complementares. Após a graduação, uma das fundadoras
                  especializou-se em Direito Tributário pelo Mackenzie, e a outra em
                  Recursos e Processo Civil pelo IDP. Essa combinação sustenta uma
                  atuação técnica e estratégica, orientada pelas necessidades de cada
                  cliente.
                </p>
                <p>
                  Nossa história começou em uma sala alugada, com uma estrutura enxuta
                  e dedicação a cada caso. O crescimento da carteira de clientes e a
                  consolidação do escritório nos levaram à sede própria, em uma casa
                  cuidadosamente adaptada para receber com conforto e discrição. Um
                  espaço que traduz a proximidade e o cuidado presentes na nossa forma
                  de trabalhar.
                </p>
                <p>
                  Hoje, contamos com seis advogados especialistas, um setor
                  administrativo dedicado à gestão de cobranças para empresas e suporte
                  operacional estruturado. Essa equipe acompanha as demandas, cuida dos
                  prazos e mantém o cliente informado, oferecendo a orientação
                  necessária para que cada decisão seja tomada com clareza e segurança.
                </p>
                <p>
                  Nosso compromisso é aliviar o peso das preocupações jurídicas.
                  Assumimos a responsabilidade pela condução de cada caso, para que
                  nossos clientes tenham a tranquilidade de contar com uma equipe atenta
                  aos seus interesses e dedicada à busca de soluções.
                </p>
              </div>

              <h2 className="mt-14 text-h3">Missão</h2>
              <p className="mt-4 texto-padrao">
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
