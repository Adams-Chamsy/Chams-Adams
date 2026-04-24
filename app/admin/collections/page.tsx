import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { CollectionRow } from '@/lib/supabase/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { deleteCollectionAction } from './actions';

async function getItems(): Promise<CollectionRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as CollectionRow[];
}

export default async function AdminCollectionsPage() {
  const items = await getItems();

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow={`Univers — ${items.length}`}
        title="Collections"
        publicHref="/collections"
        publicLabel="Voir /collections"
        action={
          <Link
            href="/admin/collections/new"
            className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </Link>
        }
      />

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">
          Aucune collection. Crée la première.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-bronze/20 border-y border-bronze/20">
          {items.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-6 py-5">
              <div className="flex min-w-0 items-start gap-5">
                {c.hero_image_url ? (
                  <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-noir-800">
                    <Image
                      src={c.hero_image_url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/5] w-16 shrink-0 border border-bronze/20" />
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                    /{c.slug}
                  </span>
                  <p className="font-serif text-lg text-ivoire">{c.name}</p>
                  {c.tagline && (
                    <p className="truncate font-serif italic text-sm text-ivoire/55">
                      {c.tagline}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/collections/${c.id}`}
                  aria-label="Éditer"
                  className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 hover:text-or"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Link>
                <form
                  action={async () => {
                    'use server';
                    await deleteCollectionAction(c.id);
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
