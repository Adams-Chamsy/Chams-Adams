import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { createGiftCardAction } from '../actions';

export default function NewGiftCardPage() {
  return (
    <section className="flex flex-col gap-8 max-w-2xl">
      <AdminPageHeader
        eyebrow="Émettre"
        title="Nouvelle carte cadeau"
        action={
          <Link
            href="/admin/gift-cards"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour
          </Link>
        }
      />

      <form action={createGiftCardAction} className="flex flex-col gap-6">
        <Field label="Montant en €" hint="Entre 10 et 5000 €">
          <input
            name="amount"
            type="number"
            min={10}
            max={5000}
            step={10}
            required
            defaultValue={250}
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <Field label="Nom du bénéficiaire (optionnel)">
          <input
            name="recipient_name"
            type="text"
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <Field label="Courriel du bénéficiaire (optionnel)">
          <input
            name="recipient_email"
            type="email"
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <Field label="Émetteur (optionnel)">
          <input
            name="sender_name"
            type="text"
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <Field label="Message personnel (optionnel)">
          <textarea
            name="message"
            rows={3}
            className="w-full border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <Field label="Date d'expiration (optionnel)">
          <input
            name="expires_at"
            type="date"
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <button
          type="submit"
          className="self-start border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
        >
          Émettre la carte
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
      {hint && (
        <span className="font-sans text-[10px] italic text-ivoire/50">
          {hint}
        </span>
      )}
    </label>
  );
}
