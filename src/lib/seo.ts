import type { Metadata } from "next";
import { siteConfig, contact, social } from "./site-config";

/**
 * Rede de segurança para descriptions vindas do banco sem `meta_description`
 * preenchida: corta em fronteira de palavra para não estourar os 160
 * caracteres, em vez de deixar o buscador truncar no meio de uma palavra.
 *
 * Não inventa texto quando a description é curta demais — isso é decisão
 * editorial, sinalizada pelo aviso de desenvolvimento em `pageMetadata`.
 */
export function clampDescription(text: string, max = 160): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, "")}…`;
}

/**
 * Metadata por rota no padrão exigido em padroes-de-projeto.md §8:
 * `[Nome da Página] | Gonçalo & Gonçalo Advogados Associados`
 * com description de 140–160 caracteres.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  if (process.env.NODE_ENV === "development") {
    const len = description.length;
    if (len < 140 || len > 160) {
      console.warn(
        `[seo] "${title}": meta description tem ${len} caracteres (padrão: 140–160).`,
      );
    }
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

const fullAddress = {
  "@type": "PostalAddress",
  streetAddress: contact.addressLine,
  addressLocality: contact.addressCity,
  postalCode: contact.addressZip,
  addressCountry: "BR",
};

/** Organization + LegalService na home (padroes-de-projeto.md §8). */
export function legalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    slogan: siteConfig.tagline,
    telephone: contact.phone,
    email: contact.email,
    address: fullAddress,
    areaServed: "BR",
    sameAs: social.map((s) => s.href).filter((h) => h !== "#"),
  };
}

/** FAQPage na página de Perguntas Frequentes. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Article nas páginas de artigo individual. */
export function articleJsonLd(article: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    url: `${siteConfig.url}/artigos/${article.slug}`,
    ...(article.image ? { image: article.image } : {}),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      address: fullAddress,
    },
  };
}

/** Breadcrumbs — recomendado em áreas de atuação e artigos (padroes §4). */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
