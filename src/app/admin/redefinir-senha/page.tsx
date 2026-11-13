import { CaixaAcesso } from "@/components/admin/CaixaAcesso";
import { FormularioAcesso } from "@/components/admin/FormularioAcesso";
import { ajuda, campo, rotulo } from "@/components/admin/estilos";
import { redefinirSenha } from "@/lib/admin/acoes-acesso";
import { exigirEscritorio } from "@/lib/supabase/sessao";

export const metadata = { title: "Nova senha" };

/** Aberta pelo link do e-mail (já com a sessão criada em /admin/auth/callback). */
export default async function RedefinirSenhaPage() {
  await exigirEscritorio();

  return (
    <CaixaAcesso titulo="Criar nova senha" descricao="Escolha uma senha com pelo menos 8 caracteres.">
      <FormularioAcesso acao={redefinirSenha} botao="Salvar nova senha">
        <div>
          <label htmlFor="senha" className={rotulo}>
            Nova senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            aria-describedby="senha-ajuda"
            className={campo}
          />
          <p id="senha-ajuda" className={ajuda}>
            Dica: use uma frase fácil de lembrar, como “cafe-com-leite-2026”.
          </p>
        </div>
        <div>
          <label htmlFor="confirmacao" className={rotulo}>
            Repita a nova senha
          </label>
          <input
            id="confirmacao"
            name="confirmacao"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={campo}
          />
        </div>
      </FormularioAcesso>
    </CaixaAcesso>
  );
}
