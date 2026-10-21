import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/site-config";
import heroRecepcao from "../../../public/images/home-hero-recepcao.jpg";

/**
 * Hero — exclusivo da Homepage (padroes-de-projeto.md §3.1).
 * Páginas internas usam PageTitleBlock, mais compacto, para não competir com ele.
 *
 * Estrutura: linha dourada + H1 + subtítulo + CTA (WhatsApp) + tags de
 * posicionamento, sobre imagem com overlay navy para legibilidade.
 *
 * Fundo: recepção do escritório, já recortada (parede, marca e balcão) e
 * dessaturada no arquivo. No desktop a foto ocupa a direita e o degradê navy,
 * aplicado sobre ela, vai de opaco (emenda com o fundo) a transparente, para a
 * foto aparecer nítida à direita. No celular ela cobre a seção inteira,
 * enquadrando o lado direito da recepção para a marca da parede não ficar
 * atrás do título.
 */
const POSITIONING_TAGS = ["Tradição", "Estratégia", "Confiança", "Resultados"];

const SIDE_NOTE = ["Experiência", "que transforma", "desafios em", "oportunidades"];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-900">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 lg:left-[40%]">
          <Image
            src={heroRecepcao}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[100%_35%] lg:object-[42%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 to-primary-900/40 lg:bg-gradient-to-r lg:from-primary-900 lg:from-0% lg:via-primary-900/60 lg:via-[30%] lg:to-transparent lg:to-[60%]" />
        </div>
      </div>

      <div className="container-site relative">
        {/* Nota lateral — só desktop, no canto superior direito */}
        <div
          aria-hidden="true"
          className="absolute right-6 top-16 hidden text-right lg:block xl:right-0"
        >
          <p className="text-[0.6875rem] uppercase leading-[1.9] tracking-[0.28em] text-white/85">
            {SIDE_NOTE.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <span className="ml-auto mt-4 block h-px w-10 bg-gold-500" />
        </div>

        <div className="flex min-h-[600px] max-w-3xl flex-col justify-center py-24 lg:min-h-[720px] lg:py-32">
          <span aria-hidden="true" className="block h-px w-12 bg-gold-500" />

          <h1 className="mt-8 font-editorial text-[clamp(2.25rem,4.4vw,4rem)] font-normal uppercase leading-[1.08] tracking-[0.03em] text-white sm:[&>span]:whitespace-nowrap">
            <span className="block">Soluções jurídicas</span>
            <span className="block">com estratégia,</span>
            <span className="block">
              ética e <span className="text-gold-500">resultados.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-md font-editorial text-[1.375rem] leading-snug text-white/85">
            Excelência jurídica para proteger seus interesses e impulsionar seus
            negócios.
          </p>

          <div className="mt-10">
            <Button
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="gold-outline"
              onDark
              arrow
            >
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
                <span className="text-xs uppercase tracking-[0.22em] text-gold-400">
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
