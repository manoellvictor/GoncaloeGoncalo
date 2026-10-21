import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PracticeAreaCard } from "@/components/cards/PracticeAreaCard";
import { pageMetadata } from "@/lib/seo";
import { getPracticeAreas } from "@/lib/supabase/queries";

export const metadata = pageMetadata({
  title: "Áreas de Atuação",
  description:
    "Direito tributário, cível, contratual, empresarial, administrativo e previdenciário: conheça as áreas de atuação do escritório Gonçalo & Gonçalo.",
  path: "/areas-de-atuacao",
});

/**
 * Página 06 — grade de todas as especialidades.
 *
 * Usa a variante de ícone do card (padroes §3.3). A regra de "nunca mais de 6
 * cards por grade" (§3.6) vale para os cards de ícone de valores/diferenciais;
 * aqui a grade é o índice completo das áreas, e quebrá-la em páginas
 * esconderia parte do catálogo do usuário e do buscador.
 */
export default async function AreasDeAtuacaoPage() {
  const areas = await getPracticeAreas();

  return (
    <>
      <PageTitleBlock
        eyebrow="Áreas de Atuação"
        title="Especialidades"
        description="Atuamos de forma integrada: quando um caso atravessa mais de uma área, a resposta vem de todas elas."
      />

      <section className="section-y bg-cream-100">
        <div className="container-site">
          {areas.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area) => (
                <PracticeAreaCard key={area.slug} area={area} variant="icon" />
              ))}
            </div>
          ) : (
            <p className="text-neutral-700">
              As áreas de atuação estarão disponíveis em breve.
            </p>
          )}
        </div>
      </section>

      <CtaBanner
        title="Não sabe qual área atende o seu caso?"
        description="Descreva a situação e nós indicamos o profissional certo. A avaliação inicial não tem custo."
      />
    </>
  );
}
