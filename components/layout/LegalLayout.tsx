import { cn } from '@/lib/utils';

type LegalLayoutProps = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

/**
 * Layout partagé pour pages légales (Mentions, CGV, Confidentialité,
 * Livraison & retours). Typographie Cormorant sur les titres, prose
 * sobre en Inter pour le corps. Contraste AA garanti sur noir.
 */
export function LegalLayout({
  eyebrow,
  title,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <section className="relative bg-noir py-[120px] md:py-[160px]">
      <div className="container-content flex flex-col gap-12 lg:flex-row lg:gap-24">
        {/* Colonne titre — sticky sur desktop */}
        <header className="flex flex-col gap-5 lg:sticky lg:top-[120px] lg:h-fit lg:w-[32%] lg:flex-shrink-0">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            {eyebrow}
          </span>
          <h1 className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5vw,4rem)]">
            {title}
          </h1>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/50">
            Dernière mise à jour : {lastUpdated}
          </p>
        </header>

        {/* Prose */}
        <div className={cn('flex-1', 'legal-prose')}>{children}</div>
      </div>

      {/* Styles prose encapsulés — pas besoin de Tailwind Typography plugin */}
      <style>{`
        .legal-prose {
          color: rgba(245, 240, 230, 0.8);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.75;
        }
        .legal-prose h2 {
          font-family: var(--font-cormorant), Georgia, serif;
          font-weight: 300;
          color: #F5F0E6;
          font-size: clamp(1.5rem, 2.4vw, 2rem);
          line-height: 1.2;
          margin-top: 3.5rem;
          margin-bottom: 1rem;
        }
        .legal-prose h2:first-child {
          margin-top: 0;
        }
        .legal-prose h3 {
          font-family: var(--font-cormorant), Georgia, serif;
          font-weight: 400;
          color: rgba(245, 240, 230, 0.95);
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .legal-prose p {
          margin-bottom: 1.25rem;
        }
        .legal-prose strong {
          color: #F5F0E6;
          font-weight: 500;
        }
        .legal-prose em {
          color: rgba(201, 169, 97, 0.9);
          font-style: italic;
        }
        .legal-prose a {
          color: #C9A961;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          transition: color 300ms;
        }
        .legal-prose a:hover {
          color: rgba(201, 169, 97, 0.7);
        }
        .legal-prose ul,
        .legal-prose ol {
          margin: 1rem 0 1.5rem 1.25rem;
          padding: 0;
        }
        .legal-prose ul {
          list-style: '— ';
        }
        .legal-prose ol {
          list-style: decimal;
        }
        .legal-prose li {
          margin-bottom: 0.5rem;
          padding-left: 0.25rem;
        }
        .legal-prose hr {
          border: 0;
          border-top: 1px solid rgba(74, 55, 40, 0.3);
          margin: 3rem 0;
        }
        .legal-prose blockquote {
          border-left: 2px solid rgba(201, 169, 97, 0.4);
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgba(245, 240, 230, 0.7);
        }
        .legal-prose .callout {
          border: 1px solid rgba(201, 169, 97, 0.3);
          background: rgba(201, 169, 97, 0.04);
          padding: 1.25rem 1.5rem;
          margin: 2rem 0;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .legal-prose .callout strong {
          color: #C9A961;
        }
      `}</style>
    </section>
  );
}
