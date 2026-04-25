import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { SeasonalTakeoverRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import {
  deleteTakeoverAction,
  togglePublishedAction,
} from './actions';

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

async function getTakeovers(): Promise<SeasonalTakeoverRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase
    .from('seasonal_takeovers')
    .select('*')
    .order('event_date', { ascending: true });
  return (data ?? []) as SeasonalTakeoverRow[];
}

export default async function AdminTakeoversPage() {
  const items = await getTakeovers();

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`${items.length} take-over${items.length > 1 ? 's' : ''}`}
        title="Cérémonies — sélections saisonnières"
        action={
          <Link
            href="/admin/takeovers/new"
            className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nouveau
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucune cérémonie programmée. Créez une sélection Tabaski, Magal ou
          mariage de saison.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-bronze/25 text-left font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                <th className="py-3 pr-4 font-normal">Titre</th>
                <th className="py-3 pr-4 font-normal">Type</th>
                <th className="py-3 pr-4 font-normal">Date</th>
                <th className="py-3 pr-4 font-normal">Pièces</th>
                <th className="py-3 pr-4 font-normal">Publié</th>
                <th className="py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="font-serif text-ivoire">
              {items.map((t) => (
                <tr key={t.id} className="border-b border-bronze/10">
                  <td className="py-4 pr-4 text-sm">
                    {t.title}
                    <div className="text-xs italic text-ivoire/60">
                      /ceremonies/{t.slug}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm">{t.event_type}</td>
                  <td className="py-4 pr-4 font-sans text-xs text-ivoire/60">
                    {DATE_FMT.format(new Date(t.event_date))}
                  </td>
                  <td className="py-4 pr-4 text-sm">
                    {t.curated_product_slugs.length}
                  </td>
                  <td className="py-4 pr-4">
                    <form
                      action={togglePublishedAction.bind(
                        null,
                        t.id,
                        !t.published
                      )}
                    >
                      <button
                        type="submit"
                        className={`border px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] ${
                          t.published
                            ? 'border-or text-or'
                            : 'border-ivoire/30 text-ivoire/60'
                        }`}
                      >
                        {t.published ? 'En ligne' : 'Brouillon'}
                      </button>
                    </form>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/ceremonies/${t.slug}`}
                        className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
                      >
                        Voir
                      </Link>
                      <DeleteConfirmButton
                        action={deleteTakeoverAction.bind(null, t.id)}
                        itemName={t.title}
                        itemLabel="cette sélection"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
