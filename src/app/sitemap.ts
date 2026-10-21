import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getArticles, getPracticeAreas } from "@/lib/supabase/queries";

/** Sitemap com as rotas estáticas do sitemap do PRD mais o conteúdo dinâmico. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/quem-somos", priority: 0.8 },
    { path: "/equipe", priority: 0.8 },
    { path: "/estrutura", priority: 0.6 },
    { path: "/areas-de-atuacao", priority: 0.9 },
    { path: "/artigos", priority: 0.8 },
    { path: "/perguntas-frequentes", priority: 0.7 },
    { path: "/contato", priority: 0.9 },
    { path: "/localizacao", priority: 0.7 },
    { path: "/politicas", priority: 0.3 },
  ];

  const [areas, articles] = await Promise.all([
    getPracticeAreas(),
    getArticles(),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...areas.map((area) => ({
      url: `${siteConfig.url}/areas-de-atuacao/${area.slug}`,
      // Área sem linha no banco não tem data de atualização própria.
      ...(area.updated_at ? { lastModified: new Date(area.updated_at) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${siteConfig.url}/artigos/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
