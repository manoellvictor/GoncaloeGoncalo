/**
 * Configuração central do site.
 *
 * Única fonte dos dados institucionais e de contato: header, home, rodapé,
 * /contato, /localizacao, botões de WhatsApp e dados estruturados (seo.ts)
 * leem daqui. Para mudar telefone, e-mail ou endereço, altere só este arquivo.
 */

export const siteConfig = {
  name: "Gonçalo & Gonçalo Advogados Associados",
  shortName: "Gonçalo & Gonçalo",
  tagline: "Mais que Direito. Resultados Duradouros.",
  description:
    "Escritório boutique que une tradição jurídica e visão contemporânea. Consultoria e contencioso para empresas e pessoas físicas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://advocaciagoncalo.vercel.app",
} as const;

/** Dados de contato oficiais do escritório. */
export const contact = {
  phone: "(98) 98590-7369",
  phoneHref: "tel:+5598985907369",
  /** Formato internacional, usado nos dados estruturados (schema.org). */
  phoneE164: "+55 98 98590-7369",
  email: "advocacia@goncaloegoncalo.com",
  addressLine: "R. Enxovas, 41 - Calhau",
  addressStreet: "R. Enxovas, 41",
  addressDistrict: "Calhau",
  addressCity: "São Luís - MA",
  addressLocality: "São Luís",
  addressRegion: "MA",
  addressZip: "65071-530",
  whatsappNumber: "5598985907369",
  whatsappMessage: "Olá! Gostaria de falar com um especialista.",
  mapsEmbedQuery: "R. Enxovas, 41 - Calhau, São Luís - MA, 65071-530",
} as const;

export const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
  contact.whatsappMessage,
)}`;

/** Link para abrir o endereço no Google Maps (rodapé, CTA). */
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  contact.mapsEmbedQuery,
)}`;

/**
 * Redes sociais — preencha a URL completa de cada perfil. Rede com `href`
 * vazio não é exibida (nem no rodapé, nem no schema.org).
 */
export const social: readonly {
  name: "LinkedIn" | "Instagram" | "YouTube";
  href: string;
}[] = [
  { name: "LinkedIn", href: "" },
  { name: "Instagram", href: "" },
  { name: "YouTube", href: "" },
];

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
