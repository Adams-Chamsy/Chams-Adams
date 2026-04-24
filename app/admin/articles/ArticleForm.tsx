'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { TiptapEditor } from '@/components/admin/TiptapEditor';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { ArticleRow } from '@/lib/supabase/types';

const CATEGORIES = [
  'Portrait',
  'Héritage',
  'Inspiration',
  'Coulisses',
  'Événements',
];

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<ArticleRow>;
  submitLabel?: string;
};

const inputCls =
  'border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none';

export function ArticleForm({ action, initial, submitLabel = 'Enregistrer' }: Props) {
  return (
    <form action={action} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Field label="Titre">
          <input
            type="text"
            name="title"
            required
            defaultValue={initial?.title ?? ''}
            className={inputCls}
          />
        </Field>
        <Field label="Slug (URL — auto si vide)">
          <input
            type="text"
            name="slug"
            defaultValue={initial?.slug ?? ''}
            placeholder="portrait-fatou-diagne"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Field label="Catégorie">
          <select name="category" defaultValue={initial?.category ?? 'Portrait'} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-noir">
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Temps de lecture (min)">
          <input
            type="number"
            name="reading_time"
            defaultValue={initial?.reading_time ?? 5}
            min={1}
            max={60}
            className={inputCls}
          />
        </Field>
        <Field label="Publié">
          <label className="flex items-center gap-3 pt-3">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initial?.published ?? false}
              className="h-4 w-4 accent-or"
            />
            <span className="font-sans text-sm text-ivoire/80">Visible dans le Journal public</span>
          </label>
        </Field>
      </div>

      <Field label="Chapeau">
        <textarea
          name="excerpt"
          rows={3}
          defaultValue={initial?.excerpt ?? ''}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <ImageUploadField
        name="cover_image_url"
        label="Image de couverture"
        initialUrl={initial?.cover_image_url}
        folder="articles"
        aspect="aspect-[21/9]"
      />

      <Field label="Texte alternatif image de couverture">
        <input
          type="text"
          name="cover_image_alt"
          defaultValue={initial?.cover_image_alt ?? ''}
          className={inputCls}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Corps de l&apos;article
        </span>
        <TiptapEditor
          name="body_json"
          initialJson={initial?.body_json}
          placeholder="Commencez à écrire votre article…"
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Submit label={submitLabel} />
        <Link
          href="/admin/articles"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/60 hover:text-ivoire"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong disabled:opacity-50"
    >
      {pending ? 'Enregistrement…' : label}
    </button>
  );
}
