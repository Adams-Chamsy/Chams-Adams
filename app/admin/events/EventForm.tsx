'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import type { EventRow } from '@/lib/supabase/types';

const TYPES: { value: EventRow['type']; label: string }[] = [
  { value: 'defile', label: 'Défilé' },
  { value: 'showroom', label: 'Showroom' },
  { value: 'ceremonie', label: 'Cérémonie' },
  { value: 'presse', label: 'Presse' },
  { value: 'collection', label: 'Collection' },
];

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<EventRow>;
  submitLabel?: string;
};

const inputCls =
  'border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none';

export function EventForm({ action, initial, submitLabel = 'Enregistrer' }: Props) {
  const cta = (initial?.cta ?? {}) as { label?: string; href?: string };
  return (
    <form action={action} className="flex flex-col gap-6">
      <Field label="Titre">
        <input type="text" name="title" required defaultValue={initial?.title ?? ''} className={inputCls} />
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Type">
          <select name="type" defaultValue={initial?.type ?? 'ceremonie'} className={inputCls}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-noir">
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Publié">
          <label className="flex items-center gap-3 pt-3">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initial?.published ?? true}
              className="h-4 w-4 accent-or"
            />
            <span className="font-sans text-sm text-ivoire/80">Visible sur le site public</span>
          </label>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Date de début">
          <input
            type="date"
            name="start_date"
            required
            defaultValue={initial?.start_date ?? ''}
            className={inputCls}
          />
        </Field>
        <Field label="Date de fin (optionnelle)">
          <input
            type="date"
            name="end_date"
            defaultValue={initial?.end_date ?? ''}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Field label="Lieu">
          <input type="text" name="location" defaultValue={initial?.location ?? ''} className={inputCls} />
        </Field>
        <Field label="Ville">
          <input type="text" name="city" defaultValue={initial?.city ?? ''} className={inputCls} />
        </Field>
        <Field label="Pays">
          <input type="text" name="country" defaultValue={initial?.country ?? ''} className={inputCls} />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={initial?.description ?? ''}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <fieldset className="flex flex-col gap-4 border border-bronze/20 p-5">
        <legend className="px-2 font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
          Appel à l&apos;action (optionnel)
        </legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Libellé">
            <input
              type="text"
              name="cta_label"
              defaultValue={cta.label ?? ''}
              placeholder="Réserver, En savoir plus…"
              className={inputCls}
            />
          </Field>
          <Field label="Lien (URL ou chemin interne)">
            <input
              type="text"
              name="cta_href"
              defaultValue={cta.href ?? ''}
              placeholder="/contact, https://…"
              className={inputCls}
            />
          </Field>
        </div>
      </fieldset>

      <div className="flex items-center gap-4 pt-4">
        <Submit label={submitLabel} />
        <Link
          href="/admin/events"
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
