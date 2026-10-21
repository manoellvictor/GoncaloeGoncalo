import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IconFeatureCard } from "@/components/cards/IconFeatureCard";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Estrutura do Escritório",
  description:
    "Infraestrutura moderna, tecnologia aplicada à advocacia e protocolos de confidencialidade: conheça o ambiente que sustenta o trabalho da nossa equipe.",
  path: "/estrutura",
});

/** Diferenciais de infraestrutura (prd.md §6.4). */
const FEATURES = [
  {
    icon: "building",
    title: "Infraestrutura moderna",
    description:
      "Salas de reunião reservadas e ambiente pensado para conversas que exigem privacidade.",
  },
  {
    icon: "cpu",
    title: "Tecnologia e inovação",
    description:
      "Gestão processual digital com acompanhamento de prazos e movimentações em tempo real.",
  },
  {
    icon: "shield-lock",
    title: "Segurança e confidencialidade",
    description:
      "Controle de acesso a documentos e protocolos de sigilo aplicados a toda a equipe.",
  },
  {
    icon: "users",
    title: "Ambiente colaborativo",
    description:
      "Casos complexos discutidos entre áreas, somando visões em vez de isolá-las.",
  },
];

export default function EstruturaPage() {
  return (
    <>
      <PageTitleBlock
        eyebrow="Nossa Estrutura"
        title="Estrutura do Escritório"
        description="Um ambiente construído para sustentar trabalho técnico de alto nível — e para receber bem quem chega até nós."
      />

      <section className="section-y bg-cream-100">
        <div className="container-site">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <ImageFrame
              src="/images/estrutura-ambiente-recepcao.jpg"
              alt="Recepção do escritório, com painel de madeira, a marca Gonçalo & Gonçalo e o balcão de mármore"
              ratio="landscape"
              className="rounded-lg"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />

            <div>
              <Eyebrow>O Ambiente</Eyebrow>
              <h2 className="mt-4 text-h2">
                Um espaço à altura das decisões que se tomam nele
              </h2>
              <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

              <div className="mt-8 flex flex-col gap-6 text-body-lg text-neutral-700">
                <p>
                  Nossa sede foi projetada para dois propósitos que raramente
                  convivem: concentração para o trabalho técnico e acolhimento
                  para quem chega trazendo um problema difícil.
                </p>
                <p>
                  Investimos continuamente em tecnologia de gestão processual e
                  em protocolos de segurança da informação, porque a
                  confidencialidade do cliente não é um diferencial — é a base do
                  que fazemos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-site">
          <h2 className="sr-only">Diferenciais de infraestrutura</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <IconFeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Venha nos conhecer pessoalmente"
        description="Agende uma visita ao escritório e converse com a equipe que vai acompanhar o seu caso."
      />
    </>
  );
}
