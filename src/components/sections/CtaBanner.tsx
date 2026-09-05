import { Button } from "@/components/ui/Button";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/ui/Icons";
import { contact } from "@/lib/site-config";

/**
 * Banner de CTA institucional (padroes-de-projeto.md §3.11).
 *
 * Uma única vez por página, tipicamente antes do footer. Título de impacto +
 * parágrafo curto + botão primário à esquerda; contato direto à direita, sobre
 * imagem arquitetônica com overlay navy.
 *
 * Garante o ponto de conversão que toda página deve ter (padroes §2).
 */
export function CtaBanner({
  title = "Pronto para resolver com quem entende do assunto?",
  description = "Conte seu caso para a nossa equipe. Avaliamos a situação e apresentamos os caminhos possíveis com clareza, sem compromisso.",
  imageUrl,
}: {
  title?: string;
  description?: string;
  imageUrl?: string | null;
}) {
  return (
    <section className="relative isolate bg-primary-900">
      <div className="absolute inset-0 -z-10">
        <ImageFrame
          src={imageUrl}
          alt=""
          ratio="wide"
          overlay
          sizes="100vw"
          className="size-full"
        />
      </div>

      <div className="container-site py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-h2 text-white">{title}</h2>
            <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />
            <p className="mt-6 max-w-lg text-body-lg text-white/80">{description}</p>
            <div className="mt-10">
              <Button href="/contato" onDark>
                Fale com um especialista
              </Button>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <h3 className="text-eyebrow font-semibold uppercase text-gold-300">
              Contato direto
            </h3>

            <ul className="mt-6 flex flex-col gap-5 text-white/80">
              <li>
                <a
                  href={contact.phoneHref}
                  className="flex items-start gap-4 transition-colors duration-200 ease-brand hover:text-gold-300"
                >
                  <PhoneIcon width={20} height={20} className="mt-1 shrink-0 text-gold-500" />
                  <span className="text-body-lg">{contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-4 break-all transition-colors duration-200 ease-brand hover:text-gold-300"
                >
                  <MailIcon width={20} height={20} className="mt-1 shrink-0 text-gold-500" />
                  <span className="text-body-lg">{contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-4">
                <MapPinIcon width={20} height={20} className="mt-1 shrink-0 text-gold-500" />
                <span className="text-body-lg">
                  {contact.addressLine}
                  <br />
                  {contact.addressCity}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
