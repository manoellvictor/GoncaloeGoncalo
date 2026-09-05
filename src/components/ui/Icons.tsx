import { createElement, type SVGProps } from "react";

/**
 * Ícones de traço (line icons, 1.5px) conforme design-system.md §5.
 * Monocromáticos via `currentColor` — a cor vem do contexto.
 *
 * Todos são decorativos por padrão (`aria-hidden`): quem usa um ícone como
 * único conteúdo de um controle deve fornecer `aria-label` no elemento pai
 * (design-system.md §10).
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={24}
      height={24}
      {...props}
    >
      {children}
    </svg>
  );
}

/* --- Navegação --- */

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m4 12 5 5L20 6" />
  </Icon>
);

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6M12 16.5v.01" />
  </Icon>
);

/* --- Contato --- */

export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
  </Icon>
);

export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
);

export const MapPinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

export const WhatsAppIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 20.5 5 16.4A8.2 8.2 0 1 1 8 19.3l-4.5 1.2Z" />
    <path d="M9 9.2c.3 2.2 3.6 5.5 5.8 5.8.5.1 1.2-.5 1.4-1l-1.9-1-.9.9c-1-.5-2.3-1.8-2.8-2.8l.9-.9-1-1.9c-.5.2-1.1.9-1 1.4Z" />
  </Icon>
);

/* --- Redes sociais --- */

export const LinkedInIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7.5 10.5V17M7.5 7.5v.01M11.5 17v-3.8a2.2 2.2 0 0 1 4.4 0V17M11.5 10.5V17" />
  </Icon>
);

export const InstagramIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5v.01" />
  </Icon>
);

export const YouTubeIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10.5 9.5 5 2.5-5 2.5v-5Z" />
  </Icon>
);

/* --- Valores institucionais (prd.md §6.1) --- */

export const DiamondIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3 9 6-9 12L3 9l9-6Z" />
    <path d="M3 9h18M12 3 8 9l4 12M12 3l4 6-4 12" />
  </Icon>
);

export const UsersIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.3a3.2 3.2 0 0 1 0 5.4M17.5 14.2A5.5 5.5 0 0 1 20.5 19" />
  </Icon>
);

export const TargetIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" />
  </Icon>
);

export const ScaleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4v16M7 20h10M12 6l-6 2M12 6l6 2" />
    <path d="M6 8 3.5 13.5h5L6 8ZM18 8l-2.5 5.5h5L18 8Z" />
  </Icon>
);

/* --- Diferenciais (faixa final da home) --- */

export const SparkleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.3l-1.8-5.7L4.5 10.8 10.2 9 12 3.5Z" />
    <path d="M18.5 16.5 19 18l1.5.5L19 19l-.5 1.5-.5-1.5L16.5 18l1.5-.5.5-1Z" />
  </Icon>
);

export const AwardIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m8.5 13.8-1.4 6.4 4.9-2.6 4.9 2.6-1.4-6.4" />
  </Icon>
);

export const CompassIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </Icon>
);

export const TrendingUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3.5 16.5 5-5 3.5 3.5 7-7" />
    <path d="M15 8h5v5" />
  </Icon>
);

/* --- Estrutura do escritório (prd.md §6.4) --- */

export const BuildingIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 20V6l8-3 8 3v14" />
    <path d="M2.5 20h19M9 20v-4.5h6V20" />
    <path d="M8.5 9.5v.01M12 9.5v.01M15.5 9.5v.01M8.5 13v.01M15.5 13v.01" />
  </Icon>
);

export const CpuIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
    <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
  </Icon>
);

export const ShieldLockIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3Z" />
    <rect x="9.5" y="11" width="5" height="4" rx="1" />
    <path d="M10.5 11V9.8a1.5 1.5 0 0 1 3 0V11" />
  </Icon>
);

/* --- Áreas de atuação (prd.md §6.7) --- */

export const BriefcaseIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="7" width="19" height="13" rx="2" />
    <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7M2.5 12.5h19" />
  </Icon>
);

export const GavelIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m13.5 4.5 6 6-2.5 2.5-6-6 2.5-2.5Z" />
    <path d="m11 9-7 7 3 3 7-7M4 21h8" />
  </Icon>
);

export const HardHatIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 16a8 8 0 0 1 16 0" />
    <path d="M2.5 16h19v2.5h-19zM10 8.2V4.5h4v3.7" />
  </Icon>
);

export const ReceiptIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 3h14v18l-2.3-1.5L14.4 21l-2.4-1.5L9.6 21l-2.3-1.5L5 21V3Z" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </Icon>
);

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3 10.5 9-7 9 7V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5Z" />
    <path d="M9.5 21v-6h5v6" />
  </Icon>
);

export const LandmarkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3 9 9-5.5L21 9M4.5 9v8M9.5 9v8M14.5 9v8M19.5 9v8M2.5 20.5h19" />
  </Icon>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const CartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 4h2.2l2.3 10.5h9.6l2.4-7.5H6" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="17" cy="19" r="1.4" />
  </Icon>
);

/**
 * Registro nome → componente, para conteúdo vindo do banco: a coluna
 * `practice_areas.icon` guarda a chave, não o SVG.
 */
export const iconRegistry = {
  briefcase: BriefcaseIcon,
  gavel: GavelIcon,
  "hard-hat": HardHatIcon,
  receipt: ReceiptIcon,
  home: HomeIcon,
  landmark: LandmarkIcon,
  "shield-check": ShieldCheckIcon,
  cart: CartIcon,
  diamond: DiamondIcon,
  users: UsersIcon,
  target: TargetIcon,
  scale: ScaleIcon,
  sparkle: SparkleIcon,
  award: AwardIcon,
  compass: CompassIcon,
  "trending-up": TrendingUpIcon,
  building: BuildingIcon,
  cpu: CpuIcon,
  "shield-lock": ShieldLockIcon,
} as const;

export type IconName = keyof typeof iconRegistry;

/**
 * Renderiza o ícone correspondente a uma chave vinda do banco.
 *
 * Usa `createElement` em vez de atribuir o componente a uma variável e renderizá-lo
 * como JSX: o compilador do React não consegue provar que a referência é estável e
 * trataria isso como criação de componente durante o render.
 *
 * Chave desconhecida cai na balança — nunca quebra a página por dado ruim.
 */
export function DynamicIcon({
  name,
  ...props
}: {
  /** Chave do registro. `Omit` porque SVGProps já define um `name` conflitante. */
  name: string | null | undefined;
} & Omit<IconProps, "name">) {
  return createElement(iconRegistry[name as IconName] ?? ScaleIcon, props);
}
