import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";

/**
 * Hero — exclusivo da Homepage (padroes-de-projeto.md §3.1).
 * Páginas internas usam PageTitleBlock, mais compacto, para não competir com ele.
 *
 * Estrutura: H1 + subheadline + CTA primário + tags de posicionamento, sobre
 * imagem com overlay navy obrigatório para legibilidade do texto sobreposto.
 */
const POSITIONING_TAGS = ["Tradição", "Estratégia", "Confiança", "Resultados"];

export function HeroSection({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <section className="relative isolate bg-primary-900">
      {/* Imagem de fundo com overlay (design-system.md §6) */}
      <div className="absolute inset-0 -z-10">
        <ImageFrame
          src={imageUrl}
          alt=""
          ratio="wide"
          overlay
          priority
          sizes="100vw"
          className="size-full"
        />
      </div>

      <div className="container-site">
        <div className="flex min-h-[560px] max-w-3xl flex-col justify-center py-24 lg:min-h-[640px] lg:py-32">
          <p className="text-eyebrow font-semibold uppercase text-gold-300">
            Gonçalo &amp; Gonçalo Advogados Associados
          </p>

          <h1 className="mt-6 text-display uppercase text-white">
            Soluções jurídicas com estratégia, ética e resultados.
          </h1>

          <p className="mt-8 max-w-xl text-body-lg text-white/80">
            Um escritório boutique que une a solidez da tradição jurídica à
            clareza de quem trabalha para resolver — não apenas para litigar.
          </p>

          <div className="mt-10">
            <Button href="/contato" onDark>
              Fale com um especialista
            </Button>
          </div>

          <ul className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-3">
            {POSITIONING_TAGS.map((tag, index) => (
              <li key={tag} className="flex items-center gap-4">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-gold-500">
                    •
                  </span>
                ) : null}
                <span className="text-eyebrow font-semibold uppercase text-gold-300">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
