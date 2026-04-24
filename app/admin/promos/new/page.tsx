import Link from 'next/link';
import { PromoForm } from '../PromoForm';
import { createPromoAction } from '../actions';

export default function AdminPromoNewPage() {
  return (
    <section className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/promos"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Codes promo
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Nouveau code promo
        </h1>
      </header>
      <PromoForm action={createPromoAction} submitLabel="Créer" />
    </section>
  );
}
