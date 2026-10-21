"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  initialContactState,
  submitContactForm,
  type ContactFormState,
} from "@/app/contato/actions";
import { AlertIcon, CheckIcon } from "./Icons";

/**
 * Formulário de Contato (padroes-de-projeto.md §3.9).
 *
 * Ordem fixa dos campos: Nome → E-mail → Telefone → Empresa (opcional) →
 * Mensagem. Opcionais sinalizados explicitamente. Botão com verbo de ação.
 * Cobre os 4 estados exigidos: vazio, preenchendo, erro de validação e sucesso.
 *
 * Acessibilidade (padroes §7): o erro nunca é comunicado só por cor — traz
 * ícone e texto —, os campos usam `aria-invalid`/`aria-describedby`, e o
 * resumo é um live region para o leitor de tela anunciar sem mover o foco.
 */

const inputBase =
  "w-full rounded-sm border bg-white px-4 py-3 text-body text-primary-900 " +
  "transition-colors duration-200 ease-brand placeholder:text-neutral-500";

function Field({
  id,
  label,
  optional = false,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-small font-semibold text-primary-900">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-neutral-600">(opcional)</span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-start gap-1.5 text-small text-[#B3261E]"
        >
          <AlertIcon width={16} height={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    initialContactState,
  );

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  function inputClasses(field: keyof typeof errors) {
    return [
      inputBase,
      errors[field] ? "border-[#B3261E]" : "border-border-light",
    ].join(" ");
  }

  function a11y(field: keyof typeof errors) {
    return {
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `${field}-error` : undefined,
    };
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-md border border-border-light bg-white p-10 text-center shadow-card"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-500 text-primary-900">
          <CheckIcon width={28} height={28} />
        </span>
        <h3 className="mt-6 text-h3">Mensagem enviada</h3>
        <p className="mt-3 text-neutral-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {/* Resumo de erro — anunciado por leitores de tela sem roubar o foco */}
      <div aria-live="polite">
        {state.status === "error" && state.message ? (
          <p className="flex items-start gap-2 rounded-sm border border-[#B3261E] bg-[#FDF2F1] px-4 py-3 text-small text-[#B3261E]">
            <AlertIcon width={18} height={18} className="mt-0.5 shrink-0" />
            {state.message}
          </p>
        ) : null}
      </div>

      <Field id="name" label="Nome completo" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={values.name}
          className={inputClasses("name")}
          {...a11y("name")}
        />
      </Field>

      <Field id="email" label="E-mail" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={values.email}
          className={inputClasses("email")}
          {...a11y("email")}
        />
      </Field>

      <Field id="phone" label="Telefone" error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(98) 99999-9999"
          defaultValue={values.phone}
          className={inputClasses("phone")}
          {...a11y("phone")}
        />
      </Field>

      <Field id="company" label="Empresa" optional error={errors.company}>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          defaultValue={values.company}
          className={inputClasses("company")}
          {...a11y("company")}
        />
      </Field>

      <Field id="message" label="Mensagem" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          defaultValue={values.message}
          placeholder="Descreva brevemente sua necessidade."
          className={`${inputClasses("message")} resize-y`}
          {...a11y("message")}
        />
      </Field>

      {/* Consentimento LGPD (prd.md §6.10) */}
      <div>
        <div className="flex items-start gap-3">
          <input
            id="lgpdConsent"
            name="lgpdConsent"
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[#856814]"
            aria-invalid={errors.lgpdConsent ? true : undefined}
            aria-describedby={errors.lgpdConsent ? "lgpdConsent-error" : undefined}
          />
          <label htmlFor="lgpdConsent" className="text-small text-neutral-700">
            Autorizo o tratamento dos meus dados pessoais para que o escritório
            responda a este contato, conforme a{" "}
            <Link href="/politicas#privacidade" className="text-gold-700 underline">
              Política de Privacidade
            </Link>
            .
          </label>
        </div>

        {errors.lgpdConsent ? (
          <p
            id="lgpdConsent-error"
            className="mt-2 flex items-start gap-1.5 text-small text-[#B3261E]"
          >
            <AlertIcon width={16} height={16} className="mt-0.5 shrink-0" />
            {errors.lgpdConsent}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-8 py-3.5 text-sm font-semibold tracking-wide text-primary-900 transition-colors duration-200 ease-brand hover:bg-gold-700 hover:text-white disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? "Enviando…" : "Enviar Mensagem"}
      </button>
    </form>
  );
}
