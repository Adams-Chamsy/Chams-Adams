'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ConsentCategory = 'analytics' | 'marketing';

export interface ConsentState {
  /** `null` = pas encore choisi (afficher le bandeau). */
  accepted: Record<ConsentCategory, boolean> | null;
  /** Horodatage ISO de la dernière décision (utile pour le RGPD — preuve). */
  decidedAt: string | null;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: Record<ConsentCategory, boolean>) => void;
  reopen: () => void;
}

const STORAGE_KEY = 'chams-adams:consent';

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      accepted: null,
      decidedAt: null,
      acceptAll: () =>
        set({
          accepted: { analytics: true, marketing: true },
          decidedAt: new Date().toISOString(),
        }),
      rejectAll: () =>
        set({
          accepted: { analytics: false, marketing: false },
          decidedAt: new Date().toISOString(),
        }),
      savePreferences: (prefs) =>
        set({
          accepted: prefs,
          decidedAt: new Date().toISOString(),
        }),
      reopen: () => set({ accepted: null, decidedAt: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
