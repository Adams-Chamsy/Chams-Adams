'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookHeart } from 'lucide-react';
import { createCarnetFromWishlistAction } from '@/app/(marketing)/compte/carnets/actions';
import type { EventType } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

const TYPE_LABEL: Record<EventType, string> = {
  mariage: 'Mariage',
  tabaski: 'Tabaski',
  magal: 'Magal',
  maouloud: 'Maouloud',
  bapteme: 'Baptême',
  ceremonie: 'Cérémonie',
  autre: 'Autre',
};

type Props = {
  productSlugs: string[];
  onCreated?: () => void;
};

type State = 'idle' | 'form' | 'submitting' | 'unauth' | 'error';

/**
 * CTA dans le drawer wishlist : convertit les pièces en attente en carnet
 * de cérémonie partageable. Demande nom + type d'événement minimum.
 */
export function WishlistToCarnet({ productSlugs, onCreated }: Props) {
  const router = useRouter();
  const [state, setState] = useState<State>('idle');
  const [name, setName] = useState('');
  const [type, setType] = useState<EventType>('mariage');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setState('submitting');
    setError(null);
    try {
      const res = await createCarnetFromWishlistAction({
        event_name: name,
        event_type: type,
        event_date: date || null,
        product_slugs: productSlugs,
      });
      if (!res.ok) {
        if (res.error === 'Connexion requise.') {
          setState('unauth');
          return;
        }
        setError(res.error);
        setState('error');
        return;
      }
      onCreated?.();
      router.push(`/compte/carnets/${res.slug}`);
    } catch {
      setError('Erreur.');
      setState('error');
    }
  }

  if (state === 'unauth') {
    return (
      <div className="flex flex-col gap-2">
        <p className="font-serif italic text-sm text-ivoire/80">
          Connectez-vous pour transformer vos envies en carnet de cérémonie.
        </p>
        <Link
          href="/compte/connexion?next=/wishlist"
          className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
        >
          Se connecter →
        </Link>
      </div>
    );
  }

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={() => setState('form')}
        className="inline-flex w-full items-center justify-center gap-2 border border-or/60 px-5 py-3 font-sans text-xs uppercase tracking-[0.2em] text-or transition-colors hover:bg-or/10"
      >
        <BookHeart className="h-4 w-4" aria-hidden />
        Créer un carnet de cérémonie
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/60">
          Nom de l&apos;événement
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Mariage de Aïssatou"
          className="border-b border-bronze/40 bg-transparent py-1.5 font-serif text-sm text-ivoire focus:border-or focus:outline-none"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/60">
            Type
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
            className="border-b border-bronze/40 bg-transparent py-1.5 font-serif text-sm text-ivoire focus:border-or focus:outline-none"
          >
            {(Object.entries(TYPE_LABEL) as [EventType, string][]).map(
              ([v, l]) => (
                <option key={v} value={v} className="bg-noir">
                  {l}
                </option>
              )
            )}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/60">
            Date (optionnel)
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-b border-bronze/40 bg-transparent py-1.5 font-serif text-sm text-ivoire focus:border-or focus:outline-none"
          />
        </label>
      </div>
      {error && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={state === 'submitting' || !name.trim()}
          className={cn(
            'flex-1 border border-or bg-or px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-noir disabled:opacity-50',
            state === 'submitting' && 'animate-pulse'
          )}
        >
          {state === 'submitting' ? 'Création…' : 'Créer le carnet'}
        </button>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/60 hover:text-ivoire"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
