import { revalidatePath } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase/server";

/**
 * Cron da Vercel (vercel.json): revalida as páginas dos artigos agendados
 * cujo horário já chegou, mais a listagem, a home e o sitemap.
 *
 * É uma garantia: o banco só entrega artigos com data vencida e as páginas
 * já se renovam a cada 5 minutos, então o agendado aparece mesmo sem o cron.
 * No plano Hobby a Vercel roda cron uma vez por dia.
 *
 * Protegido por CRON_SECRET (a Vercel envia "Authorization: Bearer …").
 */
export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo || request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return Response.json({ erro: "não autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) return Response.json({ erro: "Supabase não configurado" }, { status: 500 });

  // Publicados nas últimas 26 horas (um dia + folga de horário do cron).
  const desde = new Date(Date.now() - 26 * 3600 * 1000).toISOString();
  const { data, error } = await supabase
    .from("artigos")
    .select("slug")
    .gte("publicado_em", desde);

  if (error) return Response.json({ erro: error.message }, { status: 500 });

  for (const { slug } of data ?? []) revalidatePath(`/artigos/${slug}`);
  revalidatePath("/");
  revalidatePath("/artigos");
  revalidatePath("/api/publicacoes");
  revalidatePath("/sitemap.xml");

  return Response.json({ revalidados: (data ?? []).map((artigo) => artigo.slug) });
}
