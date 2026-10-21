/**
 * E-mail com ponto de quebra opcional depois do "@": em telas estreitas o
 * endereço quebra entre usuário e domínio, nunca no meio de uma palavra.
 */
export function EmailText({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at < 0) return <>{email}</>;
  return (
    <>
      {email.slice(0, at + 1)}
      <wbr />
      {email.slice(at + 1)}
    </>
  );
}
