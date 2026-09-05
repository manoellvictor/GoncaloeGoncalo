/**
 * Configuração central do site.
 *
 * Dados de contato vêm de variáveis de ambiente: os valores do mockup são
 * explicitamente fictícios (prd.md §11) e NÃO devem ir para produção.
 * Ver .env.example.
 */

export const siteConfig = {
  name: "Gonçalo & Gonçalo Advogados Associados",
  shortName: "Gonçalo & Gonçalo",
  tagline: "Mais que Direito. Resultados Duradouros.",
  description:
    "Escritório boutique que une tradição jurídica e visão contemporânea. Consultoria e contencioso para empresas e pessoas físicas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Contato — placeholders até o escritório fornecer os dados reais (prd.md §11). */
export const contact = {
  phone: process.env.NEXT_PUBLIC_PHONE ?? "(11) 4000-0000",
  phoneHref: `tel:+55${(process.env.NEXT_PUBLIC_PHONE ?? "1140000000").replace(/\D/g, "")}`,
  email: process.env.NEXT_PUBLIC_EMAIL ?? "contato@goncaloegoncalo.com.br",
  addressLine: process.env.NEXT_PUBLIC_ADDRESS ?? "Av. Paulista, 1000 — Bela Vista",
  addressCity: process.env.NEXT_PUBLIC_ADDRESS_CITY ?? "São Paulo — SP",
  addressZip: process.env.NEXT_PUBLIC_ADDRESS_ZIP ?? "01310-100",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP ?? "5511900000000",
  whatsappMessage: "Olá! Gostaria de falar com um especialista.",
  mapsEmbedQuery:
    process.env.NEXT_PUBLIC_MAPS_QUERY ?? "Av. Paulista, 1000, São Paulo, SP",
} as const;

export const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  contact.whatsappMessage,
)}`;

export const social = [
  { name: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN ?? "#" },
  { name: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM ?? "#" },
  { name: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE ?? "#" },
] as const;

/**
 * Áreas de atuação — fallback estático usado quando o Supabase não responde.
 * A fonte de verdade é a tabela `practice_areas`; esta lista garante que o menu
 * e as rotas funcionem mesmo sem banco (build offline, primeiro deploy).
 */
export const practiceAreaFallback = [
  { slug: "direito-empresarial", title: "Direito Empresarial" },
  { slug: "direito-civil", title: "Direito Civil" },
  { slug: "direito-trabalhista", title: "Direito Trabalhista" },
  { slug: "direito-tributario", title: "Direito Tributário" },
  { slug: "direito-imobiliario", title: "Direito Imobiliário" },
  { slug: "direito-administrativo", title: "Direito Administrativo" },
  { slug: "compliance-e-lgpd", title: "Compliance e LGPD" },
  { slug: "direito-do-consumidor", title: "Direito do Consumidor" },
] as const;

/** Menu principal — ordem fixa em todas as páginas (padroes-de-projeto.md §4). */
export type NavItem = {
  label: string;
  href: string;
  /** Só "Áreas de Atuação" abre submenu com as 8 especialidades (padroes §4). */
  hasDropdown?: boolean;
};

export const mainNav: readonly NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Áreas de Atuação", href: "/areas-de-atuacao", hasDropdown: true },
  { label: "Conteúdo Jurídico", href: "/artigos" },
  { label: "Contato", href: "/contato" },
];

/** Colunas do rodapé (prd.md §6.13). */
export const footerNav = {
  navegacao: [
    { label: "Início", href: "/" },
    { label: "Quem Somos", href: "/quem-somos" },
    { label: "Equipe", href: "/equipe" },
    { label: "Estrutura do Escritório", href: "/estrutura" },
    { label: "Áreas de Atuação", href: "/areas-de-atuacao" },
    { label: "Contato", href: "/contato" },
  ],
  conteudo: [
    { label: "Artigos", href: "/artigos" },
    { label: "Perguntas Frequentes", href: "/perguntas-frequentes" },
    { label: "WhatsApp e Localização", href: "/localizacao" },
  ],
  legal: [
    { label: "Políticas", href: "/politicas" },
    { label: "Privacidade", href: "/politicas#privacidade" },
    { label: "Cookies", href: "/politicas#cookies" },
    { label: "Termos", href: "/politicas#termos" },
  ],
} as const;
