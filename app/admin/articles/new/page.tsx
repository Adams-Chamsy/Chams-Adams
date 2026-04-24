import Link from 'next/link';
import { ArticleForm } from '../ArticleForm';
import { createArticleAction } from '../actions';

export default function AdminArticleNewPage() {
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
          Nouvel article
        </h1>
      </header>
      <ArticleForm action={createArticleAction} submitLabel="Créer" />
    </section>
  );
}
