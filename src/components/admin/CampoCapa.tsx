"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { enviarImagem, ErroImagem } from "./enviar-imagem";
import { ajuda, botaoSecundario, campo, erroCampo, rotulo } from "./estilos";

/**
 * Imagem de capa: envio (já redimensionado e comprimido), pré-visualização e a
 * descrição da imagem, obrigatória para publicar (acessibilidade).
 */
export function CampoCapa({
  artigoId,
  url,
  alt,
  erroUrl,
  erroAlt,
  onChange,
}: {
  artigoId: string;
  url: string | null;
  alt: string;
  erroUrl?: string;
  erroAlt?: string;
  onChange: (valores: { capa_url?: string | null; capa_alt?: string }) => void;
}) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState<string | null>(null);

  async function escolher(arquivo: File | undefined) {
    if (!arquivo) return;
    setFalha(null);
    setEnviando(true);
    try {
      onChange({ capa_url: await enviarImagem(arquivo, artigoId, "capa") });
    } catch (erro) {
      setFalha(erro instanceof ErroImagem ? erro.message : "Não foi possível enviar a imagem.");
    } finally {
      setEnviando(false);
      if (entrada.current) entrada.current.value = "";
    }
  }

  const erro = falha ?? erroUrl;

  return (
    <fieldset>
      <legend className={rotulo}>Imagem de capa</legend>
      <p className={ajuda}>Foto horizontal. Ela é ajustada automaticamente antes do envio.</p>

      <div className="mt-3 overflow-hidden rounded-md border border-border-light bg-cream-100">
        {url ? (
          <div className="relative aspect-[16/10]">
            <Image src={url} alt="" fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[16/10] items-center justify-center px-4 text-center text-small text-neutral-600">
            {enviando ? "Enviando a imagem…" : "Nenhuma imagem escolhida"}
          </div>
        )}
      </div>

      <input
        ref={entrada}
        id={`${id}-arquivo`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(evento) => escolher(evento.target.files?.[0])}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={enviando}
          onClick={() => entrada.current?.click()}
          className={botaoSecundario}
        >
          {enviando ? "Enviando…" : url ? "Trocar imagem" : "Escolher imagem"}
        </button>
        {url && !enviando ? (
          <button
            type="button"
            onClick={() => onChange({ capa_url: null })}
            className={botaoSecundario}
          >
            Remover
          </button>
        ) : null}
      </div>
      <p aria-live="polite" className={erro ? erroCampo : "sr-only"}>
        {erro ?? (enviando ? "Enviando a imagem…" : "")}
      </p>

      <div className="mt-4">
        <label htmlFor={`${id}-alt`} className={rotulo}>
          Descrição da imagem
        </label>
        <input
          id={`${id}-alt`}
          type="text"
          value={alt}
          onChange={(evento) => onChange({ capa_alt: evento.target.value })}
          aria-invalid={Boolean(erroAlt)}
          aria-describedby={`${id}-alt-ajuda`}
          placeholder="Ex.: Advogada analisa documentos em reunião com cliente"
          className={campo}
        />
        <p id={`${id}-alt-ajuda`} className={erroAlt ? erroCampo : ajuda}>
          {erroAlt ?? "Diga em poucas palavras o que aparece na foto. Ajuda quem usa leitor de tela."}
        </p>
      </div>
    </fieldset>
  );
}
