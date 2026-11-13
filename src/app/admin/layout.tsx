import type { Metadata } from "next";

/**
 * Painel do escritório (/admin): fora dos buscadores (noindex aqui, no
 * robots.txt e no cabeçalho X-Robots-Tag do proxy) e fora do sitemap.
 */
export const metadata: Metadata = {
  title: { default: "Painel do escritório", template: "%s | Painel do escritório" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full bg-cream-100">{children}</div>;
}
