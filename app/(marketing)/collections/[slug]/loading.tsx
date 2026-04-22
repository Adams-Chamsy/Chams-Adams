import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';

export default function CollectionDetailLoading() {
  return (
    <>
      {/* Hero fantôme */}
      <section className="relative flex h-[80vh] min-h-[600px] items-end overflow-hidden bg-noir">
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-gradient-to-b from-bronze/8 via-noir/40 to-noir"
        />
        <div className="container-content relative z-10 flex flex-col gap-6 pb-24">
          <div className="h-3 w-44 animate-pulse bg-bronze/25" />
          <div className="h-3 w-20 animate-pulse bg-or/25" />
          <div className="h-16 w-2/3 animate-pulse bg-ivoire/15 md:h-24" />
          <div className="h-5 w-80 animate-pulse bg-ivoire/10" />
        </div>
      </section>

      {/* Intro éditoriale fantôme */}
      <section className="bg-noir py-[120px] md:py-[160px]">
        <div className="container-content grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="h-3 w-20 animate-pulse bg-or/25" />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="h-8 w-full animate-pulse bg-ivoire/12" />
            <div className="h-8 w-4/5 animate-pulse bg-ivoire/12" />
            <div className="mt-4 h-4 w-full animate-pulse bg-ivoire/8" />
            <div className="h-4 w-3/4 animate-pulse bg-ivoire/8" />
          </div>
        </div>
      </section>

      {/* Grille produits fantôme */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content">
          <span className="sr-only">Chargement de la collection…</span>
          <div className="mb-12 h-8 w-1/3 animate-pulse bg-ivoire/15" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
