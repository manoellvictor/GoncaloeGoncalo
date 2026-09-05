import { PageTitleBlock } from "@/components/sections/PageTitleBlock";
import { LegalTabs } from "@/components/ui/LegalTabs";
import { contact, siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Políticas",
  description:
    "Política de Privacidade, Política de Cookies e Termos de Uso do site do escritório Gonçalo & Gonçalo Advogados Associados, em conformidade com a LGPD.",
  path: "/politicas",
});

/**
 * Página 11 — Políticas / Privacidade / Cookies / Termos (prd.md §6.12).
 *
 * TEXTO PLACEHOLDER: o conteúdo abaixo é uma minuta estruturada segundo a LGPD
 * e serve para validar layout e navegação. Precisa de revisão e aprovação do
 * jurídico interno antes da publicação (prd.md §13).
 */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h3 className="text-h3">{title}</h3>
      <div className="mt-4 flex flex-col gap-4 text-neutral-700">{children}</div>
    </section>
  );
}

export default function PoliticasPage() {
  const tabs = [
    {
      id: "privacidade",
      label: "Política de Privacidade",
      content: (
        <div className="mx-auto max-w-3xl">
          <Section title="1. Quem trata os seus dados">
            <p>
              O {siteConfig.name} é o controlador dos dados pessoais coletados
              neste site. Para exercer seus direitos ou tirar dúvidas sobre este
              documento, escreva para{" "}
              <a href={`mailto:${contact.email}`} className="text-gold-700 underline">
                {contact.email}
              </a>
              .
            </p>
          </Section>

          <Section title="2. Quais dados coletamos">
            <p>
              Coletamos apenas os dados que você nos fornece voluntariamente pelo
              formulário de contato: nome completo, e-mail, telefone, empresa
              (opcional) e o conteúdo da sua mensagem.
            </p>
            <p>
              Também coletamos dados de navegação por meio de cookies, conforme
              descrito na Política de Cookies, e somente após o seu
              consentimento.
            </p>
          </Section>

          <Section title="3. Por que tratamos esses dados">
            <p>
              Os dados do formulário são tratados com a finalidade exclusiva de
              responder ao seu contato e avaliar a prestação de serviços
              jurídicos, com base no consentimento que você fornece ao enviar a
              mensagem e nos procedimentos preliminares a um contrato.
            </p>
          </Section>

          <Section title="4. Com quem compartilhamos">
            <p>
              Não vendemos nem cedemos seus dados. O compartilhamento se limita a
              prestadores de serviço que viabilizam a operação do site e do
              atendimento, sempre sob obrigação contratual de confidencialidade,
              e às autoridades quando houver determinação legal.
            </p>
          </Section>

          <Section title="5. Por quanto tempo guardamos">
            <p>
              Mantemos os dados do formulário pelo tempo necessário ao
              atendimento e, depois, pelo prazo exigido para o cumprimento de
              obrigações legais e regulatórias aplicáveis à advocacia.
            </p>
          </Section>

          <Section title="6. Seus direitos">
            <p>
              A Lei Geral de Proteção de Dados garante a você o direito de
              confirmar a existência de tratamento, acessar seus dados, corrigir
              dados incompletos ou desatualizados, solicitar anonimização,
              bloqueio ou eliminação, revogar o consentimento e solicitar a
              portabilidade.
            </p>
            <p>
              Para exercer qualquer desses direitos, basta escrever para o
              e-mail indicado no item 1. Responderemos dentro dos prazos legais.
            </p>
          </Section>

          <Section title="7. Segurança">
            <p>
              Adotamos medidas técnicas e administrativas para proteger os dados
              contra acessos não autorizados e situações de destruição, perda ou
              alteração, incluindo controle de acesso e comunicação criptografada.
            </p>
          </Section>
        </div>
      ),
    },
    {
      id: "cookies",
      label: "Cookies",
      content: (
        <div className="mx-auto max-w-3xl">
          <Section title="1. O que são cookies">
            <p>
              Cookies são pequenos arquivos gravados no seu navegador quando você
              visita um site. Eles permitem lembrar preferências e entender como
              as páginas são utilizadas.
            </p>
          </Section>

          <Section title="2. Cookies que utilizamos">
            <p>
              <strong className="text-primary-900">Necessários:</strong> essenciais
              para o funcionamento do site, como o registro da sua escolha neste
              aviso de cookies. Não dependem de consentimento.
            </p>
            <p>
              <strong className="text-primary-900">Analíticos:</strong> ajudam a
              entender quais conteúdos são mais procurados, de forma agregada.
              Só são ativados se você aceitar.
            </p>
          </Section>

          <Section title="3. Como recusar ou alterar sua escolha">
            <p>
              Você pode recusar os cookies analíticos no aviso exibido ao entrar
              no site, sem qualquer prejuízo à navegação. Para mudar de ideia
              depois, limpe os dados do site no seu navegador — o aviso será
              exibido novamente na próxima visita.
            </p>
            <p>
              Também é possível bloquear cookies diretamente nas configurações do
              navegador, o que pode afetar o funcionamento de alguns recursos.
            </p>
          </Section>
        </div>
      ),
    },
    {
      id: "termos",
      label: "Termos de Uso",
      content: (
        <div className="mx-auto max-w-3xl">
          <Section title="1. Aceitação">
            <p>
              Ao navegar neste site, você concorda com estes Termos de Uso. Caso
              não concorde, pedimos que não utilize o site.
            </p>
          </Section>

          <Section title="2. Natureza do conteúdo">
            <p>
              As informações publicadas aqui, incluindo os artigos da seção de
              conteúdo jurídico, têm caráter meramente informativo e não
              constituem consulta, parecer ou orientação jurídica para casos
              concretos.
            </p>
            <p>
              A relação entre advogado e cliente só se estabelece mediante
              contratação formal. O envio de mensagem por este site não cria, por
              si só, tal relação nem gera dever de sigilo profissional sobre o
              conteúdo enviado antes da contratação.
            </p>
          </Section>

          <Section title="3. Propriedade intelectual">
            <p>
              Os textos, marcas, logotipos e demais elementos deste site pertencem
              ao escritório e não podem ser reproduzidos sem autorização prévia e
              por escrito, ressalvada a citação com indicação da fonte.
            </p>
          </Section>

          <Section title="4. Publicidade e ética profissional">
            <p>
              Este site observa o Código de Ética e Disciplina da OAB e o
              Provimento sobre publicidade da advocacia, tendo caráter
              exclusivamente informativo, sem captação de clientela ou promessa
              de resultados.
            </p>
          </Section>

          <Section title="5. Alterações">
            <p>
              Estes termos podem ser atualizados a qualquer momento. A versão
              vigente é sempre a publicada nesta página.
            </p>
          </Section>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageTitleBlock
        eyebrow="Transparência"
        title="Políticas e Termos"
        description="Como tratamos seus dados, quais cookies utilizamos e em que condições este site é disponibilizado."
      />

      <section className="section-y bg-cream-100">
        <div className="container-site">
          <LegalTabs tabs={tabs} />
        </div>
      </section>
    </>
  );
}
