import { MapPinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { contact, whatsappUrl } from "@/lib/site-config";

/**
 * Bloco WhatsApp + Localização — página 10 (padroes-de-projeto.md §3.10).
 *
 * Mapa e endereço lado a lado no desktop, empilhados endereço→mapa no mobile.
 * O botão traz o ícone do WhatsApp e rótulo de ação explícito.
 *
 * O mapa é um iframe de terceiro: carrega em lazy e tem `title` para leitores
 * de tela; o endereço em texto ao lado garante a informação para quem não
 * consegue usá-lo.
 */
export function WhatsAppLocationBlock() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    contact.mapsEmbedQuery,
  )}&output=embed`;

  return (
    <>
      {/* --- Ação direta --- */}
      <section className="section-y bg-cream-100">
        <div className="container-site">
          <div className="mx-auto max-w-2xl rounded-lg border border-border-light bg-white p-10 text-center shadow-card lg:p-14">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-900 text-gold-500">
              <WhatsAppIcon width={32} height={32} />
            </span>

            <h2 className="mt-8 text-h2">Fale agora pelo WhatsApp</h2>
            <div aria-hidden="true" className="mx-auto mt-6 h-px w-16 bg-gold-500" />
            <p className="mt-6 text-neutral-700">
              Atendimento direto com a nossa equipe, de segunda a sexta, das 9h
              às 18h. Sua mensagem já vai pré-preenchida.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center justify-center gap-3 rounded-md bg-gold-500 px-8 py-3.5 text-sm font-semibold tracking-wide text-primary-900 transition-colors duration-200 ease-brand hover:bg-gold-700 hover:text-white"
            >
              <WhatsAppIcon width={20} height={20} />
              Abrir no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* --- Localização --- */}
      <section className="section-y bg-white">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="text-eyebrow font-semibold uppercase text-gold-700">
                Onde estamos
              </p>
              <h2 className="mt-4 text-h2">Nossa Localização</h2>
              <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

              <address className="mt-8 flex items-start gap-4 not-italic text-body-lg text-neutral-700">
                <MapPinIcon width={22} height={22} className="mt-1.5 shrink-0 text-gold-700" />
                <span>
                  {contact.addressLine}
                  <br />
                  {contact.addressCity}
                  <br />
                  CEP {contact.addressZip}
                </span>
              </address>

              <p className="mt-8 text-neutral-700">
                Recebemos com hora marcada. Recomendamos agendar previamente pelo
                telefone ou WhatsApp para garantir o atendimento com o advogado
                responsável pela sua área.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-border-light shadow-card">
              <iframe
                src={mapSrc}
                title={`Mapa com a localização do escritório: ${contact.addressLine}, ${contact.addressCity}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[420px] w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
