"use client";

import { clienteNavegador } from "@/lib/supabase/navegador";

/**
 * Prepara e envia uma imagem do painel para o bucket `artigos`:
 * redimensiona no navegador (capa até 1600px, corpo até 1400px de largura),
 * comprime em WebP (ou JPEG, se o navegador não gerar WebP) e grava em
 * artigos/<id do artigo>/ — pasta apagada junto quando o artigo é excluído.
 */

const LIMITE_ORIGINAL = 25 * 1024 * 1024;

export class ErroImagem extends Error {}

async function comprimir(arquivo: File, larguraMaxima: number): Promise<Blob> {
  if (!arquivo.type.startsWith("image/")) {
    throw new ErroImagem("Escolha um arquivo de imagem (JPG, PNG ou WebP).");
  }
  if (arquivo.size > LIMITE_ORIGINAL) {
    throw new ErroImagem("A imagem é grande demais (máximo de 25 MB).");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(arquivo);
  } catch {
    throw new ErroImagem("Não foi possível abrir esta imagem. Tente salvá-la como JPG.");
  }

  const escala = Math.min(1, larguraMaxima / bitmap.width);
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const contexto = canvas.getContext("2d");
  if (!contexto) throw new ErroImagem("Seu navegador não conseguiu preparar a imagem.");
  contexto.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const gerar = (tipo: string, qualidade: number) =>
    new Promise<Blob | null>((resolver) => canvas.toBlob(resolver, tipo, qualidade));

  const webp = await gerar("image/webp", 0.82);
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await gerar("image/jpeg", 0.85);
  if (!jpeg) throw new ErroImagem("Seu navegador não conseguiu preparar a imagem.");
  return jpeg;
}

export async function enviarImagem(
  arquivo: File,
  artigoId: string,
  uso: "capa" | "corpo",
): Promise<string> {
  const blob = await comprimir(arquivo, uso === "capa" ? 1600 : 1400);
  const extensao = blob.type === "image/webp" ? "webp" : "jpg";
  const caminho = `${artigoId}/${uso}-${Date.now()}.${extensao}`;

  const storage = clienteNavegador().storage.from("artigos");
  const { error } = await storage.upload(caminho, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    throw new ErroImagem(
      "Não foi possível enviar a imagem. Verifique sua conexão e se você ainda está conectado ao painel.",
    );
  }
  return storage.getPublicUrl(caminho).data.publicUrl;
}
