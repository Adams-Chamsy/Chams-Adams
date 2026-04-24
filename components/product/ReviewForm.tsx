'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ReviewForm({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (rating < 1) {
      setServerError('Merci de choisir une note.');
      return;
    }
    const fd = new FormData(e.currentTarget);
    const payload = {
      product_slug: productSlug,
      customer_name: (fd.get('customer_name') as string)?.trim(),
      customer_email: (fd.get('customer_email') as string)?.trim() || undefined,
      title: (fd.get('title') as string)?.trim() || undefined,
      body: (fd.get('body') as string)?.trim(),
      rating,
    };
    setStatus('submitting');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Erreur inconnue.' }));
        throw new Error(error);
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Erreur.');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-3 border border-or/40 p-6">
        <p className="font-serif text-ivoire">Merci pour votre témoignage.</p>
        <p className="font-serif italic text-sm text-ivoire/70">
          Il sera visible ici dès qu&apos;il aura été relu par la Maison.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Étoiles */}
      <div className="flex items-center gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Note
        </span>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className={cn(
                'h-8 w-8 text-xl transition-colors',
                n <= (hovered || rating) ? 'text-or' : 'text-ivoire/30 hover:text-or/60'
              )}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Votre prénom
        </span>
        <input
          type="text"
          name="customer_name"
          required
          maxLength={80}
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Courriel (optionnel, non affiché)
        </span>
        <input
          type="email"
          name="customer_email"
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Titre (optionnel)
        </span>
        <input
          type="text"
          name="title"
          maxLength={120}
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Votre témoignage (20 car. min.)
        </span>
        <textarea
          name="body"
          rows={5}
          required
          minLength={20}
          maxLength={3000}
          placeholder={`Partagez votre expérience avec ${productName}…`}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire placeholder:italic placeholder:text-ivoire/35 focus:border-or focus:outline-none"
        />
      </label>

      {serverError && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={cn(
          'btn-or mt-2 self-start disabled:opacity-50',
          status === 'submitting' && 'animate-pulse'
        )}
      >
        {status === 'submitting' ? 'Envoi…' : 'Publier mon témoignage'}
      </button>
    </form>
  );
}
