import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { TeamProfileCard } from "@/components/cards/TeamProfileCard";
import { pageMetadata } from "@/lib/seo";
import { getTeamMembers } from "@/lib/supabase/queries";

export const metadata = pageMetadata({
  title: "Nosso Time",
  description:
    "Conheça os sócios e advogados associados do Gonçalo & Gonçalo: um time enxuto, especializado e acessível, com um responsável dedicado a cada caso.",
  path: "/equipe",
});

/** Página 02 — grade de equipe: 3 colunas desktop, 2 tablet, 1 mobile (§4). */
export default async function EquipePage() {
  const members = await getTeamMembers();

  // Grupos na ordem da página; grupo sem membros publicados não aparece.
  const groups = [
    {
      title: "Sócios",
      members: members.filter((member) => member.is_partner),
    },
    {
      title: "Advogados Associados",
      members: members.filter(
        (member) => !member.is_partner && member.department !== "administrativo",
      ),
    },
    {
      title: "Administrativo",
      members: members.filter((member) => member.department === "administrativo"),
    },
  ].filter((group) => group.members.length > 0);

  return (
    <>
      <PageTitleBlock
        eyebrow="Nosso Time"
        title="Quem vai cuidar do seu caso"
        description="Cada cliente tem um advogado responsável do começo ao fim — não um número de protocolo."
      />

      {members.length === 0 ? (
        <section className="section-y bg-cream-100">
          <div className="container-site">
            <p className="text-neutral-700">
              As informações do time estarão disponíveis em breve.
            </p>
          </div>
        </section>
      ) : (
        <section className="section-y bg-cream-100">
          <div className="container-site flex flex-col gap-20">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-h3">{group.title}</h2>
                <div aria-hidden="true" className="mt-5 h-px w-16 bg-gold-500" />
                <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map((member) =>
                    member.experience ? (
                      <TeamProfileCard key={member.id} member={member} />
                    ) : (
                      <TeamMemberCard key={member.id} member={member} />
                    ),
                  )}
                </div>
              </div>
            ))}
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
