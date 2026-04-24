import Link from 'next/link';
import { CollectionForm } from '../CollectionForm';
import { createCollectionAction } from '../actions';

export default function AdminCollectionNewPage() {
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
          Nouvelle collection
        </h1>
      </header>
      <CollectionForm action={createCollectionAction} submitLabel="Créer" />
    </section>
  );
}
