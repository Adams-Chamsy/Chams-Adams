import Link from 'next/link';
import { Check, BadgeCheck } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { ProductReviewRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import {
  approveReviewAction,
  deleteReviewAction,
  rejectReviewAction,
  toggleVerifiedBuyerAction,
} from './actions';
import { cn } from '@/lib/utils';

type Row = ProductReviewRow & { product: { slug: string; name: string } | null };

async function getReviews(
  filter: 'pending' | 'approved' | 'all'
): Promise<Row[]> {
  const supabase = createSupabaseServiceClient();
  let q = supabase
    .from('product_reviews')
    .select('*, product:products(slug, name)')
    .order('created_at', { ascending: false });
  if (filter === 'pending') q = q.eq('approved', false);
  if (filter === 'approved') q = q.eq('approved', true);
  const { data } = await q;
  return (data ?? []) as unknown as Row[];
}

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const FILTERS = [
  { value: 'pending', label: 'À modérer' },
  { value: 'approved', label: 'Approuvées' },
  { value: 'all', label: 'Toutes' },
] as const;

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n}/5`} className="inline-flex items-center gap-0.5 text-or">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? 'text-or' : 'text-ivoire/25'}>★</span>
      ))}
    </span>
  );
}

export default async function AdminReviewsPage(props: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await props.searchParams;
  const filter = (params.filter as 'pending' | 'approved' | 'all' | undefined) ?? 'pending';
  const items = await getReviews(filter);
  const pending = items.filter((r) => !r.approved).length;

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`Modération — ${pending} en attente`}
        title="Témoignages"
      />

      <nav className="flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'pending' ? '/admin/reviews' : `/admin/reviews?filter=${f.value}`}
            className={cn(
              'border px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] transition-colors',
              filter === f.value
                ? 'border-or bg-or text-noir'
                : 'border-bronze/40 text-ivoire/70 hover:border-or hover:text-or'
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          {filter === 'pending'
            ? 'Aucun avis en attente — tout est à jour.'
            : 'Aucun avis pour ce filtre.'}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-bronze/20 border-y border-bronze/20">
          {items.map((r) => (
            <li key={r.id} className="flex flex-col gap-3 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <Stars n={r.rating} />
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/55">
                  {r.customer_name}
                </span>
                <span className="font-sans text-[11px] text-ivoire/40">·</span>
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/55">
                  {DATE_FMT.format(new Date(r.created_at))}
                </span>
                {r.product && (
                  <>
                    <span className="font-sans text-[11px] text-ivoire/40">·</span>
                    <Link
                      href={`/produit/${r.product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[11px] text-or hover:underline"
                    >
                      {r.product.name}
                    </Link>
                  </>
                )}
                {r.approved ? (
                  <span className="inline-flex items-center gap-1 border border-or/50 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.2em] text-or">
                    <Check className="h-3 w-3" aria-hidden />
                    Publié
                  </span>
                ) : (
                  <span className="inline-block border border-ivoire/30 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.2em] text-ivoire/60">
                    En attente
                  </span>
                )}
                {r.verified_buyer && (
                  <span className="inline-flex items-center gap-1 border border-or/30 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.2em] text-or/80">
                    <BadgeCheck className="h-3 w-3" aria-hidden />
                    Vérifié
                  </span>
                )}
              </div>

              {r.title && (
                <p className="font-serif text-lg text-ivoire">{r.title}</p>
              )}
              <p className="font-serif italic leading-relaxed text-ivoire/80">
                {r.body}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4">
                {r.approved ? (
                  <form action={rejectReviewAction.bind(null, r.id)}>
                    <button
                      type="submit"
                      className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60 hover:text-destructive"
                    >
                      Dépublier
                    </button>
                  </form>
                ) : (
                  <form action={approveReviewAction.bind(null, r.id, r.product?.slug ?? null)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 border border-or bg-or px-4 py-1.5 font-sans text-xs uppercase tracking-[0.2em] text-noir hover:shadow-halo-or-strong"
                    >
                      Approuver
                    </button>
                  </form>
                )}
                <form action={toggleVerifiedBuyerAction.bind(null, r.id, r.verified_buyer)}>
                  <button
                    type="submit"
                    className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60 hover:text-or"
                  >
                    {r.verified_buyer ? 'Retirer "vérifié"' : 'Marquer vérifié'}
                  </button>
                </form>
                <DeleteConfirmButton
                  action={deleteReviewAction.bind(null, r.id)}
                  itemName={r.title ?? r.body.slice(0, 60)}
                  itemLabel="cet avis"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
