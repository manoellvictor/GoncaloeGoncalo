import { ImageFrame } from "@/components/ui/ImageFrame";
import type { TeamMember } from "@/lib/supabase/database.types";

/**
 * Card de Membro da Equipe (padroes-de-projeto.md §3.5).
 * Campos: foto (mesmo enquadramento para todos), nome completo, cargo.
 *
 * A foto é conteúdo informativo, então recebe alt descritivo — não `alt=""`
 * (design-system.md §10).
 */
export function TeamMemberCard({
  member,
}: {
  member: Pick<TeamMember, "name" | "role" | "photo_url" | "bio">;
}) {
  return (
    <article className="group">
      <ImageFrame
        src={member.photo_url}
        alt={`Retrato de ${member.name}, ${member.role}`}
        ratio="portrait"
        sizes="(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
        className="rounded-md"
      />

      <div className="mt-5">
        <h3 className="text-h3">{member.name}</h3>
        <p className="mt-1 text-small font-semibold uppercase tracking-[0.1em] text-gold-700">
          {member.role}
        </p>
        {member.bio ? (
          <p className="mt-3 text-neutral-700">{member.bio}</p>
        ) : null}
      </div>
    </article>
  );
}
