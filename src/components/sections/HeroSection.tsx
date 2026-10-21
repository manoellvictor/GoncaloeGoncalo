import Image from "next/image";
import Link from "next/link";
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
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/90 via-primary-900/85 to-primary-900/75 lg:bg-gradient-to-r lg:from-primary-900 lg:from-[45%] lg:via-primary-900/55 lg:via-[66%] lg:to-primary-900/15" />
      </div>

      <div className="container-site">
        <div className="flex min-h-[560px] max-w-3xl flex-col justify-center py-24 lg:min-h-[720px] lg:py-32">
          <span aria-hidden="true" className="block h-px w-12 bg-gold-500" />

          <p className="mt-6 text-eyebrow font-semibold uppercase tracking-[0.2em] text-gold-300">
            Gonçalo &amp; Gonçalo Advogados Associados
          </p>

          <h1 className="mt-5 font-editorial text-[clamp(2.75rem,5.5vw,4.75rem)] font-light leading-[1.08] text-white">
            Soluções jurídicas com estratégia, ética e resultados.
          </h1>

          <p className="mt-8 max-w-xl text-body-lg text-white/80">
            Um escritório boutique que une a solidez da tradição jurídica à
            clareza de quem trabalha para resolver — não apenas para litigar.
          </p>

          <div className="mt-10">
            <Link
              href="/contato"
              className="group inline-flex items-center gap-3 rounded-sm border border-gold-500 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 ease-brand hover:bg-gold-500 hover:text-primary-900"
            >
              Fale com um especialista
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <ul className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
            {POSITIONING_TAGS.map((tag) => (
              <li
                key={tag}
                className="text-xs uppercase tracking-[0.2em] text-white/70"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
