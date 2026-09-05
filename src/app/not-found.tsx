import { Button } from "@/components/ui/Button";
import { ArrowLink } from "@/components/ui/ArrowLink";

/** 404 — mantém o usuário no site oferecendo os caminhos mais procurados. */
export default function NotFound() {
  return (
    <section className="bg-primary-900">
      <div className="container-site flex min-h-[60vh] flex-col justify-center py-24">
        <p className="text-eyebrow font-semibold uppercase text-gold-300">
          Erro 404
        </p>

        <h1 className="mt-6 max-w-2xl text-h2 text-white">
          Não encontramos a página que você procura
        </h1>

        <div aria-hidden="true" className="mt-6 h-px w-16 bg-gold-500" />

        <p className="mt-6 max-w-xl text-body-lg text-white/80">
          O endereço pode ter mudado ou o conteúdo pode ter sido removido. Use os
          atalhos abaixo para continuar.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button href="/" onDark>
            Voltar ao início
          </Button>
          <ArrowLink href="/areas-de-atuacao" onDark>
            Ver áreas de atuação
          </ArrowLink>
          <ArrowLink href="/contato" onDark>
            Falar com o escritório
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
