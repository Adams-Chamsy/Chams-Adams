'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type Props = {
  productSlug: string;
  productName: string;
  variantId?: string | null;
  size?: string | null;
  /** Variante non dispo uniquement (ex: en rupture) ou produit entier en pré-commande. */
  label?: string;
};

export function WaitlistForm({
  productSlug,
  productName,
  variantId,
  size,
  label = 'Prévenez-moi quand c’est disponible',
}: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ product_slug: productSlug });
    if (size) params.set('size', size);
    fetch(`/api/waitlist/count?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((d) => setCount(typeof d.count === 'number' ? d.count : 0))
      .catch(() => setCount(0));
  }, [productSlug, size]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_slug: productSlug,
          variant_id: variantId ?? undefined,
          size: size ?? undefined,
          email,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Erreur.' }));
        throw new Error(error);
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur.');
    }
  }

  if (status === 'success') {
    return (
      <p className="border border-or/40 p-4 font-serif italic text-ivoire/80">
        Nous vous préviendrons dès que {productName} sera à nouveau disponible.
      </p>
    );
  }

  if (!open) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 self-start border border-or/60 px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-or transition-colors hover:bg-or/10"
        >
          <Bell className="h-4 w-4" aria-hidden />
          {label}
        </button>
        {count !== null && count >= 5 && (
          <p className="font-serif italic text-xs text-ivoire/60">
            {count} personnes attendent {size ? `la taille ${size}` : 'cette pièce'}.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Votre courriel
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </label>
      {error && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn('btn-or', status === 'submitting' && 'animate-pulse')}
        >
          {status === 'submitting' ? 'Envoi…' : 'Me prévenir'}
        </button>
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
