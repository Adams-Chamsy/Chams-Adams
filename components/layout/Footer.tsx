import Link from 'next/link';
import { NewsletterForm } from './NewsletterForm';
import { Logo } from './Logo';

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const columns: FooterColumn[] = [
  {
    title: 'Maison',
    links: [
      { label: 'La Maison', href: '/maison' },
      { label: 'Savoir-faire', href: '/savoir-faire' },
      { label: 'Nos artisans', href: '/savoir-faire#artisans' },
      { label: 'Journal', href: '/journal' },
      { label: 'Calendrier', href: '/evenements' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { label: 'Cérémonies', href: '/collections/ceremonies' },
      { label: 'Tabaski & Magal', href: '/collections/tabaski-magal' },
      { label: 'Prêt-à-porter', href: '/collections/pret-a-porter' },
      { label: 'Sur-mesure', href: '/sur-mesure' },
    ],
  },
  {
    title: 'Service',
    links: [
      { label: 'Prise de mesures', href: '/sur-mesure/mesures' },
      { label: 'Guide des tailles', href: '/guide-tailles' },
      { label: 'Livraison & retours', href: '/livraison-retours' },
      { label: 'Questions fréquentes', href: '/faq' },
      { label: 'Mon compte', href: '/compte' },
      { label: 'Nous contacter', href: '/contact' },
      { label: 'Revue de presse', href: '/presse' },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'CGV', href: '/cgv' },
  { label: 'Politique de confidentialité', href: '/confidentialite' },
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

const foundedYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-noir pt-[120px] pb-12 text-ivoire" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Pied de page — Chams Adams
      </h2>

      <div className="container-wide flex flex-col gap-16">
        {/* Grille principale */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-4 lg:gap-y-0">
          {/* Newsletter — en tête mobile, 4e colonne desktop */}
          <section
            aria-labelledby="newsletter-title"
            className="order-first flex flex-col gap-6 lg:order-none lg:col-start-4 lg:row-start-1"
          >
            <header className="flex flex-col gap-2">
              <h3
                id="newsletter-title"
                className="font-serif text-2xl font-light text-ivoire"
              >
                Recevoir nos correspondances
              </h3>
              <p className="max-w-prose font-serif italic text-ivoire/60">
                L&apos;élégance par l&apos;écrit, tous les mois.
              </p>
            </header>
            <NewsletterForm />
            <ul className="mt-2 flex items-center gap-4">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-cursor="hover"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire/60 transition-colors duration-300 hover:text-or"
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Colonnes de navigation — accordéons sur mobile, toujours ouvertes sur desktop */}
          {columns.map((col, i) => (
            <details
              key={col.title}
              className="group border-b border-bronze/15 py-4 lg:border-0 lg:py-0 lg:[&>summary]:pointer-events-none lg:[&>summary]:cursor-default"
              style={{ order: i + 1 }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-xs uppercase tracking-[0.2em] text-ivoire lg:mb-6">
                {col.title}
                <span
                  aria-hidden
                  className="ml-2 inline-block h-px w-3 bg-ivoire transition-transform duration-300 group-open:rotate-90 lg:hidden"
                />
              </summary>
              <ul className="mt-4 flex flex-col gap-3 lg:!mt-0 lg:!flex">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor="hover"
                      className="inline-block font-serif text-base text-ivoire/60 transition-colors duration-300 hover:text-ivoire"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* Signature maison : monogramme or + wordmark script + italianno fondation */}
        <div className="flex flex-col items-start justify-between gap-10 border-t border-bronze/15 pt-12 lg:flex-row lg:items-end">
          <Logo as="div" variant="stacked" size={88} className="items-start" />
          <p className="font-script text-3xl text-or lg:text-4xl">
            Maison fondée en {foundedYear}
          </p>
        </div>

        {/* Séparateur or */}
        <div aria-hidden className="h-px w-full bg-or/20" />

        {/* Mentions basses */}
        <div className="flex flex-col items-start justify-between gap-4 pb-2 text-xs lg:flex-row lg:items-center">
          <p className="font-sans uppercase tracking-[0.15em] text-ivoire/60">
            © {foundedYear} Chams Adams — Tous droits réservés
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans uppercase tracking-[0.15em] text-ivoire/60">
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
            <li>
              <button
                type="button"
                data-cursor="hover"
                className="inline-flex items-center gap-2 uppercase tracking-[0.15em] transition-colors duration-300 hover:text-or"
              >
                <span aria-current="true" className="text-ivoire">
                  FR
                </span>
                <span aria-hidden>/</span>
                <span>EN</span>
              </button>
            </li>
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
