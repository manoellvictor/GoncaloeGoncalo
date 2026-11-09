"use client";

import { useId, useRef, useState } from "react";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";
import type { TeamMember } from "@/lib/supabase/database.types";

/** Duração das transições do card e do painel (ms). */
const TRANSITION_MS = 250;

type ProfileMember = Pick<
  TeamMember,
  | "name"
  | "role"
  | "photo_url"
  | "full_name"
  | "oab"
  | "profile_title"
  | "practice_areas"
  | "education"
  | "experience"
>;

/** "A, B e C." — lista em português, terminada em ponto. */
function joinAreas(areas: string[]) {
  return `${new Intl.ListFormat("pt-BR", { type: "conjunction" }).format(areas)}.`;
}

/**
 * Card de membro da equipe com perfil completo (variante do TeamMemberCard).
 * Usado quando o integrante tem `experience` preenchido no banco.
 *
 * Ao passar o mouse (ou focar pelo teclado), a foto aproxima levemente, ganha
 * borda dourada e um degradê navy na parte de baixo com as áreas, a OAB e o
 * botão "Conheça o perfil". Em telas sem hover (celular) esse bloco fica
 * sempre visível. O botão abre um painel lateral em <dialog> modal: Esc e o
 * clique fora fecham, e o foco volta ao botão.
 */
export function TeamProfileCard({ member }: { member: ProfileMember }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const titleId = useId();

  const areas = member.practice_areas;
  const subtitle = [member.profile_title, member.oab].filter(Boolean).join(" • ");

  function open() {
    dialogRef.current?.showModal();
    // Sem isso o navegador pode focar a área rolável do painel (no celular).
    closeRef.current?.focus();
    // Um frame depois, para a transição partir do estado fechado.
    requestAnimationFrame(() => setVisible(true));
  }

  function close() {
    setVisible(false);
    window.setTimeout(() => {
      dialogRef.current?.close();
      triggerRef.current?.focus();
    }, TRANSITION_MS);
  }

  return (
    <article className="group">
      <div className="relative rounded-md ring-1 ring-transparent transition-shadow duration-250 ease-brand group-hover:ring-gold-500 group-focus-within:ring-gold-500">
        <ImageFrame
          src={member.photo_url}
          alt={`Retrato de ${member.name}, ${member.role}`}
          ratio="portrait"
          sizes="(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
          className="rounded-md [&_img]:transition-transform [&_img]:duration-250 [&_img]:ease-brand group-hover:[&_img]:scale-[1.04]"
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start rounded-b-md bg-gradient-to-t from-primary-900/95 via-primary-900/75 to-transparent px-6 pb-6 pt-24 transition-opacity duration-250 ease-brand [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
          {areas.length > 0 ? (
            <ul className="font-editorial text-[1.3125rem] leading-snug text-white">
              {areas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          ) : null}
          {member.oab ? (
            <p className="mt-2 text-xs tracking-[0.12em] text-white/80">{member.oab}</p>
          ) : null}
          <button
            ref={triggerRef}
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-sm bg-gold-500 px-5 text-sm font-semibold text-primary-900 transition-colors duration-250 ease-brand hover:bg-gold-400"
          >
            Conheça o perfil
            <ArrowRightIcon width={16} height={16} className="shrink-0" />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-h3">{member.name}</h3>
        <p className="mt-1 text-small font-semibold uppercase tracking-[0.1em] text-gold-700">
          {member.role}
        </p>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={(event) => {
          // Esc: anima o fechamento em vez de fechar de imediato.
          event.preventDefault();
          close();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-transparent"
      >
        <div
          aria-hidden="true"
          onClick={close}
          className={`absolute inset-0 bg-primary-900/50 transition-opacity duration-250 ease-brand ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-white shadow-elevated transition-transform duration-250 ease-brand ${
            visible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Fechar perfil"
            className="absolute right-4 top-4 rounded-sm p-2 text-primary-900 transition-colors duration-250 ease-brand hover:text-gold-700"
          >
            <CloseIcon width={24} height={24} />
          </button>

          <div className="px-7 pb-10 pt-14 sm:px-9">
            <h2
              id={titleId}
              className="pr-8 font-display text-[1.75rem] leading-tight text-primary-900"
            >
              {member.full_name ?? member.name}
            </h2>
            {subtitle ? (
              <p className="mt-2 text-sm font-semibold tracking-[0.06em] text-gold-700">
                {subtitle}
              </p>
            ) : null}
            <div aria-hidden="true" className="mt-6 h-px bg-gold-500" />

            <div className="mt-8 flex items-start gap-6">
              <ImageFrame
                src={member.photo_url}
                alt=""
                ratio="portrait"
                sizes="128px"
                className="w-28 shrink-0 rounded-md sm:w-32"
              />
              {areas.length > 0 ? (
                <section>
                  <h3 className="font-display text-[1.25rem] text-primary-900">Atuação</h3>
                  <p className="mt-2 text-neutral-700">{joinAreas(areas)}</p>
                </section>
              ) : null}
            </div>

            {member.education.length > 0 ? (
              <section className="mt-8">
                <h3 className="font-display text-[1.25rem] text-primary-900">Formação</h3>
                <div className="mt-2 flex flex-col gap-3 text-neutral-700">
                  {member.education.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </section>
            ) : null}

            {member.experience ? (
              <section className="mt-8">
                <h3 className="font-display text-[1.25rem] text-primary-900">Experiência</h3>
                <p className="mt-2 text-neutral-700">{member.experience}</p>
              </section>
            ) : null}
          </div>
        </div>
      </dialog>
    </article>
  );
}
