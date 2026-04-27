import Link from 'next/link';
import { NewsletterForm } from './NewsletterForm';
import { Logo } from './Logo';
import { getT } from '@/lib/i18n/server';

type FooterLink = { label: string; href: string };

/**
 * Footer — option B (refonte minimaliste).
 *
 * 4 sections respirées, codes magazine print :
 *  1. Newsletter centrée (signature de la marque)
 *  2. Une seule ligne de nav horizontale (8 entrées max)
 *  3. Wordmark XL + Italianno tagline + réseaux sobres
 *  4. Mentions légales compactes
 *
 * Tous les liens vérifiés et fonctionnels.
 */
const PRIMARY_LINKS: FooterLink[] = [
  { label: 'Maison', href: '/maison' },
  { label: 'Atelier', href: '/savoir-faire' },
  { label: 'Collections', href: '/collections' },
  { label: 'Boutique', href: '/boutique' },
  { label: 'Sur-mesure', href: '/sur-mesure' },
  { label: 'Journal', href: '/journal' },
  { label: 'Mon compte', href: '/compte' },
  { label: 'Nous écrire', href: '/contact' },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'CGV', href: '/cgv' },
  { label: 'Confidentialité', href: '/confidentialite' },
  { label: 'Livraison & retours', href: '/livraison-retours' },
];

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/chams_adams',
    Icon: InstagramIcon,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/',
    Icon: TikTokIcon,
  },
  {
    label: 'Pinterest',
    href: 'https://www.pinterest.com/',
    Icon: PinterestIcon,
  },
];

const FOUNDED_YEAR = 2018;
const currentYear = new Date().getFullYear();

export function Footer() {
  const t = getT();

  return (
    <footer
      className="relative overflow-hidden bg-noir text-ivoire"
      aria-labelledby="footer-title"
    >
      <h2 id="footer-title" className="sr-only">
        Pied de page — Chams Adams
      </h2>

      {/* ───────────── 1. NEWSLETTER (centrée, signature) ───────────── */}
      <section
        aria-labelledby="newsletter-title"
        className="border-t border-bronze/20 py-[120px] md:py-[160px]"
      >
        <div className="container-content flex flex-col items-center gap-7 text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
            {t('footer.newsletterEyebrow')}
          </span>
          <h3
            id="newsletter-title"
            className="max-w-2xl font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.25rem,5vw,3.75rem)]"
          >
            {t('footer.newsletterTitle')}
          </h3>
          <p className="max-w-prose font-serif italic text-ivoire/65 text-lg">
            {t('footer.newsletterSubtitle')}
          </p>
          <div className="mt-4 w-full max-w-lg">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ───────────── 2. NAV HORIZONTALE (1 ligne) ───────────── */}
      <nav
        aria-label="Navigation pied de page"
        className="container-content border-t border-bronze/15 py-10"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12">
          {PRIMARY_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                data-cursor="hover"
                className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70 transition-colors duration-300 hover:text-or"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ───────────── 3. SIGNATURE — wordmark XL ───────────── */}
      <section className="relative py-[100px] md:py-[140px]">
        <div className="container-content flex flex-col items-center gap-10 text-center">
          {/* Mobile : 120px ; Desktop : 200px (signature massive) */}
          <Logo
            as="div"
            variant="wordmark"
            size={120}
            className="text-ivoire opacity-90 md:hidden"
          />
          <Logo
            as="div"
            variant="wordmark"
            size={200}
            className="hidden text-ivoire opacity-90 md:inline-flex"
          />
          <p className="font-script text-3xl text-or md:text-5xl">
            {t('footer.foundedIn')} {FOUNDED_YEAR}
          </p>

          {/* Réseaux nus, sobres */}
          <ul aria-label="Réseaux sociaux" className="mt-2 flex items-center gap-6">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-cursor="hover"
                  className="inline-flex h-8 w-8 items-center justify-center text-ivoire/40 transition-colors duration-300 hover:text-or"
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── 4. MENTIONS BASSES ───────────── */}
      <div className="border-t border-bronze/15">
        <div className="container-content flex flex-col items-center justify-between gap-4 py-6 text-xs lg:flex-row">
          <p className="font-sans uppercase tracking-[0.15em] text-ivoire/45">
            © {currentYear} Chams Adams · {t('footer.rightsReserved')}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans uppercase tracking-[0.15em] text-ivoire/45">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-cursor="hover"
                  className="transition-colors duration-300 hover:text-or"
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

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.32 6.14a5.48 5.48 0 0 1-3.77-1.43 5.5 5.5 0 0 1-1.68-2.71H10.2v12.3a2.8 2.8 0 1 1-2-2.68V8.3a6.12 6.12 0 1 0 5.65 6.1V9.43a8.59 8.59 0 0 0 5.47 1.88V7.65a5.52 5.52 0 0 1 0-1.51Z" />
    </svg>
  );
}

function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a10 10 0 0 0-3.64 19.32c-.09-.77-.17-1.95.03-2.79.19-.78 1.23-4.98 1.23-4.98s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.5-.25 1.05.53 1.9 1.56 1.9 1.87 0 3.31-1.97 3.31-4.82 0-2.52-1.81-4.28-4.4-4.28a4.56 4.56 0 0 0-4.76 4.57c0 .91.35 1.88.79 2.41.09.1.1.2.07.3-.08.32-.25 1.05-.29 1.2-.05.2-.15.24-.35.14-1.3-.6-2.11-2.5-2.11-4.03 0-3.28 2.39-6.3 6.89-6.3 3.62 0 6.43 2.58 6.43 6.02 0 3.59-2.27 6.49-5.42 6.49-1.06 0-2.05-.55-2.39-1.2l-.65 2.48c-.23.9-.86 2.03-1.29 2.72A10 10 0 1 0 12 2Z" />
    </svg>
  );
}
