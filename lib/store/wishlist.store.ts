'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Store Zustand de la wishlist. Persiste sur localStorage.
 *
 * Différent du panier : pas de quantité, pas de taille/variante — juste un
 * bookmark par produit. L'utilisateur peut ensuite cliquer dessus pour revenir
 * à la fiche et composer.
 */
export interface WishlistItem {
  productId: string;
  productSlug: string;
  productName: string;
  productSubtitle?: string;
  /** Prix en cents — pour affichage */
  price: number;
  currency: 'EUR' | 'XOF' | 'USD';
  image: { url: string; alt: string };
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  isOpen: boolean;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
}

const STORAGE_KEY = 'chams-adams-wishlist';

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      toggleItem: (input) => {
        const exists = get().items.find((i) => i.productId === input.productId);
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== input.productId) });
          // Best-effort serveur (no-op si non auth)
          fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_slug: exists.productSlug }),
          }).catch(() => {});
        } else {
          set({
            items: [...get().items, { ...input, addedAt: new Date().toISOString() }],
          });
        }
      },

      removeItem: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        set({ items: get().items.filter((i) => i.productId !== productId) });
        if (item) {
          fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_slug: item.productSlug }),
          }).catch(() => {});
        }
      },

      has: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);

export function useWishlistCount() {
  return useWishlistStore((s) => s.items.length);
}
