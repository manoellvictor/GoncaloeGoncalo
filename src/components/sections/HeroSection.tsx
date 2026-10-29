import { getImageProps } from "next/image";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { whatsappUrl } from "@/lib/site-config";
import heroDesktop from "../../../public/images/home-hero-recepcao-desktop.jpg";
import heroMobile from "../../../public/images/home-hero-recepcao-mobile.jpg";

/**
 * Hero — exclusivo da Homepage (padroes-de-projeto.md §3.1).
 * Páginas internas usam PageTitleBlock, mais compacto, para não competir com ele.
 *
 * Estrutura: linha dourada + H1 + subtítulo + CTA (WhatsApp) + tags de
 * posicionamento.
 *
 * Fotografia: recepção do escritório em cores naturais, com dois recortes da
 * mesma foto (art direction via <picture>). No desktop o recorte largo ocupa
 * a direita da seção, sob um degradê navy que é sólido atrás do texto e
 * transparente antes do logotipo da parede. No celular o conteúdo vem primeiro
 * e a foto, num recorte fechado no logotipo e no balcão, vem logo abaixo.
 */
const POSITIONING_TAGS = ["Tradição", "Estratégia", "Confiança", "Resultados"];

function HeroPhoto() {
  const common = { alt: "", fill: true, quality: 82 } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: heroDesktop, sizes: "100vw" });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: heroMobile, sizes: "100vw" });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="100vw" />
      <source srcSet={mobileSrcSet} sizes="100vw" />
      <img
        {...imgProps}
        alt=""
        fetchPriority="high"
        loading="eager"
        className="object-cover object-center lg:object-[30%_30%]"
      />
    </picture>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-900">
      <div className="container-site">
        <div className="flex max-w-3xl flex-col py-16 sm:py-20 lg:min-h-[720px] lg:justify-center lg:py-28">
          <span aria-hidden="true" className="block h-px w-14 bg-gold-500" />

          <h1 className="mt-8 font-editorial text-[clamp(1.625rem,8.2vw,3rem)] font-normal uppercase leading-[1.08] tracking-[0.03em] text-white lg:text-[clamp(2.75rem,4.4vw,4.5rem)] [&>span]:whitespace-nowrap">
            <span className="block">Soluções jurídicas</span>
            <span className="block">com estratégia,</span>
            <span className="block">
              ética e <span className="text-gold-500">resultados.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-[32rem] font-editorial text-[1.375rem] leading-snug text-white/90 lg:text-[1.625rem]">
            Excelência jurídica para proteger seus interesses e impulsionar seus
            negócios.
          </p>

          <div className="mt-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center gap-4 rounded-[2px] border border-gold-500 bg-primary-900 px-7 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 ease-brand hover:bg-gold-500 hover:text-primary-900 sm:px-8 sm:text-sm"
            >
              Fale com um especialista
              <ArrowRightIcon
                width={20}
                height={20}
                className="shrink-0 transition-transform duration-200 ease-brand group-hover:translate-x-1"
              />
            </a>
          </div>

          <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-4 lg:mt-16">
            {POSITIONING_TAGS.map((tag, index) => (
              <li key={tag} className="flex items-center gap-3 sm:gap-4">
                {index > 0 ? (
                  <span aria-hidden="true" className="hidden text-gold-500 sm:inline">
                    •
                  </span>
                ) : null}
                <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-gold-400 sm:text-xs sm:tracking-[0.22em]">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Foto: abaixo do conteúdo no celular; à direita, sob o texto, no desktop. */}
      <div
        aria-hidden="true"
        className="relative aspect-[4/3] sm:aspect-[16/10] lg:absolute lg:inset-y-0 lg:left-[max(33%,calc(50%-120px))] lg:right-0 lg:-z-10 lg:aspect-auto"
      >
        <HeroPhoto />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary-900 to-transparent lg:inset-0 lg:h-auto lg:bg-gradient-to-r lg:from-primary-900 lg:from-0% lg:via-primary-900/55 lg:via-[15%] lg:to-transparent lg:to-[35%]" />
      </div>
    </section>
  );
}
