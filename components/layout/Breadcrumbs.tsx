import Link from 'next/link';
import { cn } from '@/lib/utils';

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
};

/**
 * Fil d'Ariane partagé — utilisé sur Boutique, Collections, Fiches produit
 * et Journal. Dernier item = page courante, rendu en <span> avec
 * aria-current="page".
 */
export function Breadcrumbs({
  items,
  className,
  tone = 'default',
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn(
        'font-sans text-xs uppercase tracking-[0.2em]',
        tone === 'muted' ? 'text-ivoire/50' : 'text-ivoire/60',
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
                  className="transition-colors duration-300 hover:text-or"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && 'text-ivoire')}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="mx-2 text-ivoire/30">
                  ·
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
