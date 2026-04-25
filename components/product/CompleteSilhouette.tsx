import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/data/products';
import { getPrimaryImage } from '@/lib/types/product';
import { Price } from '@/components/ui/Price';

type Props = {
  silhouetteSlugs: string[];
};

/**
 * Section "Pour parfaire la silhouette" — produits curés manuellement
 * par la maison pour compléter la pièce courante (chaussures, bijoux,
 * foulard de tête, broderie assortie).
 *
 * Curation manuelle = jamais d'algorithme. Différencie le luxe.
 */
export async function CompleteSilhouette({ silhouetteSlugs }: Props) {
  if (!silhouetteSlugs || silhouetteSlugs.length === 0) return null;

  const products = await Promise.all(
    silhouetteSlugs.slice(0, 3).map((slug) => getProductBySlug(slug))
  );
  const valid = products.filter((p): p is NonNullable<typeof p> => !!p);
  if (valid.length === 0) return null;

  return (
    <section
      aria-labelledby="silhouette-title"
      className="bg-noir py-[100px] md:py-[140px]"
    >
      <div className="container-content">
        <header className="mb-12 flex flex-col gap-3 md:mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Curation maison
          </span>
          <h2
            id="silhouette-title"
            className="font-serif font-light text-ivoire text-[clamp(1.75rem,3.5vw,3rem)] leading-tight"
          >
            Pour parfaire la silhouette
          </h2>
        </header>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {valid.map((p) => {
            const img = getPrimaryImage(p);
            return (
              <li key={p.id}>
                <Link
                  href={`/produit/${p.slug}`}
                  data-cursor="hover"
                  className="group flex flex-col gap-4"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif font-light text-ivoire text-xl transition-colors duration-300 group-hover:text-or">
                      {p.name}
                    </h3>
                    {p.subtitle && (
                      <p className="font-serif italic text-sm text-ivoire/60">
                        {p.subtitle}
                      </p>
                    )}
                    <p className="mt-1 font-sans text-sm tracking-[0.1em] text-ivoire/80">
                      <Price
                        cents={Math.round(p.price.amount * 100)}
                        baseCurrency={p.price.currency}
                      />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
