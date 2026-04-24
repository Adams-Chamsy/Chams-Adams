'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

type Props = {
  /** Server action déjà bindée avec l'ID (ex: deleteFaqAction.bind(null, id)). */
  action: () => Promise<void> | void;
  /** Label identifiant l'élément à supprimer (ex: "Quels sont vos délais…"). */
  itemName: string;
  /** Nom visuel du type d'élément, injecté dans le titre. Défaut : "cet élément". */
  itemLabel?: string;
};

/**
 * Bouton poubelle qui ouvre une modale de confirmation avant exécution
 * de la server action. Bloque la soumission tant que l'utilisateur n'a
 * pas cliqué "Supprimer" dans la modale.
 *
 * - ESC ferme la modale
 * - Clic backdrop ferme la modale
 * - Focus forcé sur "Annuler" à l'ouverture
 * - Body-scroll verrouillé pendant l'ouverture
 */
export function DeleteConfirmButton({
  action,
  itemName,
  itemLabel = 'cet élément',
}: Props) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Focus sur le bouton "Annuler" — comportement le plus safe
    const t = setTimeout(() => cancelRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Supprimer — ${itemName}`}
        title="Supprimer"
        className="inline-flex h-9 w-9 items-center justify-center text-ivoire/70 transition-colors hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-6"
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-noir/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
              className="relative z-[1] w-full max-w-md border border-destructive/40 bg-[#0F0E0C] p-8 shadow-editorial"
            >
              <div className="mb-5 flex flex-col gap-1">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-destructive">
                  Suppression définitive
                </span>
                <h2
                  id="delete-confirm-title"
                  className="font-serif text-2xl font-light text-ivoire"
                >
                  Supprimer {itemLabel} ?
                </h2>
              </div>
              <p
                id="delete-confirm-desc"
                className="mb-8 font-serif italic leading-relaxed text-ivoire/75"
              >
                Vous êtes sur le point de supprimer définitivement{' '}
                <strong className="not-italic text-ivoire">
                  «&nbsp;{itemName}&nbsp;»
                </strong>
                . Cette action est irréversible.
              </p>

              <form action={action} className="flex flex-wrap justify-end gap-3">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 font-sans text-xs uppercase tracking-[0.2em] text-ivoire/70 transition-colors hover:text-ivoire"
                >
                  Annuler
                </button>
                <Confirm />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Confirm() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center border border-destructive bg-destructive/90 px-5 py-2.5 font-sans text-xs uppercase tracking-[0.2em] text-ivoire transition-colors hover:bg-destructive disabled:opacity-50"
    >
      {pending ? 'Suppression…' : 'Supprimer définitivement'}
    </button>
  );
}
