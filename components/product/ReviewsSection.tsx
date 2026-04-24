import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { ProductReviewRow } from '@/lib/supabase/types';
import { ReviewForm } from './ReviewForm';

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} sur 5`} className="inline-flex items-center gap-0.5 text-or">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden className={n <= rating ? 'text-or' : 'text-ivoire/25'}>
          ★
        </span>
      ))}
    </span>
  );
}

async function getReviews(productId: string): Promise<ProductReviewRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false });
  return (data ?? []) as ProductReviewRow[];
}

type Props = {
  productId: string;
  productSlug: string;
  productName: string;
};

export async function ReviewsSection({
  productId,
  productSlug,
  productName,
}: Props) {
  const reviews = await getReviews(productId);
  const average =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <section
      aria-labelledby="reviews-title"
      className="relative bg-noir py-[100px] md:py-[140px]"
    >
      <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
        <header className="flex flex-col gap-6 lg:col-span-5">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Témoignages
          </span>
          <h2
            id="reviews-title"
            className="font-serif font-light leading-[1.1] text-ivoire text-[clamp(2rem,4vw,3rem)]"
          >
            Ce qu&apos;en disent celles et ceux qui portent
          </h2>

          {reviews.length > 0 ? (
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-4xl font-light text-ivoire">
                {average.toFixed(1)}
              </span>
              <Stars rating={Math.round(average)} />
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/50">
                · {reviews.length} avis
              </span>
            </div>
          ) : (
            <p className="font-serif italic text-ivoire/60">
              Aucun avis pour l&apos;instant. Soyez le premier à partager votre
              expérience.
            </p>
          )}

          <div className="mt-4 border-t border-bronze/20 pt-6">
            <h3 className="mb-4 font-sans text-xs uppercase tracking-[0.3em] text-or/80">
              Partager votre avis
            </h3>
            <ReviewForm productSlug={productSlug} productName={productName} />
          </div>
        </header>

        <ul className="flex flex-col divide-y divide-bronze/15 lg:col-span-7">
          {reviews.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 py-8 first:pt-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Stars rating={r.rating} />
                  {r.verified_buyer && (
                    <span className="inline-block border border-or/50 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.25em] text-or">
                      Achat vérifié
                    </span>
                  )}
                </div>
                <time className="font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/50">
                  {DATE_FMT.format(new Date(r.created_at))}
                </time>
              </div>
              {r.title && (
                <p className="font-serif text-lg text-ivoire">{r.title}</p>
              )}
              <p className="font-serif italic leading-relaxed text-ivoire/80">
                {r.body}
              </p>
              <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-ivoire/55">
                — {r.customer_name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
