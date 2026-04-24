import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { ArticleRow } from '@/lib/supabase/types';
import { ArticleForm } from '../ArticleForm';
import { updateArticleAction } from '../actions';

export default async function AdminArticleEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
  if (error || !data) notFound();

  const bound = updateArticleAction.bind(null, id);

  return (
    <section className="flex max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/articles"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Articles
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Éditer un article
        </h1>
      </header>
      <ArticleForm action={bound} initial={data as ArticleRow} submitLabel="Mettre à jour" />
    </section>
  );
}
