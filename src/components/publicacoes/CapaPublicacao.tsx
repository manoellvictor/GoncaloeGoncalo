"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CapaImagem, CapaVideo } from "@/lib/publicacoes";
import { usePausaCapas, useVideoPermitido } from "./preferencias-video";

/**
 * Capa das publicações — usada no destaque, nos cards do feed e no topo do
 * artigo.
 *
 * Com `video`: clipe curto, mudo e em repetição, puramente decorativo
 * (aria-hidden). As fontes só entram no <video> quando a capa aparece na tela
 * (IntersectionObserver), e ele pausa ao sair; até lá — e sempre que houver
 * reduced-motion, economia de dados, conexão 2G ou pausa global — fica o
 * poster. Overlay navy a 50% garante a leitura do título.
 *
 * Só com imagem (o caso do painel /admin): a foto, com sua descrição.
 *
 * Sem vídeo e sem imagem (rascunho na pré-visualização): capa tipográfica
 * (navy, título dourado, filetes), para nenhuma publicação ficar sem capa.
 */

const VARIANTES = {
  card: {
    caixa: "aspect-[16/10]",
    titulo: "text-[1.625rem] sm:text-[1.75rem]",
    respiro: "p-5 sm:p-6",
    sizes: "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
  },
  destaque: {
    caixa: "aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[22rem]",
    titulo: "text-[2rem] sm:text-[2.5rem] lg:text-[2.875rem]",
    respiro: "p-6 sm:p-8",
    sizes: "(min-width: 1024px) 640px, 100vw",
  },
  artigo: {
    caixa: "aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9]",
    titulo: "text-[2.125rem] sm:text-[2.75rem] lg:text-[3.5rem]",
    respiro: "p-6 sm:p-10",
    sizes: "(min-width: 1280px) 1120px, 100vw",
  },
} as const;

export function CapaPublicacao({
  capaTitulo,
  imagem,
  video = null,
  variante = "card",
  prioridade = false,
  className,
}: {
  /** Título curto: aparece sobre o vídeo ou na capa tipográfica. */
  capaTitulo: string;
  /** Foto de capa (e poster do vídeo, quando houver). */
  imagem: CapaImagem | null;
  video?: CapaVideo | null;
  variante?: keyof typeof VARIANTES;
  /** Poster acima da dobra (topo do artigo): carrega sem lazy-load. */
  prioridade?: boolean;
  className?: string;
}) {
  const estilo = VARIANTES[variante];
  const caixaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const permitido = useVideoPermitido();
  const pausada = usePausaCapas();
  const comVideo = Boolean(video) && permitido;

  // `vista`: a capa já entrou na tela ao menos uma vez (libera o download).
  const [vista, setVista] = useState(false);
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const caixa = caixaRef.current;
    if (!comVideo || !caixa) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNaTela(entry.isIntersecting);
        if (entry.isIntersecting) setVista(true);
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(caixa);
    return () => observer.disconnect();
  }, [comVideo]);

  const carregar = comVideo && vista && !pausada;
  const tocar = carregar && naTela;

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    if (tocar) {
      // Autoplay pode ser recusado (ex.: modo de economia de energia); o
      // poster continua visível, então a falha não precisa de tratamento.
      element.play().catch(() => {});
    } else {
      element.pause();
    }
  }, [tocar]);

  const poster = imagem?.url ?? null;

  // Só a foto: ela é a capa, com a descrição para leitores de tela e sem
  // texto por cima (o título vem logo abaixo no card).
  if (imagem && !video) {
    return (
      <div
        className={["relative overflow-hidden bg-primary-900", estilo.caixa, className]
          .filter(Boolean)
          .join(" ")}
      >
        <Image
          src={imagem.url}
          alt={imagem.alt}
          fill
          sizes={estilo.sizes}
          priority={prioridade}
          className="object-cover"
        />
      </div>
    );
  }

  const capaVisual = Boolean(video || poster);

  return (
    <div
      ref={caixaRef}
      className={[
        "relative isolate overflow-hidden bg-primary-900",
        estilo.caixa,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes={estilo.sizes}
          priority={prioridade}
          className="-z-20 object-cover"
        />
      ) : (
        <FiletesDecorativos />
      )}

      {comVideo && video ? (
        <video
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          muted
          loop
          playsInline
          preload="none"
          poster={poster ?? undefined}
          className="absolute inset-0 -z-10 size-full object-cover"
        >
          {carregar ? (
            <>
              {video.webm ? <source src={video.webm} type="video/webm" /> : null}
              <source src={video.mp4} type="video/mp4" />
            </>
          ) : null}
        </video>
      ) : null}

      {capaVisual ? (
        <div aria-hidden="true" className="absolute inset-0 -z-[5] bg-[rgba(15,27,45,0.5)]" />
      ) : null}

      {/* O título real da publicação vem logo depois; este é só visual. */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 ${estilo.respiro}`}
      >
        <div className="mb-3 h-px w-10 bg-gold-500" />
        <p
          className={[
            "max-w-[16ch] font-editorial font-semibold leading-[1.02] text-gold-400 [text-wrap:balance]",
            capaVisual ? "[text-shadow:0_1px_12px_rgba(10,21,38,0.6)]" : "",
            estilo.titulo,
          ].join(" ")}
        >
          {capaTitulo}
        </p>
      </div>
    </div>
  );
}

/** Moldura de filetes dourados da capa tipográfica. */
function FiletesDecorativos() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-20">
      <div className="absolute inset-3 border border-gold-500/25 sm:inset-4" />
      <div className="absolute right-3 top-[38%] h-px w-[38%] bg-gold-500/35 sm:right-4" />
      <div className="absolute right-[22%] top-3 h-[38%] w-px bg-gold-500/20 sm:top-4" />
    </div>
  );
}
