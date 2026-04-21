'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useConsentStore, type ConsentCategory } from '@/lib/store/consent.store';
import { cn } from '@/lib/utils';

const LUXE_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

type Category = {
  key: ConsentCategory;
  title: string;
  description: string;
};

const categories: Category[] = [
  {
    key: 'analytics',
    title: 'Mesure d’audience',
    description:
      'Statistiques anonymes pour comprendre comment le site est consulté.',
  },
  {
    key: 'marketing',
    title: 'Marketing',
    description:
      'Personnalisation des invitations et mesure des campagnes.',
  },
];

/**
 * Bandeau de consentement RGPD : Accepter / Refuser / Personnaliser.
 *
 *  - Apparition uniquement si `accepted === null` (première visite ou reset).
 *  - Persistance via localStorage (store Zustand avec `persist`).
 *  - Aucune mesure d'audience ni marketing avant décision.
 *  - Accessibilité : aria-labelledby, Esc refuse par défaut.
 */
export function CookieBanner() {
  const accepted = useConsentStore((s) => s.accepted);
  const acceptAll = useConsentStore((s) => s.acceptAll);
  const rejectAll = useConsentStore((s) => s.rejectAll);
  const savePreferences = useConsentStore((s) => s.savePreferences);

  const [mounted, setMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Record<ConsentCategory, boolean>>({
    analytics: false,
    marketing: false,
  });

  // Hydrate uniquement après le premier rendu client pour éviter un flash SSR.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && accepted === null) rejectAll();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, accepted, rejectAll]);

  if (!mounted) return null;

  const visible = accepted === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-description"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: LUXE_EASE }}
          className={cn(
            'fixed inset-x-4 bottom-4 z-[250] mx-auto max-w-2xl',
            'border border-or/40 bg-noir/95 backdrop-blur-md shadow-editorial',
            'p-6 md:p-8 sm:inset-x-6 sm:bottom-6'
          )}
        >
          <div className="flex flex-col gap-4">
            <h2
              id="cookie-banner-title"
              className="font-serif text-xl font-light text-ivoire md:text-2xl"
            >
              Votre confidentialité, notre égard.
            </h2>
            <p
              id="cookie-banner-description"
              className="font-serif italic leading-relaxed text-ivoire/75"
            >
              Nous utilisons des cookies strictement nécessaires au
              fonctionnement du site. Avec votre accord, quelques cookies
              supplémentaires nous aident à mesurer l&apos;audience et à vous
              adresser nos invitations.{' '}
              <Link
                href="/confidentialite"
                data-cursor="hover"
                className="text-or underline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-ivoire"
              >
                En savoir plus
              </Link>
              .
            </p>

            {showDetails && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: LUXE_EASE }}
                className="mt-2 flex flex-col gap-4 border-t border-bronze/25 pt-5"
              >
                {categories.map((c) => (
                  <li
                    key={c.key}
                    className="flex items-start justify-between gap-5"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire">
                        {c.title}
                      </span>
                      <span className="text-sm text-ivoire/60">
                        {c.description}
                      </span>
                    </div>
                    <label className="mt-1 inline-flex shrink-0 cursor-pointer items-center">
                      <input
                        type="checkbox"
                        aria-label={c.title}
                        checked={prefs[c.key]}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            [c.key]: e.target.checked,
                          }))
                        }
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          'relative block h-6 w-11 rounded-full border transition-colors duration-300',
                          'border-bronze/50 bg-noir peer-checked:border-or peer-checked:bg-or/20',
                          'peer-focus-visible:ring-2 peer-focus-visible:ring-or peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-noir'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute left-0.5 top-0.5 block h-5 w-5 rounded-full transition-transform duration-300',
                            'bg-ivoire/70 peer-checked:translate-x-5 peer-checked:bg-or',
                            prefs[c.key] && 'translate-x-5 bg-or'
                          )}
                        />
                      </span>
                    </label>
                  </li>
                ))}
              </motion.ul>
            )}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              {!showDetails ? (
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  data-cursor="hover"
                  className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/70 underline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-or"
                >
                  Personnaliser
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => savePreferences(prefs)}
                  data-cursor="hover"
                  className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/70 underline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-or"
                >
                  Enregistrer mes préférences
                </button>
              )}
              <button
                type="button"
                onClick={rejectAll}
                data-cursor="hover"
                className="inline-flex items-center justify-center border border-ivoire/30 px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-ivoire transition-all duration-500 ease-out-expo hover:border-ivoire hover:text-ivoire"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={acceptAll}
                data-cursor="magnetic"
                className="btn-or"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
