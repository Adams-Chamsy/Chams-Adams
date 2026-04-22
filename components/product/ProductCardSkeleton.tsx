import { cn } from '@/lib/utils';

type Props = {
  variant?: 'default' | 'editorial' | 'compact';
  className?: string;
};

/**
 * Placeholder visuel pendant le chargement d'une grille produit.
 * Reprend le ratio 4:5 et les proportions de <ProductCard>.
 */
export function ProductCardSkeleton({
  variant = 'default',
  className,
}: Props) {
  const isEditorial = variant === 'editorial';
  const isCompact = variant === 'compact';

  return (
    <div
      aria-hidden
      role="presentation"
      className={cn('relative block', className)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-bronze/10 via-bronze/[0.04] to-bronze/10" />
      </div>

      {/* Texte */}
      <div className="mt-4 flex flex-col gap-2">
        <div
          className={cn(
            'animate-pulse bg-bronze/20',
            isEditorial ? 'h-6 w-2/3' : isCompact ? 'h-3 w-3/4' : 'h-4 w-3/4'
          )}
        />
        <div
          className={cn(
            'animate-pulse bg-bronze/12',
            isEditorial ? 'h-4 w-1/3 mt-2' : 'h-3 w-1/3'
          )}
        />
      </div>
    </div>
  );
}
