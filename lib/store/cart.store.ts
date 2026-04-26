'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Store Zustand du panier. Persiste automatiquement sur localStorage
 * (clé `chams-adams-cart`). Ne persiste QUE les items — `isOpen` est
 * volontairement éphémère.
 *
 * Prix : stockés en cents (plus petite unité monétaire) pour éviter
 * les float qui provoquent des erreurs d'arrondi (0.1 + 0.2 !== 0.3).
 */
export interface CartItem {
  /** Unique ID = productId__variantId__size__monogram */
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productSubtitle?: string;
  variantId: string;
  variantColor: string;
  variantColorName: string;
  size: string;
  /** Monogramme brodé à la commande (1 à 3 caractères, optionnel) */
  monogram?: string;
  /** En cents (ex: 2800 € → 280000) */
  price: number;
  currency: 'EUR' | 'XOF' | 'USD';
  image: {
    url: string;
    alt: string;
  };
  quantity: number;
  /** ISO string */
  addedAt: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const STORAGE_KEY = 'chams-adams-cart';
const STORE_VERSION = 1;
const MAX_QUANTITY = 10;

export function buildCartItemId(
  productId: string,
  variantId: string,
  size: string,
  monogram?: string
): string {
  const m = (monogram ?? '').trim().toUpperCase();
  return `${productId}__${variantId}__${size}${m ? `__${m}` : ''}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (input) => {
        const id = buildCartItemId(
          input.productId,
          input.variantId,
          input.size,
          input.monogram
        );
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
          // Même combo → on incrémente la quantité (plafonnée à MAX_QUANTITY)
          set({
            items: get().items.map((i) =>
              i.id === id
                ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + input.quantity) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                ...input,
                id,
                quantity: Math.min(MAX_QUANTITY, input.quantity),
                addedAt: new Date().toISOString(),
              },
            ],
          });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(1, Math.min(MAX_QUANTITY, quantity)) }
              : i
          ),
        }),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: STORAGE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      // Ne persiste pas `isOpen` — état volatile
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// --------------------------------------------------------------------
// Hooks dérivés — sélecteurs stables (Zustand memoïse automatiquement)
// --------------------------------------------------------------------

export function useCartCount(): number {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}

/** En cents. */
export function useCartSubtotal(): number {
  return useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
}

export function useCartIsEmpty(): boolean {
  return useCartStore((s) => s.items.length === 0);
}

// --------------------------------------------------------------------
// Helpers non-réactifs (à utiliser hors composants React)
// --------------------------------------------------------------------

export function getCartSnapshot() {
  const state = useCartStore.getState();
  return { items: state.items };
}
