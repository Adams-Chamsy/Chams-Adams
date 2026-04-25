'use client';

import { useEffect, useState } from 'react';

type Props = {
  /** ISO date string */
  target: string;
  label?: string;
};

/**
 * Badge discret avec compte à rebours en or — pour les take-overs saisonniers.
 * Mis à jour côté client pour éviter une revalidation serveur permanente.
 */
export function CountdownBadge({ target, label = 'Reste' }: Props) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const targetMs = new Date(target).getTime();
  const diffMs = Math.max(0, targetMs - now);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return (
      <span className="inline-flex items-center gap-2 border border-or/40 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.25em] text-or/80">
        Cérémonie en cours
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 border border-or/60 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.25em] text-or">
      {label} {days} jour{days > 1 ? 's' : ''}
    </span>
  );
}
