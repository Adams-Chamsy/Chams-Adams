import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  href: string;
  label: string;
  className?: string;
};

/**
 * Lien de retour discret type magazine print — flèche fine + libellé en
 * italique, opacité faible, hover or.
 *
 * À utiliser ponctuellement en haut de pages où le parent est utile :
 * fiche produit ("← Boutique"), article journal ("← Journal"),
 * collection ("← Collections").
 *
 * Codes Dior / Bottega : pas de fil d'Ariane complet, juste un retour
 * contextuel quand il a du sens.
 */
export function BackLink({ href, label, className }: Props) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      className={cn(
        'group inline-flex items-center gap-2 font-serif text-sm italic text-ivoire/55 transition-colors duration-300 hover:text-or',
        className
      )}
    >
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
      >
        ←
      </span>
      <span>{label}</span>
    </Link>
  );
}
