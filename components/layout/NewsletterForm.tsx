'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    try {
      // TODO: brancher Resend côté API (étape ultérieure).
      await new Promise((r) => setTimeout(r, 600));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  const disabled = status === 'submitting';

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <label className="sr-only" htmlFor="newsletter-email">
        Adresse de courriel
      </label>
      <div className="flex items-end gap-3 border-b border-bronze/40 pb-2 transition-colors duration-300 focus-within:border-or">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre adresse"
          disabled={disabled}
          data-cursor="hover"
          className="min-w-0 flex-1 bg-transparent font-sans text-sm text-ivoire placeholder:text-ivoire/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={disabled || !email}
          data-cursor="hover"
          className={cn(
            'shrink-0 font-sans text-xs uppercase tracking-[0.2em] text-or transition-all duration-400 ease-out-quart',
            'hover:-translate-y-0.5',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {status === 'submitting' ? 'Transmission…' : 'Transmettre'}
        </button>
      </div>
      <p
        className={cn(
          'font-sans text-xs tracking-wide transition-colors duration-300',
          status === 'success' && 'text-or',
          status === 'error' && 'text-destructive',
          status === 'idle' && 'text-ivoire/40',
          status === 'submitting' && 'text-ivoire/40'
        )}
        role="status"
        aria-live="polite"
      >
        {status === 'success' && 'Correspondance reçue. Vous êtes des nôtres.'}
        {status === 'error' && 'Un nœud s\u2019est formé. Recommencez.'}
        {(status === 'idle' || status === 'submitting') &&
          'Vos données demeurent privées. Désinscription d\u2019un seul geste.'}
      </p>
    </form>
  );
}
