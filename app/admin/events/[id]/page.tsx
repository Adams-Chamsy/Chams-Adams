import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { EventRow } from '@/lib/supabase/types';
import { EventForm } from '../EventForm';
import { updateEventAction } from '../actions';

export default async function AdminEventEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  if (error || !data) notFound();

  const bound = updateEventAction.bind(null, id);

  return (
    <section className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/events"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Événements
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Éditer un événement
        </h1>
      </header>
      <EventForm action={bound} initial={data as EventRow} submitLabel="Mettre à jour" />
    </section>
  );
}
