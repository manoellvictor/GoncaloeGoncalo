import { getImageProps } from "next/image";
import { SpecialistCta } from "@/components/ui/SpecialistCta";
import heroDesktop from "../../../public/images/home-hero-recepcao-desktop.jpg";
import heroMobile from "../../../public/images/home-hero-recepcao-mobile.jpg";

/**
 * Hero — exclusivo da Homepage (padroes-de-projeto.md §3.1).
 * Páginas internas usam PageTitleBlock, mais compacto, para não competir com ele.
 *
 * Estrutura: linha dourada + H1 + subtítulo + CTA (WhatsApp) + tags de
 * posicionamento.
 *
 * Fundo marfim (ivory-100), em harmonia com a madeira e a pedra da recepção;
 * texto em navy, destaque e tags em bronze, filetes em dourado.
 *
 * Fotografia: recepção do escritório em cores naturais, com dois recortes da
 * mesma foto (art direction via <picture>). A foto original é retrato; no
 * desktop o recorte vai do lustre à mesa e ocupa um quadro vertical à direita,
 * com a borda esquerda dissolvida no marfim. No celular o conteúdo vem
 * primeiro e a foto, num recorte fechado no logotipo e no balcão, vem abaixo.
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
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="38rem" />
      <source srcSet={mobileSrcSet} sizes="100vw" />
      <img
        {...imgProps}
        alt=""
        fetchPriority="high"
        loading="eager"
        className="object-cover object-center lg:object-[50%_40%]"
      />
    </picture>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ivory-100">
      <div className="container-site">
        <div className="flex max-w-3xl flex-col py-16 sm:py-20 lg:min-h-[720px] lg:justify-center lg:py-28">
          <span aria-hidden="true" className="block h-px w-14 bg-gold-500" />

          <h1 className="mt-8 font-editorial text-[clamp(1.625rem,8.2vw,3rem)] font-normal uppercase leading-[1.08] tracking-[0.03em] text-primary-900 lg:text-[clamp(2.75rem,4.4vw,4.5rem)] [&>span]:whitespace-nowrap">
            <span className="block">Soluções jurídicas</span>
            <span className="block">com estratégia,</span>
            <span className="block">
              ética e <span className="text-bronze-700">resultados.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-[32rem] font-editorial text-[1.375rem] leading-snug text-primary-900 lg:max-w-[28rem] lg:text-[1.625rem] xl:max-w-[32rem]">
            Excelência jurídica para proteger seus interesses e impulsionar seus
            negócios.
          </p>

          <div className="mt-10">
            <SpecialistCta />
          </div>

          <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-4 lg:mt-16">
            {POSITIONING_TAGS.map((tag, index) => (
              <li key={tag} className="flex items-center gap-3 sm:gap-4">
                {index > 0 ? (
                  <span aria-hidden="true" className="hidden text-gold-500 sm:inline">
                    •
                  </span>
                ) : null}
                <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-bronze-700 sm:text-xs sm:tracking-[0.22em]">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Foto: abaixo do conteúdo no celular; no desktop, quadro vertical
          colado à direita (a foto é retrato, do lustre à mesa), com a borda
          esquerda dissolvida em marfim para não haver corte entre texto e foto. */}
      <div
        aria-hidden="true"
        className="relative aspect-[4/3] sm:aspect-[16/10] lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:aspect-auto lg:w-[min(45%,38rem)]"
      >
        <HeroPhoto />
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-ivory-100 to-transparent lg:inset-0 lg:h-auto lg:bg-[linear-gradient(to_right,var(--color-ivory-100)_2rem,color-mix(in_srgb,var(--color-ivory-100)_50%,transparent)_5.5rem,transparent_11rem)]" />
      </div>
    </section>
  );
}
