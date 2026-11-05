import { ArrowRightIcon } from "@/components/ui/Icons";
import { whatsappUrl } from "@/lib/site-config";

/**
 * Botão "Fale com um especialista" — o CTA principal do site, idêntico no hero
 * da home e no banner de CTA do fim das páginas: fundo navy, borda dourada de
 * 1px, texto e seta brancos em caixa alta; no hover preenche de dourado.
 * Abre o WhatsApp do escritório.
 */
export function SpecialistCta() {
  return (
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
  );
}
