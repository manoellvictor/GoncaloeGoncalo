import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { WhatsAppLocationBlock } from "@/components/sections/WhatsAppLocationBlock";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "WhatsApp e Localização",
  description:
    "Fale com o escritório Gonçalo & Gonçalo pelo WhatsApp ou venha nos visitar. Veja o endereço completo, o mapa e como agendar seu atendimento.",
  path: "/localizacao",
});

/** Página 10 — contato direto e localização (prd.md §6.11). */
export default function LocalizacaoPage() {
  return (
    <>
      <PageTitleBlock
        eyebrow="Onde Estamos"
        title="WhatsApp e Localização"
        description="Atendimento rápido pelo WhatsApp e portas abertas para quem prefere conversar pessoalmente."
      />

      <WhatsAppLocationBlock />
    </>
  );
}
