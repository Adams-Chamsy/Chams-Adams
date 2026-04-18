'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onClose: () => void;
};

const SIZES = [
  { size: 'XS', poitrine: 82, taille: 64, hanches: 88 },
  { size: 'S', poitrine: 86, taille: 68, hanches: 92 },
  { size: 'M', poitrine: 92, taille: 74, hanches: 98 },
  { size: 'L', poitrine: 98, taille: 80, hanches: 104 },
  { size: 'XL', poitrine: 104, taille: 86, hanches: 110 },
  { size: 'XXL', poitrine: 110, taille: 92, hanches: 116 },
];

/**
 * Drawer latéral (slide-from-right) qui présente le guide des tailles.
 * - Focus trap basique : focus envoyé sur le close à l'ouverture,
 *   rendu à l'élément déclencheur à la fermeture (géré côté parent)
 * - ESC pour fermer, backdrop click idem, body-scroll lock
 */
export function SizeGuide({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = orig;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sizeguide-title"
          aria-describedby="sizeguide-help"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200]"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Fermer le guide des tailles"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-noir/70 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-y-0 right-0 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-noir"
          >
            <header className="flex items-start justify-between border-b border-bronze/15 px-6 py-6 md:px-10">
              <div className="flex flex-col gap-1.5">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-or/80">
                  Référence
                </span>
                <h2
                  id="sizeguide-title"
                  className="font-serif font-light text-ivoire text-2xl md:text-3xl"
                >
                  Guide des tailles
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                data-cursor="hover"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </header>

            <div className="flex flex-col gap-8 px-6 py-8 md:px-10">
              <p id="sizeguide-help" className="font-serif italic text-ivoire/70">
                Toutes les mesures sont exprimées en centimètres. Les tailles
                standard sont indicatives ; pour une pièce parfaitement ajustée,
                optez pour le sur-mesure.
              </p>

              {/* Tableau */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-bronze/20 text-[11px] uppercase tracking-[0.2em] text-or/80">
                      <th className="py-3 pr-4 font-sans font-normal">Taille</th>
                      <th className="py-3 pr-4 font-sans font-normal">Poitrine</th>
                      <th className="py-3 pr-4 font-sans font-normal">Taille</th>
                      <th className="py-3 font-sans font-normal">Hanches</th>
                    </tr>
                  </thead>
                  <tbody className="font-serif text-ivoire">
                    {SIZES.map((s) => (
                      <tr
                        key={s.size}
                        className="border-b border-bronze/10 transition-colors duration-200 hover:bg-ivoire/[0.02]"
                      >
                        <td className="py-4 pr-4 text-lg">{s.size}</td>
                        <td className="py-4 pr-4 text-sm text-ivoire/80">{s.poitrine}</td>
                        <td className="py-4 pr-4 text-sm text-ivoire/80">{s.taille}</td>
                        <td className="py-4 text-sm text-ivoire/80">{s.hanches}</td>
                      </tr>
                    ))}
                    <tr className="border-b border-bronze/10">
                      <td className="py-4 pr-4 font-serif italic text-or">Sur-mesure</td>
                      <td colSpan={3} className="py-4 font-sans text-sm italic text-ivoire/60">
                        Vingt-huit points pris en atelier. Aucune grille.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Silhouette schématique + légende */}
              <figure className="flex items-center gap-6 rounded-sm border border-bronze/15 p-5">
                <svg
                  viewBox="0 0 80 200"
                  aria-hidden
                  className="h-32 w-auto shrink-0 text-ivoire/40"
                >
                  <path
                    d="M40 10 L56 40 L66 180 L14 180 L24 40 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <line x1="24" y1="65" x2="56" y2="65" stroke="#C9A961" strokeWidth="1.5" />
                  <line x1="24" y1="100" x2="56" y2="100" stroke="#C9A961" strokeWidth="1.5" />
                  <line x1="18" y1="150" x2="62" y2="150" stroke="#C9A961" strokeWidth="1.5" />
                </svg>
                <dl className="flex flex-col gap-2 font-sans text-xs text-ivoire/70">
                  <div className="flex items-baseline gap-3">
                    <dt className="w-2 shrink-0 bg-or" aria-hidden>
                      <span className="inline-block h-[1.5px] w-full" />
                    </dt>
                    <span>Poitrine (partie la plus large)</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <dt className="w-2 shrink-0 bg-or" aria-hidden>
                      <span className="inline-block h-[1.5px] w-full" />
                    </dt>
                    <span>Taille (partie la plus fine)</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <dt className="w-2 shrink-0 bg-or" aria-hidden>
                      <span className="inline-block h-[1.5px] w-full" />
                    </dt>
                    <span>Hanches (tour des hanches)</span>
                  </div>
                </dl>
              </figure>

              {/* CTA sur-mesure */}
              <div className="flex flex-col gap-4 border-t border-bronze/15 pt-6">
                <p className="font-serif italic text-ivoire/75">
                  Pour une pièce parfaitement ajustée, optez pour le sur-mesure.
                </p>
                <Link
                  href="/sur-mesure"
                  onClick={onClose}
                  data-cursor="magnetic"
                  className="btn-or justify-center"
                >
                  Demander le sur-mesure
                </Link>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
