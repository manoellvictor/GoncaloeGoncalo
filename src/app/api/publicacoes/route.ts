import { getFeedPublicacoes } from "@/lib/supabase/queries";
import { areaPorChave, paraCard } from "@/lib/publicacoes";

/**
 * Próximas páginas do feed de /artigos, para o "Carregar mais conteúdos".
 * Mesmos parâmetros da listagem: ?area=tributario&pagina=2&q=termo.
 * Devolve só os campos dos cards.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const area = areaPorChave(params.get("area") ?? undefined);
  const query = params.get("q")?.trim() || undefined;
  const pagina = Math.max(1, Number.parseInt(params.get("pagina") ?? "1", 10) || 1);

  const { itens, totalPaginas } = await getFeedPublicacoes({
    area: area?.slug,
    query,
    pagina,
  });

  return Response.json(
    { itens: itens.map(paraCard), pagina, totalPaginas },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
