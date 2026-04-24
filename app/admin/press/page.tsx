import Link from 'next/link';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { PressEntryRow } from '@/lib/supabase/types';
import { deletePressAction } from './actions';

async function getItems(): Promise<PressEntryRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('press_entries')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as PressEntryRow[];
}

export default async function AdminPressListPage() {
  const items = await getItems();

  return (
    <section className="flex flex-col gap-8">
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Parutions — {items.length}
          </span>
          <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
            Revue de presse
          </h1>
        </div>
        <Link
          href="/admin/press/new"
          className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Ajouter
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">Aucune parution. Crée la première.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-bronze/20 border-y border-bronze/20">
          {items.map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-6 py-5">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                  {p.publication}
                  <span>·</span>
                  <span>{p.published_at}</span>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 text-or">
                      <Star className="h-3 w-3" aria-hidden />
                      Featured
                    </span>
                  )}
                </span>
                <p className="font-serif text-lg text-ivoire">{p.title}</p>
                {p.excerpt && (
                  <p className="truncate font-sans text-sm italic text-ivoire/55">{p.excerpt}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/press/${p.id}`}
                  aria-label="Éditer"
                  className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 hover:text-or"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Link>
                <form
                  action={async () => {
                    'use server';
                    await deletePressAction(p.id);
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
          ))}
        </ul>
      )}
    </section>
  );
}
