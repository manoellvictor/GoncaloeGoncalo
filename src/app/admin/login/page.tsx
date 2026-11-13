import Link from "next/link";
import { CaixaAcesso } from "@/components/admin/CaixaAcesso";
import { FormularioAcesso } from "@/components/admin/FormularioAcesso";
import { campo, rotulo } from "@/components/admin/estilos";
import { entrar } from "@/lib/admin/acoes-acesso";

export const metadata = { title: "Entrar" };

const AVISOS: Record<string, string> = {
  saiu: "Você saiu do painel.",
  link: "Este link expirou ou já foi usado. Peça um novo em “Esqueci minha senha”.",
  "sem-acesso": "Esta conta não tem acesso ao painel.",
};

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const primeiro = (valor: string | string[] | undefined) =>
    Array.isArray(valor) ? valor[0] : valor;
  const aviso = AVISOS[primeiro(params.aviso) ?? ""] ?? AVISOS[primeiro(params.erro) ?? ""];
  const proximo = primeiro(params.proximo) ?? "/admin";

  return (
    <CaixaAcesso titulo="Entrar" descricao="Use o e-mail e a senha da conta do escritório.">
      {aviso ? (
        <p className="mb-5 rounded-md bg-ivory-100 px-3.5 py-2.5 text-small text-primary-900">
          {aviso}
        </p>
      ) : null}

      <FormularioAcesso acao={entrar} botao="Entrar">
        <input type="hidden" name="proximo" value={proximo} />
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
        <div>
          <label htmlFor="senha" className={rotulo}>
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            required
            className={campo}
          />
        </div>
      </FormularioAcesso>

      <p className="mt-5 text-center">
        <Link
          href="/admin/esqueci-senha"
          className="inline-flex min-h-11 items-center text-small font-semibold text-gold-700 underline underline-offset-2"
        >
          Esqueci minha senha
        </Link>
      </p>
    </CaixaAcesso>
  );
}
