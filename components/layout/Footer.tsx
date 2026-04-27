import Link from 'next/link';
import { NewsletterForm } from './NewsletterForm';
import { Logo } from './Logo';
import { getT } from '@/lib/i18n/server';

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

/**
 * Construit les colonnes — toutes les routes sont vérifiées et fonctionnelles.
 *
 * Structure éditoriale :
 *  - Maison : qui nous sommes (récit, transmission)
 *  - Découvrir : ce que nous proposons (produit, image)
 *  - Service : ce que nous tenons (transactionnel, support)
 */
function buildColumns(t: (k: string) => string): FooterColumn[] {
  return [
    {
      title: t('footer.colMaison'),
      links: [
        { label: 'La Maison', href: '/maison' },
        { label: 'Atelier', href: '/savoir-faire' },
        { label: 'Journal', href: '/journal' },
        { label: 'Calendrier', href: '/evenements' },
        { label: 'Revue de presse', href: '/presse' },
      ],
    },
    {
      title: t('footer.colDecouvrir'),
      links: [
        { label: 'Collections', href: '/collections' },
        { label: 'Boutique', href: '/boutique' },
        { label: 'Lookbook', href: '/lookbook' },
        { label: 'Sur-mesure', href: '/sur-mesure' },
      ],
    },
    {
      title: t('footer.colService'),
      links: [
        { label: 'Guide des tailles', href: '/guide-tailles' },
        { label: 'Livraison & retours', href: '/livraison-retours' },
        { label: 'Initier un retour', href: '/retours/demande' },
        { label: 'Questions fréquentes', href: '/faq' },
        { label: 'Mon compte', href: '/compte' },
        { label: 'Nous écrire', href: '/contact' },
      ],
    },
  ];
}

const legalLinks: FooterLink[] = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'CGV', href: '/cgv' },
  { label: 'Confidentialité', href: '/confidentialite' },
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
  const columns = buildColumns(t);

  return (
    <footer
      className="relative bg-noir text-ivoire"
      aria-labelledby="footer-title"
    >
      <h2 id="footer-title" className="sr-only">
        Pied de page — Chams Adams
      </h2>

      {/* ───────────── BANDEAU NEWSLETTER pleine largeur ───────────── */}
      <section
        aria-labelledby="newsletter-title"
        className="border-t border-bronze/20 bg-noir/80 py-[80px] md:py-[120px]"
      >
        <div className="container-content grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
              {t('footer.newsletterEyebrow')}
            </span>
            <h3
              id="newsletter-title"
              className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2rem,4.5vw,3.25rem)]"
            >
              {t('footer.newsletterTitle')}
            </h3>
            <p className="max-w-prose font-serif italic text-ivoire/65 text-lg leading-relaxed">
              {t('footer.newsletterSubtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7 lg:justify-center">
            <NewsletterForm />
            <ul
              aria-label="Réseaux sociaux"
              className="flex items-center gap-2"
            >
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-cursor="hover"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bronze/30 text-ivoire/70 transition-all duration-300 hover:border-or hover:text-or"
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Filet d'or séparateur */}
      <div aria-hidden className="h-px w-full bg-or/20" />

      {/* ───────────── 3 COLONNES VERBALES ───────────── */}
      <section className="container-content py-[80px] md:py-[100px]">
        <div className="grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-12 md:gap-y-0">
          {columns.map((col) => (
            <details
              key={col.title}
              className="group border-b border-bronze/15 py-4 md:border-0 md:py-0 md:[&>summary]:pointer-events-none md:[&>summary]:cursor-default md:open:!flex md:!flex flex-col"
              open
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-[11px] uppercase tracking-[0.3em] text-or md:mb-6">
                {col.title}
                <span
                  aria-hidden
                  className="ml-2 inline-block h-px w-3 bg-ivoire transition-transform duration-300 group-open:rotate-90 md:hidden"
                />
              </summary>
              <ul className="mt-4 flex flex-col gap-3 md:!mt-0">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor="hover"
                      className="inline-block font-serif text-base text-ivoire/70 transition-colors duration-300 hover:text-or"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      {/* ───────────── SIGNATURE MAISON ───────────── */}
      <section className="border-t border-bronze/15 bg-noir py-[80px] md:py-[120px]">
        <div className="container-content flex flex-col items-center gap-8 text-center">
          <Logo as="div" variant="wordmark" size={64} className="text-ivoire" />
          <p className="font-script text-3xl text-or md:text-4xl">
            {t('footer.foundedIn')} {FOUNDED_YEAR}
          </p>
          <p className="max-w-md font-serif italic text-ivoire/55">
            Chams Adams · Paris · Dakar — une maison de couture qui prend le
            temps des mains, des mesures, du tombé.
          </p>
        </div>
      </section>

      {/* ───────────── MENTIONS BASSES (compact) ───────────── */}
      <div className="border-t border-bronze/15">
        <div className="container-content flex flex-col items-start justify-between gap-4 py-6 text-xs lg:flex-row lg:items-center">
          <p className="font-sans uppercase tracking-[0.15em] text-ivoire/50">
            © {currentYear} Chams Adams · {t('footer.rightsReserved')}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans uppercase tracking-[0.15em] text-ivoire/50">
            {legalLinks.map((link) => (
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
