import Link from "next/link";
import { CaixaAcesso } from "@/components/admin/CaixaAcesso";
import { FormularioAcesso } from "@/components/admin/FormularioAcesso";
import { campo, rotulo } from "@/components/admin/estilos";
import { enviarLinkDeSenha } from "@/lib/admin/acoes-acesso";

export const metadata = { title: "Esqueci minha senha" };

export default function EsqueciSenhaPage() {
  return (
    <CaixaAcesso
      titulo="Esqueci minha senha"
      descricao="Informe o e-mail da conta do escritório. Enviaremos um link para você criar uma nova senha."
    >
      <FormularioAcesso acao={enviarLinkDeSenha} botao="Enviar link">
        <div>
          <label htmlFor="email" className={rotulo}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className={campo}
          />
        </div>
      </FormularioAcesso>

      <p className="mt-5 text-center">
        <Link
          href="/admin/login"
          className="inline-flex min-h-11 items-center text-small font-semibold text-gold-700 underline underline-offset-2"
        >
          Voltar para Entrar
        </Link>
      </p>
    </CaixaAcesso>
  );
}
