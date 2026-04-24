import Link from 'next/link';
import { FaqForm } from '../FaqForm';
import { createFaqAction } from '../actions';

export default function AdminFaqNewPage() {
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
          Nouvelle question
        </h1>
      </header>

      <FaqForm action={createFaqAction} submitLabel="Créer" />
    </section>
  );
}
