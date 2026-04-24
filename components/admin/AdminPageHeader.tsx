import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

type Props = {
  eyebrow: string;
  title: string;
  /** Lien vers la page publique équivalente (ouvre dans un nouvel onglet). */
  publicHref?: string;
  /** Label custom pour le lien. Défaut : "Voir le résultat sur le site". */
  publicLabel?: string;
  /** Bouton à droite du titre (ex: + Ajouter). */
  action?: React.ReactNode;
};

/**
 * Header partagé pour les pages admin — titre + eyebrow + lien direct vers
 * la page publique concernée pour vérifier instantanément la modification.
 */
export function AdminPageHeader({
  eyebrow,
  title,
  publicHref,
  publicLabel,
  action,
}: Props) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          {eyebrow}
        </span>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          {title}
        </h1>
        {publicHref && (
          <p className="font-serif italic text-sm text-ivoire/60">
            Les modifications sont visibles en direct —{' '}
            <Link
              href={publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className="not-italic inline-flex items-center gap-1 text-or underline decoration-1 underline-offset-4 hover:text-ivoire"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {publicLabel ?? 'Voir sur le site public'}
            </Link>
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
