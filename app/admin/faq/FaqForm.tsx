'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import type { FaqItemRow } from '@/lib/supabase/types';

const CATEGORIES: { value: FaqItemRow['category']; label: string }[] = [
  { value: 'livraison', label: 'Livraison' },
  { value: 'sur-mesure', label: 'Sur-mesure' },
  { value: 'entretien', label: 'Entretien' },
  { value: 'paiement', label: 'Paiement' },
  { value: 'retours', label: 'Retours & échanges' },
  { value: 'atelier', label: "L'atelier" },
];

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<FaqItemRow>;
  submitLabel?: string;
};

export function FaqForm({ action, initial, submitLabel = 'Enregistrer' }: Props) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Catégorie
        </span>
        <select
          name="category"
          defaultValue={initial?.category ?? 'livraison'}
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} className="bg-noir">
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Question
        </span>
        <input
          type="text"
          name="question"
          required
          defaultValue={initial?.question ?? ''}
          maxLength={250}
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Réponse
        </span>
        <textarea
          name="answer"
          required
          rows={6}
          defaultValue={initial?.answer ?? ''}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
            Ordre d&apos;affichage
          </span>
          <input
            type="number"
            name="sort_order"
            defaultValue={initial?.sort_order ?? 0}
            className="border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none"
          />
        </label>

        <label className="flex cursor-pointer items-center gap-3 pt-6">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? true}
            className="h-4 w-4 accent-or"
          />
          <span className="font-sans text-sm text-ivoire/80">Publiée</span>
        </label>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Submit label={submitLabel} />
        <Link
          href="/admin/faq"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/60 underline-offset-4 hover:text-ivoire hover:underline"
        >
          Annuler
        </Link>
      </div>
    </form>
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
