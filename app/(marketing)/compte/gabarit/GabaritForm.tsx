'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { saveGabaritAction, type GabaritResult } from './actions';
import type { CustomerMeasurementsRow } from '@/lib/supabase/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong disabled:opacity-60"
    >
      {pending ? 'Enregistrement…' : 'Enregistrer mon gabarit'}
    </button>
  );
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function GabaritForm({
  initial,
}: {
  initial?: CustomerMeasurementsRow | null;
}) {
  const [state, formAction] = useFormState<GabaritResult | null, FormData>(
    saveGabaritAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <NumField
          name="poitrine_cm"
          label="Poitrine"
          defaultValue={initial?.poitrine_cm ?? ''}
        />
        <NumField
          name="taille_cm"
          label="Taille"
          defaultValue={initial?.taille_cm ?? ''}
        />
        <NumField
          name="hanches_cm"
          label="Hanches"
          defaultValue={initial?.hanches_cm ?? ''}
        />
        <NumField
          name="longueur_bras_cm"
          label="Longueur de bras"
          defaultValue={initial?.longueur_bras_cm ?? ''}
        />
        <NumField
          name="longueur_jambe_cm"
          label="Longueur de jambe"
          defaultValue={initial?.longueur_jambe_cm ?? ''}
        />
        <NumField
          name="hauteur_epaule_cm"
          label="Hauteur d'épaule"
          defaultValue={initial?.hauteur_epaule_cm ?? ''}
        />
        <NumField
          name="hauteur_totale_cm"
          label="Hauteur totale"
          defaultValue={initial?.hauteur_totale_cm ?? ''}
        />
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
            Taille préférée (prêt-à-porter)
          </span>
          <select
            name="taille_preferee"
            defaultValue={initial?.taille_preferee ?? ''}
            className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          >
            <option value="" className="bg-noir">—</option>
            {SIZES.map((s) => (
              <option key={s} value={s} className="bg-noir">
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Notes (port habituel, particularités)
        </span>
        <textarea
          name="notes"
          rows={4}
          defaultValue={initial?.notes ?? ''}
          maxLength={500}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      {state && !state.ok && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {state.error}
        </p>
      )}
      {state && state.ok && (
        <p
          role="status"
          className="font-sans text-xs italic text-or"
        >
          Vos mesures sont enregistrées. Elles pré-remplissent vos demandes
          sur-mesure.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function NumField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: number | string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label} (cm)
      </span>
      <input
        type="number"
        name={name}
        step="0.5"
        min="20"
        max="250"
        defaultValue={defaultValue}
        className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
      />
    </label>
  );
}
