import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getFaqs, groupFaqsByCategory } from "@/lib/supabase/queries";

export const metadata = pageMetadata({
  title: "Perguntas Frequentes",
  description:
    "Primeira consulta, documentos necessários, honorários e acompanhamento de processos: respostas às dúvidas mais comuns de quem procura o escritório.",
  path: "/perguntas-frequentes",
});

/** Página 08 — central de dúvidas, com dados estruturados FAQPage (padroes §8). */
export default async function PerguntasFrequentesPage() {
  const faqs = await getFaqs();
  const groups = groupFaqsByCategory(faqs);

  return (
    <>
      {faqs.length > 0 ? (
        <JsonLd
          data={faqJsonLd(
            faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
          )}
        />
      ) : null}

      <PageTitleBlock
        eyebrow="Perguntas Frequentes"
        title="Dúvidas Frequentes"
        description="Reunimos aqui o que mais nos perguntam. Se a sua dúvida não estiver na lista, fale conosco — respondemos pessoalmente."
      />

      <section className="section-y bg-cream-100">
        <div className="container-site">
          {groups.length > 0 ? (
            <div className="mx-auto flex max-w-3xl flex-col gap-16">
              {groups.map((group) => (
                <div key={group.category}>
                  <h2 className="text-h3">{group.category}</h2>
                  <div aria-hidden="true" className="mt-5 h-px w-16 bg-gold-500" />

                  <div className="mt-6">
                    <FaqAccordion
                      items={group.items.map((faq) => ({
                        id: faq.id,
                        question: faq.question,
                        answer: faq.answer,
                      }))}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-700">
              As perguntas frequentes estarão disponíveis em breve.
            </p>
          )}
        </div>
      </section>

      <CtaBanner
        title="Sua dúvida não está aqui?"
        description="Envie sua pergunta pelo formulário ou fale com a nossa equipe pelo WhatsApp. Respondemos em até um dia útil."
      />
    </>
  );
}
