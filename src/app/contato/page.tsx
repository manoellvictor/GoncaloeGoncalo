import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { ContactForm } from "@/components/ui/ContactForm";
import { Eyebrow } from "@/components/ui/SectionHeading";
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { pageMetadata } from "@/lib/seo";
import { contact, whatsappUrl } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Fale Conosco",
  description:
    "Entre em contato com o escritório Gonçalo & Gonçalo: envie sua mensagem pelo formulário, fale pelo WhatsApp ou ligue. Avaliação inicial sem compromisso.",
  path: "/contato",
});

/** Página 09 — canal formal de contato e geração de leads (prd.md §6.10). */
export default function ContatoPage() {
  return (
    <>
      <PageTitleBlock
        eyebrow="Fale Conosco"
        title="Vamos conversar sobre o seu caso"
        description="Preencha o formulário e nossa equipe retorna em até um dia útil. Se preferir, fale direto pelo WhatsApp ou por telefone."
      />

      <section className="section-y bg-cream-100">
        <div className="container-site">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div>
              <h2 className="text-h3">Envie sua mensagem</h2>
              <div aria-hidden="true" className="mt-5 h-px w-16 bg-gold-500" />
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>

            <aside className="lg:pt-2">
              <Eyebrow>Contato Direto</Eyebrow>
              <h2 className="mt-4 text-h3">Outras formas de falar conosco</h2>
              <div aria-hidden="true" className="mt-5 h-px w-16 bg-gold-500" />

              <ul className="mt-8 flex flex-col gap-6">
                <li>
                  <a
                    href={contact.phoneHref}
                    className="flex items-start gap-4 text-neutral-700 transition-colors duration-200 ease-brand hover:text-primary-900"
                  >
                    <PhoneIcon width={22} height={22} className="mt-0.5 shrink-0 text-gold-700" />
                    <span>
                      <span className="block text-small font-semibold uppercase tracking-[0.1em] text-primary-900">
                        Telefone
                      </span>
                      {contact.phone}
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-start gap-4 break-all text-neutral-700 transition-colors duration-200 ease-brand hover:text-primary-900"
                  >
                    <MailIcon width={22} height={22} className="mt-0.5 shrink-0 text-gold-700" />
                    <span>
                      <span className="block text-small font-semibold uppercase tracking-[0.1em] text-primary-900">
                        E-mail
                      </span>
                      {contact.email}
                    </span>
                  </a>
                </li>

                <li className="flex items-start gap-4 text-neutral-700">
                  <MapPinIcon width={22} height={22} className="mt-0.5 shrink-0 text-gold-700" />
                  <span>
                    <span className="block text-small font-semibold uppercase tracking-[0.1em] text-primary-900">
                      Endereço
                    </span>
                    {contact.addressLine}
                    <br />
                    {contact.addressCity}
                    <br />
                    CEP {contact.addressZip}
                  </span>
                </li>
              </ul>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center justify-center gap-3 rounded-md border border-primary-900 px-8 py-3.5 text-sm font-semibold text-primary-900 transition-colors duration-200 ease-brand hover:bg-primary-900 hover:text-white"
              >
                <WhatsAppIcon width={20} height={20} />
                Abrir no WhatsApp
              </a>

              <p className="mt-10 rounded-md border border-border-light bg-white p-6 text-small text-neutral-700">
                Seus dados são usados apenas para responder a este contato e não
                são compartilhados com terceiros, conforme a nossa Política de
                Privacidade.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
