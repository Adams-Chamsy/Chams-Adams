'use client';

import { create } from 'zustand';

/**
 * Toast store — store éphémère (pas de persist). Auto-dismiss géré par
 * le composant Toaster via setTimeout.
 */
export type ToastVariant = 'default' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastStore {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id' | 'variant' | 'duration'> & Partial<Toast>) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const toast: Toast = {
      id,
      message: t.message,
      description: t.description,
      variant: t.variant ?? 'default',
      duration: t.duration ?? 4000,
    };
    set({ toasts: [...get().toasts, toast] });
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
  clear: () => set({ toasts: [] }),
}));

/** Helper d'usage simple : `toast('Ajouté à la sélection')`. */
export const toast = {
  default: (message: string, description?: string) =>
    useToastStore.getState().push({ message, description, variant: 'default' }),
  success: (message: string, description?: string) =>
    useToastStore.getState().push({ message, description, variant: 'success' }),
  error: (message: string, description?: string) =>
    useToastStore.getState().push({ message, description, variant: 'error', duration: 6000 }),
};
