import Link from 'next/link';
import { cn } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/json-ld';

export type BreadcrumbItem = {
  label: string;
  /** Omettre `href` marque l'élément comme page courante (non cliquable). */
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  /** Teinte alternative pour fonds clairs (inutile ici, kept for future). */
  tone?: 'default' | 'muted';
  /** Désactive l'émission du JSON-LD BreadcrumbList (utile si déjà couvert ailleurs). */
  skipJsonLd?: boolean;
};

/**
 * Fil d'Ariane — codes magazine print, ultra-luxe.
 *
 * Choix typographiques :
 *  - 10px (au lieu de 12px) — lecture noble, présence discrète
 *  - tracking 0.3em — large respiration entre lettres, codes editorial
 *  - small-caps via uppercase + tabular-nums pour l'alignement
 *  - séparateur trait fin diagonal (slash/) plutôt qu'un point
 *  - hiérarchie d'opacité : passé 40%, courant 75%, séparateur 25%
 *  - hover : transition vers or, soulignement très fin (1px) animé
 *
 * Le dernier item = page courante, rendu en <span> avec aria-current="page".
 */
export function Breadcrumbs({
  items,
  className,
  tone = 'default',
  skipJsonLd,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <>
      {!skipJsonLd && <JsonLd data={breadcrumbSchema(items)} />}
      <nav
        aria-label="Fil d'Ariane"
        className={cn(
          'font-sans text-[10px] uppercase tracking-[0.3em]',
          tone === 'muted' ? 'text-ivoire/35' : 'text-ivoire/45',
          className
        )}
      >
        <ol className="flex flex-wrap items-center gap-y-1">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className="flex items-center">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    data-cursor="hover"
                    className="link-editorial relative"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(isLast && 'text-ivoire/75')}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span
                    aria-hidden
                    className="mx-3 select-none text-ivoire/25"
                  >
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
