import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Painel do escritório: fora dos buscadores (as páginas também têm noindex).
      disallow: "/admin",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
