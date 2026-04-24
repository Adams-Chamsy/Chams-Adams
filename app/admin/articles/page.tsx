import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { ArticleRow } from '@/lib/supabase/types';
import { deleteArticleAction } from './actions';

async function getItems(): Promise<ArticleRow[]> {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as ArticleRow[];
}

export default async function AdminArticlesPage() {
  const items = await getItems();

  return (
    <section className="flex flex-col gap-8">
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Journal — {items.length}
          </span>
          <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
            Articles
          </h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Nouvel article
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="font-serif italic text-ivoire/60">Aucun article. Écris le premier.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-bronze/20 border-y border-bronze/20">
          {items.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-6 py-5">
              <div className="flex min-w-0 items-start gap-5">
                {a.cover_image_url ? (
                  <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-noir-800">
                    <Image
                      src={a.cover_image_url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] w-16 shrink-0 border border-bronze/20" />
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
                    {a.category ?? '—'}
                    {a.published ? (
                      <span className="ml-3 inline-block border border-or/60 px-2 py-0.5 text-or">
                        Publié
                      </span>
                    ) : (
                      <span className="ml-3 inline-block border border-ivoire/30 px-2 py-0.5 text-ivoire/60">
                        Brouillon
                      </span>
                    )}
                  </span>
                  <p className="font-serif text-lg text-ivoire">{a.title}</p>
                  {a.excerpt && (
                    <p className="max-w-prose truncate font-sans text-sm italic text-ivoire/55">
                      {a.excerpt}
                    </p>
                  )}
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/40">
                    /journal/{a.slug}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/articles/${a.id}`}
                  aria-label="Éditer"
                  className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 hover:text-or"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Link>
                <form
                  action={async () => {
                    'use server';
                    await deleteArticleAction(a.id);
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
