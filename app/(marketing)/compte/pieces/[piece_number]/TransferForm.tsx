'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import { transferPieceAction, type TransferResult } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong disabled:opacity-60"
    >
      {pending ? 'Transmission…' : 'Transmettre la pièce'}
    </button>
  );
}

export function TransferForm({ pieceNumber }: { pieceNumber: string }) {
  const [open, setOpen] = useState(false);
  const action = transferPieceAction.bind(null, pieceNumber);
  const [state, formAction] = useFormState<TransferResult | null, FormData>(
    action,
    null
  );

  if (state?.ok) {
    return (
      <p className="font-serif italic text-or">
        La pièce a été transmise. Le nouveau propriétaire est prévenu par
        courriel.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-bronze/40 px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-ivoire/80 hover:border-or hover:text-or"
      >
        <Send className="h-4 w-4" aria-hidden />
        Transmettre cette pièce
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-bronze/30 p-6">
      <p className="font-serif italic text-ivoire/80">
        La transmission lie cette pièce à un nouveau propriétaire. Le registre
        de la pièce reste intact ; un événement « transmission » y est
        enregistré.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Nom complet du nouveau propriétaire
        </span>
        <input
          name="new_owner_name"
          type="text"
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Adresse de courriel du nouveau propriétaire
        </span>
        <input
          name="new_owner_email"
          type="email"
          required
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Mot d&apos;accompagnement (optionnel)
        </span>
        <textarea
          name="note"
          rows={3}
          maxLength={400}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      {state && !state.ok && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60 hover:text-ivoire"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
