import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { PressEntryRow } from '@/lib/supabase/types';
import { PressForm } from '../PressForm';
import { updatePressAction } from '../actions';

export default async function AdminPressEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('press_entries')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) notFound();

  const bound = updatePressAction.bind(null, id);

  return (
    <section className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/press"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Revue de presse
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Éditer une parution
        </h1>
      </header>
      <PressForm action={bound} initial={data as PressEntryRow} submitLabel="Mettre à jour" />
    </section>
  );
}
