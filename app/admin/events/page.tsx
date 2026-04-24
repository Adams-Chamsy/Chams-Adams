import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { EventRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { deleteEventAction } from './actions';

const TYPE_LABELS: Record<EventRow['type'], string> = {
  defile: 'Défilé',
  showroom: 'Showroom',
  ceremonie: 'Cérémonie',
  presse: 'Presse',
  collection: 'Collection',
};

async function getItems(): Promise<EventRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as EventRow[];
}

export default async function AdminEventsPage() {
  const items = await getItems();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`Calendrier — ${items.length}`}
        title="Événements"
        publicHref="/evenements"
        publicLabel="Voir /evenements"
        action={
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">Aucun événement. Crée le premier.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-bronze/20 border-y border-bronze/20">
          {items.map((e) => {
            const past = (e.end_date ?? e.start_date) < today;
            return (
              <li key={e.id} className="flex items-start justify-between gap-6 py-5">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                    {TYPE_LABELS[e.type]} · {e.start_date}
                    {e.end_date ? ` → ${e.end_date}` : ''}
                    {past && (
                      <span className="ml-3 inline-block border border-ivoire/30 px-2 py-0.5 text-ivoire/50">
                        Passé
                      </span>
                    )}
                    {!e.published && (
                      <span className="ml-3 inline-block border border-destructive/50 px-2 py-0.5 text-destructive/70">
                        Non publié
                      </span>
                    )}
                  </span>
                  <p className="font-serif text-lg text-ivoire">{e.title}</p>
                  <p className="truncate font-sans text-sm text-ivoire/55">
                    {[e.location, e.city, e.country].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/events/${e.id}`}
                    aria-label="Éditer"
                    className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 hover:text-or"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await deleteEventAction(e.id);
                    }}
                  >
                    <button
                      type="submit"
                      aria-label="Supprimer"
                      className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
