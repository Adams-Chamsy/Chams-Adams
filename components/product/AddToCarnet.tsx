'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookHeart, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Carnet = {
  id: string;
  slug: string;
  event_name: string;
  event_type: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error' | 'unauth';

type Props = {
  productSlug: string;
};

/**
 * Bouton "Ajouter à un carnet" — affiche les carnets du user authentifié
 * dans un menu et permet d'y ajouter la pièce courante en un clic.
 *
 * Si non authentifié : redirige vers /compte/connexion en gardant le retour.
 * Si aucun carnet : pointe vers /compte/carnets.
 */
export function AddToCarnet({ productSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [carnets, setCarnets] = useState<Carnet[] | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [addedTo, setAddedTo] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || carnets !== null) return;
    fetch('/api/carnets')
      .then((r) => r.json())
      .then((d) => setCarnets(Array.isArray(d.carnets) ? d.carnets : []))
      .catch(() => setCarnets([]));
  }, [open, carnets]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function add(carnet: Carnet) {
    setStatus('loading');
    try {
      const res = await fetch('/api/carnets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carnet_slug: carnet.slug,
          product_slug: productSlug,
        }),
      });
      if (res.status === 401) {
        setStatus('unauth');
        return;
      }
      if (!res.ok) throw new Error('failed');
      setStatus('success');
      setAddedTo(carnet.event_name);
      window.setTimeout(() => {
        setOpen(false);
        setStatus('idle');
      }, 1200);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 border border-bronze/40 px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-ivoire/80 transition-colors hover:border-or hover:text-or"
      >
        <BookHeart className="h-4 w-4" aria-hidden />
        Ajouter à un carnet
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-30 w-72 border border-bronze/30 bg-noir py-2 shadow-editorial"
        >
          {status === 'success' && addedTo ? (
            <div className="flex items-center gap-2 px-4 py-3 font-serif italic text-or">
              <Check className="h-4 w-4" aria-hidden />
              Ajoutée à « {addedTo} »
            </div>
          ) : status === 'unauth' ? (
            <div className="flex flex-col gap-2 px-4 py-3">
              <p className="font-serif italic text-sm text-ivoire/80">
                Connectez-vous pour ajouter à un carnet.
              </p>
              <Link
                href={`/compte/connexion?next=/produit/${productSlug}`}
                className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
              >
                Se connecter →
              </Link>
            </div>
          ) : carnets === null ? (
            <p className="px-4 py-3 font-serif italic text-sm text-ivoire/60">
              Chargement…
            </p>
          ) : carnets.length === 0 ? (
            <div className="flex flex-col gap-2 px-4 py-3">
              <p className="font-serif italic text-sm text-ivoire/80">
                Aucun carnet pour le moment.
              </p>
              <Link
                href="/compte/carnets"
                className="font-sans text-xs uppercase tracking-[0.2em] text-or hover:underline"
              >
                Créer un carnet →
              </Link>
            </div>
          ) : (
            <ul className="flex max-h-72 flex-col overflow-y-auto">
              {carnets.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={status === 'loading'}
                    onClick={() => add(c)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors',
                      'hover:bg-ivoire/[0.03] hover:text-or',
                      status === 'loading' && 'opacity-60'
                    )}
                  >
                    <span className="font-serif text-sm text-ivoire">
                      {c.event_name}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-ivoire/50">
                      {c.event_type}
                    </span>
                  </button>
                </li>
              ))}
              <li className="border-t border-bronze/20">
                <Link
                  href="/compte/carnets"
                  className="flex items-center gap-2 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/60 hover:text-or"
                >
                  + Nouveau carnet
                </Link>
              </li>
            </ul>
          )}

          {status === 'error' && (
            <p
              role="alert"
              className="border-t border-bronze/20 px-4 py-2 font-sans text-xs italic text-destructive"
            >
              Une erreur est survenue.
            </p>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center text-ivoire/50 hover:text-ivoire"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
