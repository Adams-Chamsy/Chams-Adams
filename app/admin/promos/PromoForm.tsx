'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import type { PromoCodeRow } from '@/lib/supabase/types';

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<PromoCodeRow>;
  submitLabel?: string;
};

const inputCls =
  'border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none';

export function PromoForm({ action, initial, submitLabel = 'Enregistrer' }: Props) {
  const displayValue = initial?.discount_value
    ? initial.discount_type === 'fixed'
      ? (initial.discount_value / 100).toFixed(2)
      : initial.discount_value.toString()
    : '';
  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_2fr]">
        <Field label="Code">
          <input
            type="text"
            name="code"
            required
            defaultValue={initial?.code ?? ''}
            placeholder="TABASKI25"
            className={inputCls}
            style={{ textTransform: 'uppercase' }}
          />
        </Field>
        <Field label="Libellé (interne)">
          <input
            type="text"
            name="label"
            defaultValue={initial?.label ?? ''}
            placeholder="Tabaski 2026 — 15% sur cérémonies"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Type de réduction">
          <select
            name="discount_type"
            defaultValue={initial?.discount_type ?? 'percent'}
            className={inputCls}
          >
            <option value="percent" className="bg-noir">Pourcentage</option>
            <option value="fixed" className="bg-noir">Montant fixe (€)</option>
          </select>
        </Field>
        <Field label="Valeur">
          <input
            type="number"
            name="discount_value"
            required
            step="0.01"
            min="0"
            defaultValue={displayValue}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Montant min. panier (€)">
          <input
            type="number"
            name="min_amount"
            step="0.01"
            min="0"
            defaultValue={
              initial?.min_amount_cents ? (initial.min_amount_cents / 100).toFixed(2) : '0'
            }
            className={inputCls}
          />
        </Field>
        <Field label="Nombre max d'utilisations (vide = illimité)">
          <input
            type="number"
            name="max_uses"
            min="1"
            defaultValue={initial?.max_uses ?? ''}
            placeholder="100"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Date de début">
          <input
            type="date"
            name="starts_at"
            defaultValue={
              initial?.starts_at ? initial.starts_at.slice(0, 10) : ''
            }
            className={inputCls}
          />
        </Field>
        <Field label="Date de fin (optionnelle)">
          <input
            type="date"
            name="ends_at"
            defaultValue={initial?.ends_at ? initial.ends_at.slice(0, 10) : ''}
            className={inputCls}
          />
        </Field>
      </div>

      <label className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active ?? true}
          className="h-4 w-4 accent-or"
        />
        <span className="font-sans text-sm text-ivoire/80">Actif</span>
      </label>

      <div className="flex items-center gap-4 pt-4">
        <Submit label={submitLabel} />
        <Link
          href="/admin/promos"
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
