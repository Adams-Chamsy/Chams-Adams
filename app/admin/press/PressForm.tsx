'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import type { PressEntryRow } from '@/lib/supabase/types';

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<PressEntryRow>;
  submitLabel?: string;
};

const inputCls =
  'border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none';

export function PressForm({ action, initial, submitLabel = 'Enregistrer' }: Props) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Publication">
          <input
            type="text"
            name="publication"
            required
            defaultValue={initial?.publication ?? ''}
            className={inputCls}
          />
        </Field>
        <Field label="Texte logo (affichage typo)">
          <input
            type="text"
            name="logo_text"
            defaultValue={initial?.logo_text ?? ''}
            placeholder="VOGUE, M, Nataal…"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Date de parution">
          <input
            type="date"
            name="published_at"
            required
            defaultValue={initial?.published_at ?? ''}
            className={inputCls}
          />
        </Field>
        <Field label="Mise en avant">
          <label className="flex items-center gap-3 pt-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initial?.featured ?? false}
              className="h-4 w-4 accent-or"
            />
            <span className="font-sans text-sm text-ivoire/80">Featured card (en haut)</span>
          </label>
        </Field>
      </div>

      <Field label="Titre de l'article">
        <input
          type="text"
          name="title"
          required
          defaultValue={initial?.title ?? ''}
          className={inputCls}
        />
      </Field>

      <Field label="Citation / extrait">
        <textarea
          name="excerpt"
          rows={4}
          defaultValue={initial?.excerpt ?? ''}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <Field label="URL de l'article (optionnel)">
        <input
          type="url"
          name="article_url"
          defaultValue={initial?.article_url ?? ''}
          placeholder="https://…"
          className={inputCls}
        />
      </Field>

      <div className="flex items-center gap-4 pt-4">
        <Submit label={submitLabel} />
        <Link
          href="/admin/press"
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
