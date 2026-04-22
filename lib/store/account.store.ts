'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Compte client léger — purement local (localStorage). Pas d'authentification,
 * pas de synchro multi-appareil. Destiné à être remplacé par un vrai système
 * d'auth (Supabase / Clerk / Shopify Customer) quand la décision sera prise.
 *
 * Sert à :
 *  - Saluer l'utilisateur par son pseudonyme sur la page /compte
 *  - Stocker ses préférences (langue future, notifications newsletter)
 *  - Offrir un bouton "supprimer toutes mes données locales" (RGPD friendly)
 */
export interface AccountState {
  pseudonyme: string;
  locale: 'fr' | 'en';
  newsletterSubscribed: boolean;
  createdAt: string | null;
  setPseudonyme: (v: string) => void;
  setLocale: (v: 'fr' | 'en') => void;
  setNewsletter: (v: boolean) => void;
  reset: () => void;
}

const STORAGE_KEY = 'chams-adams:account';

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      pseudonyme: '',
      locale: 'fr',
      newsletterSubscribed: false,
      createdAt: null,
      setPseudonyme: (pseudonyme) => {
        const createdAt = get().createdAt ?? new Date().toISOString();
        set({ pseudonyme, createdAt });
      },
      setLocale: (locale) => set({ locale }),
      setNewsletter: (newsletterSubscribed) => set({ newsletterSubscribed }),
      reset: () =>
        set({
          pseudonyme: '',
          locale: 'fr',
          newsletterSubscribed: false,
          createdAt: null,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
