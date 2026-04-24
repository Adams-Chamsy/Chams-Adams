import Link from 'next/link';
import { EventForm } from '../EventForm';
import { createEventAction } from '../actions';

export default function AdminEventNewPage() {
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
          Nouvel événement
        </h1>
      </header>
      <EventForm action={createEventAction} submitLabel="Créer" />
    </section>
  );
}
