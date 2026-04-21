'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToastStore, type Toast } from '@/lib/store/toast.store';

const LUXE_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

/**
 * Toaster : rend les toasts empilés en bas à droite (desktop) / bas centré
 * (mobile). Chaque toast auto-dismiss après `duration` ms, pause au hover.
 *
 * Design luxe : fond noir, bordure or 1px, Cormorant pour le message,
 * slide-in depuis la droite avec ease signature.
 */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[300] flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => dismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, paused, dismiss]);

  const isSuccess = toast.variant === 'success';
  const isError = toast.variant === 'error';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      transition={{ duration: 0.5, ease: LUXE_EASE }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      role="status"
      className={cn(
        'pointer-events-auto flex w-full min-w-[280px] max-w-md items-start gap-4 border bg-noir px-5 py-4 shadow-editorial backdrop-blur-sm',
        isSuccess ? 'border-or/80' : isError ? 'border-destructive/60' : 'border-bronze/40'
      )}
    >
      {/* Pictogramme */}
      <span
        aria-hidden
        className={cn(
          'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center',
          isSuccess ? 'text-or' : isError ? 'text-destructive' : 'text-ivoire/60'
        )}
      >
        {isSuccess ? (
          <Check className="h-4 w-4" strokeWidth={1.8} />
        ) : isError ? (
          <AlertCircle className="h-4 w-4" strokeWidth={1.8} />
        ) : (
          <span className="block h-1 w-1 rounded-full bg-current" />
        )}
      </span>

      {/* Message */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p
          className={cn(
            'font-serif text-base leading-snug',
            isSuccess ? 'text-or' : isError ? 'text-destructive' : 'text-ivoire'
          )}
        >
          {toast.message}
        </p>
        {toast.description && (
          <p className="font-sans text-xs italic leading-relaxed text-ivoire/60">
            {toast.description}
          </p>
        )}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Fermer la notification"
        data-cursor="hover"
        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ivoire/50 transition-colors duration-300 hover:text-or"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </motion.div>
  );
}
