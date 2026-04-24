import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { createSupabaseServerClient, isSupabaseEnabled } from '@/lib/supabase/server';
import type { FaqItemRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import { deleteFaqAction } from './actions';

const CATEGORY_LABELS: Record<FaqItemRow['category'], string> = {
  livraison: 'Livraison',
  'sur-mesure': 'Sur-mesure',
  entretien: 'Entretien',
  paiement: 'Paiement',
  retours: 'Retours',
  atelier: 'Atelier',
};

async function getItems(): Promise<FaqItemRow[]> {
  if (!isSupabaseEnabled()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('[admin/faq] list:', error);
    return [];
  }
  return (data ?? []) as FaqItemRow[];
}

export default async function AdminFaqListPage() {
  const items = await getItems();

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`FAQ — ${items.length} entrée${items.length > 1 ? 's' : ''}`}
        title="Questions fréquentes"
        publicHref="/faq"
        publicLabel="Voir /faq"
        action={
          <Link
            href="/admin/faq/new"
            className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucune question pour l&apos;instant. Commence par en créer une.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-bronze/20 border-y border-bronze/20">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-6 py-5"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                  {CATEGORY_LABELS[item.category]}
                  {!item.published && (
                    <span className="ml-3 inline-block border border-ivoire/30 px-2 py-0.5 text-ivoire/60">
                      Brouillon
                    </span>
                  )}
                </span>
                <p className="font-serif text-lg text-ivoire">
                  {item.question}
                </p>
                <p className="truncate font-sans text-sm text-ivoire/55">
                  {item.answer}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/faq/${item.id}`}
                  aria-label="Éditer"
                  className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 transition-colors hover:text-or"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Link>
                <DeleteConfirmButton
                  action={deleteFaqAction.bind(null, item.id)}
                  itemName={item.question}
                  itemLabel="cette question"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
