'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/lib/store/wishlist.store';

/**
 * Sync de la wishlist localStorage ↔ Supabase quand le user est authentifié.
 *
 * Stratégie minimaliste :
 *  1. Au mount : pull les slugs serveur (200 OK avec [] si non auth — silent).
 *  2. Push les slugs locaux qui manquent côté serveur.
 *  3. Pull final → si serveur a des items en plus, on les ignore (les détails
 *     produit ne sont pas en BDD côté wishlists, seulement le product_id).
 *     Pour V1, on ne reflète pas le serveur dans le local — l'unification se
 *     fera quand le user clique sur le bouton wishlist d'un produit (le store
 *     ajoute localement ET re-pousse).
 *
 * Monter dans le layout root pour que ça tourne sur toutes les pages.
 */
export function WishlistSync() {
  const items = useWishlistStore((s) => s.items);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    async function sync() {
      try {
        const res = await fetch('/api/wishlist', { method: 'GET' });
        if (!res.ok || cancelled) return;

        const localSlugs = items.map((i) => i.productSlug);
        if (localSlugs.length === 0) return;

        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_slugs: localSlugs }),
        });
      } catch {
        // best-effort, silent
      }
    }

    // Debounce léger pour grouper les ajouts rapprochés
    const id = window.setTimeout(sync, 800);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [items]);

  return null;
}
