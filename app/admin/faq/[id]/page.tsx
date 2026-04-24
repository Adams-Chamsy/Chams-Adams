import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { FaqItemRow } from '@/lib/supabase/types';
import { FaqForm } from '../FaqForm';
import { updateFaqAction } from '../actions';

export default async function AdminFaqEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) notFound();
  const item = data as FaqItemRow;

  const bound = updateFaqAction.bind(null, id);

  return (
    <section className="flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/faq"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← FAQ
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Éditer une question
        </h1>
      </header>

      <FaqForm action={bound} initial={item} submitLabel="Mettre à jour" />
    </section>
  );
}
