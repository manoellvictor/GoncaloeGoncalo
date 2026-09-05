import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { pageMetadata } from "@/lib/seo";
import { getTeamMembers } from "@/lib/supabase/queries";

export const metadata = pageMetadata({
  title: "Equipe",
  description:
    "Conheça os sócios e advogados associados do Gonçalo & Gonçalo: uma equipe enxuta, especializada e acessível, com um responsável dedicado a cada caso.",
  path: "/equipe",
});

/** Página 02 — grade de equipe: 3 colunas desktop, 2 tablet, 1 mobile (§4). */
export default async function EquipePage() {
  const members = await getTeamMembers();

  const partners = members.filter((member) => member.is_partner);
  const associates = members.filter((member) => !member.is_partner);

  return (
    <>
      <PageTitleBlock
        eyebrow="Nossa Equipe"
        title="Quem vai cuidar do seu caso"
        description="Cada cliente tem um advogado responsável do começo ao fim — não um número de protocolo."
      />

      {members.length === 0 ? (
        <section className="section-y bg-cream-100">
          <div className="container-site">
            <p className="text-neutral-700">
              As informações da equipe estarão disponíveis em breve.
            </p>
          </div>
        </section>
      ) : (
        <section className="section-y bg-cream-100">
          <div className="container-site flex flex-col gap-20">
            {partners.length > 0 ? (
              <div>
                <h2 className="text-h3">Sócios</h2>
                <div aria-hidden="true" className="mt-5 h-px w-16 bg-gold-500" />
                <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {partners.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            ) : null}

            {associates.length > 0 ? (
              <div>
                <h2 className="text-h3">Advogados Associados</h2>
                <div aria-hidden="true" className="mt-5 h-px w-16 bg-gold-500" />
                <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {associates.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      <CtaBanner
        title="Fale diretamente com um dos nossos advogados"
        description="Encaminhamos seu contato para o profissional da área mais adequada ao seu caso."
      />
    </>
  );
}
