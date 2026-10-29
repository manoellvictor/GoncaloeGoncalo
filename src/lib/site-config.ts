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
 * Áreas de atuação oficiais — define QUAIS áreas o site mostra e em que ordem
 * (menu, rodapé, home, /areas-de-atuacao e rotas /areas-de-atuacao/[slug]).
 *
 * O Supabase (`practice_areas`) só complementa o conteúdo de cada área (texto,
 * serviços, imagem) quando houver uma linha com o mesmo slug; área do banco que
 * não está nesta lista não é exibida. Sem banco, as páginas usam os dados daqui.
 *
 * `image` é a arte do card na home (4:3, em public/images).
 */
export const practiceAreas = [
  {
    slug: "direito-tributario",
    title: "Direito Tributário",
    shortDescription: "Planejamento e defesa fiscal para empresas e pessoas físicas.",
    icon: "receipt",
    image: "/images/home-areas-direito-tributario.jpg",
  },
  {
    slug: "direito-civil",
    title: "Direito Cível",
    shortDescription: "Obrigações, responsabilidade civil e proteção patrimonial.",
    icon: "scale",
    image: "/images/home-areas-direito-civil.jpg",
  },
  {
    slug: "direito-contratual",
    title: "Direito Contratual",
    shortDescription: "Elaboração, revisão e negociação de contratos.",
    icon: "shield-check",
    image: "/images/home-areas-direito-contratual.jpg",
  },
  {
    slug: "direito-empresarial",
    title: "Direito Empresarial",
    shortDescription: "Societário, governança e o dia a dia jurídico da empresa.",
    icon: "briefcase",
    image: "/images/home-areas-direito-empresarial.jpg",
  },
  {
    slug: "direito-administrativo",
    title: "Direito Administrativo",
    shortDescription: "Atuação perante a administração pública e em licitações.",
    icon: "landmark",
    image: "/images/home-areas-direito-administrativo.jpg",
  },
  {
    slug: "direito-trabalhista",
    title: "Direito Trabalhista",
    shortDescription: "Consultoria preventiva e defesa nas relações de trabalho.",
    icon: "hard-hat",
    image: "/images/home-areas-direito-trabalhista.jpg",
  },
  {
    slug: "direito-do-agronegocio",
    title: "Direito do Agronegócio",
    shortDescription: "Segurança jurídica para o produtor rural e toda a cadeia do agro.",
    icon: "sprout",
    image: "/images/home-areas-direito-do-agronegocio.jpg",
  },
] as const;

/** Menu principal — ordem fixa em todas as páginas (padroes-de-projeto.md §4). */
export type NavItem = {
  label: string;
  href: string;
  /** Só "Áreas de Atuação" abre submenu com as especialidades (padroes §4). */
  hasDropdown?: boolean;
};

export const mainNav: readonly NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Áreas de Atuação", href: "/areas-de-atuacao", hasDropdown: true },
  { label: "Nosso Time", href: "/equipe" },
  { label: "Conteúdo Jurídico", href: "/artigos" },
  { label: "Contato", href: "/contato" },
];

/** Colunas do rodapé (prd.md §6.13). */
export const footerNav = {
  navegacao: [
    { label: "Início", href: "/" },
    { label: "Quem Somos", href: "/quem-somos" },
    { label: "Nosso Time", href: "/equipe" },
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
