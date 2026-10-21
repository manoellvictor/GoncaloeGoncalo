import Image from "next/image";
import { Button } from "@/components/ui/Button";
import heroRecepcao from "../../../public/images/home-hero-recepcao.jpg";

/**
 * Hero — exclusivo da Homepage (padroes-de-projeto.md §3.1).
 * Páginas internas usam PageTitleBlock, mais compacto, para não competir com ele.
 *
 * Estrutura: H1 + subheadline + CTA primário + tags de posicionamento, sobre
 * imagem com overlay navy obrigatório para legibilidade do texto sobreposto.
 *
 * Fundo: recepção do escritório, já recortada (parede, marca e balcão) e
 * dessaturada no arquivo. No desktop a foto ocupa a direita e o degradê navy
 * vai de opaco à esquerda (área do texto) a translúcido à direita; no celular
 * ela cobre a seção inteira, sob um overlay mais denso, enquadrando o lado
 * direito da recepção para a marca da parede não ficar atrás do título. A marca já
 * identifica o escritório, por isso não há marca-d'água aqui.
 */
const POSITIONING_TAGS = ["Tradição", "Estratégia", "Confiança", "Resultados"];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-900">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 lg:left-[45%]">
          <Image
            src={heroRecepcao}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-[100%_35%] lg:object-[25%_35%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/90 via-primary-900/85 to-primary-900/75 lg:bg-gradient-to-r lg:from-primary-900 lg:from-[45%] lg:via-primary-900/70 lg:via-[68%] lg:to-primary-900/40" />
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
