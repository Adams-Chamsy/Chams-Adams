import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { CollectionRow } from '@/lib/supabase/types';
import { CollectionForm } from '../CollectionForm';
import { updateCollectionAction } from '../actions';

export default async function AdminCollectionEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) notFound();
  const item = data as CollectionRow;

  const bound = updateCollectionAction.bind(null, id);

  return (
    <section className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/collections"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Collections
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Éditer « {item.name} »
        </h1>
        <p className="font-serif italic text-sm text-ivoire/60">
          Après publication,{' '}
          <Link
            href={`/collections/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="not-italic inline-flex items-center gap-1 text-or underline decoration-1 underline-offset-4 hover:text-ivoire"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            voir /collections/{item.slug}
          </Link>
        </p>
      </header>
      <CollectionForm action={bound} initial={item} submitLabel="Mettre à jour" />
    </section>
  );
}
