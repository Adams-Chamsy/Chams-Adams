import Link from 'next/link';
import { COLLECTIONS } from '@/lib/data/collections.mock';
import { ProductForm } from '../ProductForm';
import { createProductAction } from '../actions';

export default function AdminProductNewPage() {
  const collections = COLLECTIONS.map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <section className="flex max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/products"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Produits
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Nouveau produit
        </h1>
      </header>
      <ProductForm action={createProductAction} collections={collections} submitLabel="Créer" />
    </section>
  );
}
