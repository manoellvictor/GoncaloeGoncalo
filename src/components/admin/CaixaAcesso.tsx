import Image from "next/image";
import type { ReactNode } from "react";
import logoSelo from "../../../public/images/logo-selo.png";

/** Moldura das telas de acesso (entrar, esqueci a senha, nova senha). */
export function CaixaAcesso({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Image
          src={logoSelo}
          alt=""
          aria-hidden="true"
          priority
          sizes="96px"
          className="mx-auto mb-4 size-24 rounded-full bg-primary-900"
        />
        <p className="text-center font-editorial text-[1.5rem] font-medium text-primary-900">
          Gonçalo &amp; Gonçalo
        </p>
        <p className="mt-1 text-center text-eyebrow font-semibold uppercase text-gold-700">
          Painel do escritório
        </p>

        <div className="mt-8 rounded-lg border border-border-light bg-white p-6 shadow-card sm:p-8">
          <h1 className="text-[1.625rem] leading-tight">{titulo}</h1>
          {descricao ? <p className="mt-2 text-small text-neutral-700">{descricao}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
