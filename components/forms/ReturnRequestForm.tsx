'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const REASONS: { value: string; label: string }[] = [
  { value: 'taille', label: 'Taille incorrecte' },
  { value: 'qualite', label: 'Question de qualité' },
  { value: 'pas-conforme', label: 'Non conforme à la description' },
  { value: 'changement-avis', label: 'Changement d’avis' },
  { value: 'defaut', label: 'Défaut constaté' },
  { value: 'autre', label: 'Autre' },
];

export function ReturnRequestForm() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState<string>('taille');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId || null,
          email,
          reason,
          details: details || null,
        }),
      });
      if (!res.ok) {
        const { error: err } = await res
          .json()
          .catch(() => ({ error: 'Erreur.' }));
        throw new Error(err);
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur.');
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-or/40 p-8">
        <p className="font-serif text-xl italic text-ivoire">
          Votre demande nous est parvenue.
        </p>
        <p className="mt-3 font-serif italic text-ivoire/70">
          Nous vous répondrons sous 48 h ouvrées avec les instructions de
          renvoi et l&apos;étiquette prépayée.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Field label="N° de commande (optionnel)">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="cs_live_… ou ORD-2026-…"
          className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <Field label="Adresse de courriel">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <Field label="Motif">
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value} className="bg-noir">
              {r.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Précisions (facultatif)">
        <textarea
          rows={5}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          maxLength={2000}
          placeholder="Description, taille reçue, photo si nécessaire (à envoyer en réponse à notre courriel)…"
          className="w-full border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      {error && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={cn(
          'btn-or self-start',
          status === 'submitting' && 'animate-pulse'
        )}
      >
        {status === 'submitting' ? 'Envoi…' : 'Envoyer la demande'}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
    </label>
  );
}
