import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { EmailText } from "@/components/ui/EmailText";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/ui/Icons";
import { contact, mapsUrl, whatsappUrl } from "@/lib/site-config";
import ctaEscritorio from "../../../public/images/cta-banner-escritorio.jpg";

/**
 * Banner de CTA institucional (padroes-de-projeto.md §3.11).
 *
 * Uma única vez por página, tipicamente antes do footer. Título serifado em
 * caixa alta dourada + parágrafo curto + botão primário (WhatsApp) à esquerda;
 * contato direto à direita, separado por linha vertical fina, sobre foto do
 * escritório escurecida por overlay navy.
 *
 * Garante o ponto de conversão que toda página deve ter (padroes §2).
 */
export function CtaBanner({
  title = "Vamos construir a melhor solução para o seu caso.",
  description = "Conte seu caso para a nossa equipe. Avaliamos a situação e apresentamos os caminhos possíveis com clareza, sem compromisso.",
}: {
  title?: string;
  description?: string;
}) {
  const contactLink =
    "flex items-start gap-4 transition-colors duration-200 ease-brand hover:text-gold-400";

  return (
    <section className="relative isolate overflow-hidden bg-primary-900">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={ctaEscritorio}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/85" />
      </div>

      <div className="container-site py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-0">
          <div className="lg:pr-16">
            <h2 className="max-w-xl font-editorial text-[clamp(1.875rem,3.4vw,2.625rem)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-gold-400">
              {title}
            </h2>
            <p className="mt-6 max-w-lg text-body-lg text-white/80">{description}</p>
            <div className="mt-10">
              <Button
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onDark
                arrow
              >
                Fale com um especialista
              </Button>
            </div>
          </div>

          <div className="border-t border-white/15 pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
            <h3 className="text-eyebrow font-semibold uppercase text-gold-400">
              Contato direto
            </h3>

            <ul className="mt-6 flex flex-col gap-5 text-white/85">
              <li>
                <a href={contact.phoneHref} className={contactLink}>
                  <PhoneIcon width={20} height={20} className="mt-1 shrink-0 text-gold-500" />
                  <span className="text-body-lg">{contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={contactLink}>
                  <MailIcon width={20} height={20} className="mt-1 shrink-0 text-gold-500" />
                  <span className="text-body-lg">
                    <EmailText email={contact.email} />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactLink}
                >
                  <MapPinIcon width={20} height={20} className="mt-1 shrink-0 text-gold-500" />
                  <span className="text-body-lg">
                    {contact.addressLine}
                    <br />
                    {contact.addressCity}, CEP {contact.addressZip}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
