"use client";

import { startTransition, useActionState, type FormEvent, type ReactNode } from "react";
import type { EstadoFormulario } from "@/lib/admin/acoes-acesso";
import { botaoPrimario } from "./estilos";

/**
 * Formulário das telas de acesso: envia para uma server action e mostra a
 * resposta (erro ou confirmação) logo acima do botão, anunciada a leitores de
 * tela.
 */
export function FormularioAcesso({
  acao,
  botao,
  children,
}: {
  acao: (anterior: EstadoFormulario, formulario: FormData) => Promise<EstadoFormulario>;
  botao: string;
  children: ReactNode;
}) {
  const [estado, enviar, pendente] = useActionState(acao, {});

  // Envio manual (em vez de <form action>): o React 19 limpa o formulário
  // depois de cada envio pela prop action, e quem errou a senha teria de
  // digitar o e-mail de novo.
  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    startTransition(() => enviar(dados));
  }

  return (
    <form onSubmit={aoEnviar} className="space-y-5">
      {children}

      <div aria-live="polite">
        {estado.erro ? (
          <p className="rounded-md bg-red-50 px-3.5 py-2.5 text-small font-semibold text-red-800">
            {estado.erro}
          </p>
        ) : null}
        {estado.ok ? (
          <p className="rounded-md bg-emerald-50 px-3.5 py-2.5 text-small text-emerald-900">
            {estado.ok}
          </p>
        ) : null}
      </div>

      <button type="submit" disabled={pendente} className={`${botaoPrimario} w-full`}>
        {pendente ? "Aguarde…" : botao}
      </button>
    </form>
  );
}
