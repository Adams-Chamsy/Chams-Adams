'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { CollectionRow } from '@/lib/supabase/types';

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<CollectionRow>;
  submitLabel?: string;
};

const inputCls =
  'border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none';

export function CollectionForm({ action, initial, submitLabel = 'Enregistrer' }: Props) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Field label="Nom">
          <input type="text" name="name" required defaultValue={initial?.name ?? ''} className={inputCls} />
        </Field>
        <Field label="Slug (auto si vide)">
          <input
            type="text"
            name="slug"
            defaultValue={initial?.slug ?? ''}
            placeholder="ceremonies"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Accroche">
        <input
          type="text"
          name="tagline"
          defaultValue={initial?.tagline ?? ''}
          placeholder="Le kaftan des plus grands jours"
          className={inputCls}
        />
      </Field>

      <Field label="Description courte">
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ''}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <Field label="Description longue">
        <textarea
          name="long_description"
          rows={6}
          defaultValue={initial?.long_description ?? ''}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <ImageUploadField
        name="hero_image_url"
        label="Image hero"
        initialUrl={initial?.hero_image_url}
        folder="collections"
        aspect="aspect-[4/5]"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Texte alternatif image">
          <input
            type="text"
            name="hero_image_alt"
            defaultValue={initial?.hero_image_alt ?? ''}
            className={inputCls}
          />
        </Field>
        <Field label="Ordre d'affichage">
          <input
            type="number"
            name="sort_order"
            defaultValue={initial?.sort_order ?? 0}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Submit label={submitLabel} />
        <Link
          href="/admin/collections"
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
