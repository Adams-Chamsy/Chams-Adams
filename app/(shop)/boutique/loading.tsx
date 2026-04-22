import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';

export default function BoutiqueLoading() {
  return (
    <>
      {/* Header fantôme */}
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <div aria-hidden className="h-3 w-24 animate-pulse bg-bronze/20" />
          <div className="flex flex-col gap-3">
            <div aria-hidden className="h-4 w-40 animate-pulse bg-or/20" />
            <div
              aria-hidden
              className="h-14 w-1/2 animate-pulse bg-ivoire/15 md:h-20"
            />
            <div
              aria-hidden
              className="mt-2 h-5 w-72 animate-pulse bg-ivoire/10"
            />
          </div>
        </div>
      </section>

      {/* Grille fantôme */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content flex flex-col gap-10 lg:flex-row lg:gap-12">
          {/* Sidebar filtres fantôme (desktop) */}
          <aside
            aria-hidden
            className="hidden w-64 shrink-0 flex-col gap-4 lg:flex"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-28 animate-pulse bg-bronze/20" />
                <div className="h-3 w-40 animate-pulse bg-ivoire/10" />
                <div className="h-3 w-32 animate-pulse bg-ivoire/10" />
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1">
            <span className="sr-only">Chargement des pièces…</span>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
