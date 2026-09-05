import Link from "next/link";
import { Logo } from "./Logo";
import {
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  YouTubeIcon,
} from "@/components/ui/Icons";
import {
  contact,
  footerNav,
  practiceAreaFallback,
  siteConfig,
  social,
} from "@/lib/site-config";

/**
 * Rodapé global — página 12 do sitemap, presente em todas as páginas
 * (prd.md §6.13). Instância única em app/layout.tsx (padroes §2).
 */

const socialIcons = {
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
  YouTube: YouTubeIcon,
} as const;

const columnLink =
  "text-sm text-white/70 transition-colors duration-200 ease-brand hover:text-gold-300";

function Column({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="mb-5 text-eyebrow font-semibold uppercase text-gold-300">
        {title}
      </h2>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} className={columnLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-site py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          {/* Marca + tagline + redes */}
          <div>
            <Logo showTagline />

            <ul className="mt-8 flex gap-3">
              {social.map((item) => {
                const SocialIcon = socialIcons[item.name];
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      aria-label={`${siteConfig.shortName} no ${item.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-sm border border-white/25 text-white transition-colors duration-200 ease-brand hover:border-gold-500 hover:text-gold-300"
                    >
                      <SocialIcon width={20} height={20} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <Column title="Navegação" links={footerNav.navegacao} />

          <Column
            title="Áreas de Atuação"
            links={practiceAreaFallback.map((area) => ({
              label: area.title,
              href: `/areas-de-atuacao/${area.slug}`,
            }))}
          />

          <Column title="Conteúdo" links={footerNav.conteudo} />

          {/* Contato */}
          <div>
            <h2 className="mb-5 text-eyebrow font-semibold uppercase text-gold-300">
              Contato
            </h2>
            <ul className="flex flex-col gap-4 text-sm text-white/70">
              <li>
                <a
                  href={contact.phoneHref}
                  className="flex items-start gap-3 transition-colors duration-200 ease-brand hover:text-gold-300"
                >
                  <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-500" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-3 break-all transition-colors duration-200 ease-brand hover:text-gold-300"
                >
                  <MailIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-500" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPinIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-500" />
                <span>
                  {contact.addressLine}
                  <br />
                  {contact.addressCity}
                  <br />
                  CEP {contact.addressZip}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Linha inferior: copyright + links legais */}
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerNav.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-200 ease-brand hover:text-gold-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
