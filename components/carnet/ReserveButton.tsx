'use client';

import { useState } from 'react';
import { Gift, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  carnetSlug: string;
  productSlug: string;
};

type Status = 'idle' | 'form' | 'submitting' | 'success' | 'error' | 'taken';

export function ReserveButton({ carnetSlug, productSlug }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch('/api/carnets/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carnet_slug: carnetSlug,
          product_slug: productSlug,
          reserver_email: email,
        }),
      });
      if (res.status === 409) {
        setStatus('taken');
        return;
      }
      if (!res.ok) {
        const { error: err } = await res.json().catch(() => ({}));
        throw new Error(err ?? 'Erreur');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur.');
    }
  }

  if (status === 'success') {
    return (
      <p className="inline-flex items-center gap-2 font-serif italic text-sm text-or">
        <Check className="h-4 w-4" aria-hidden />
        Pièce réservée. Le propriétaire du carnet est prévenu.
      </p>
    );
  }

  if (status === 'taken') {
    return (
      <p className="inline-block border border-or/60 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-or">
        Déjà réservée
      </p>
    );
  }

  if (status === 'idle') {
    return (
      <button
        type="button"
        onClick={() => setStatus('form')}
        className="inline-flex items-center gap-2 self-start font-sans text-[11px] uppercase tracking-[0.2em] text-or hover:underline"
      >
        <Gift className="h-3.5 w-3.5" aria-hidden />
        Je veux offrir
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 border border-bronze/30 bg-noir/40 p-3"
    >
      <label className="flex flex-col gap-1">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/60">
          Votre email (pour confirmation)
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="border-b border-bronze/40 bg-transparent py-1.5 font-serif text-sm text-ivoire focus:border-or focus:outline-none"
        />
      </label>
      {error && (
        <p role="alert" className="font-sans text-[11px] italic text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={status === 'submitting' || !email}
          className={cn(
            'border border-or bg-or px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.2em] text-noir disabled:opacity-50',
            status === 'submitting' && 'animate-pulse'
          )}
        >
          {status === 'submitting' ? 'Réservation…' : 'Réserver'}
        </button>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="font-sans text-[10px] uppercase tracking-[0.2em] text-ivoire/60 hover:text-ivoire"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
