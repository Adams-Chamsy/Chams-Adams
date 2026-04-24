import Link from 'next/link';
import { PressForm } from '../PressForm';
import { createPressAction } from '../actions';

export default function AdminPressNewPage() {
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
          Nouvelle parution
        </h1>
      </header>
      <PressForm action={createPressAction} submitLabel="Créer" />
    </section>
  );
}
