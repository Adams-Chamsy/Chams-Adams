'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart.store';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

type SessionInfo = {
  email: string | null;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  orderNumber: string;
};

/**
 * Page d'atterrissage post-paiement.
 * - Vide le panier au mount (la commande est finalisée côté Stripe)
 * - Fetch les infos de session pour afficher le numéro de commande
 * - Animation cérémonieuse : ligne or se dessine, puis fade-in du texte
 */
export function SuccessClient({ sessionId }: { sessionId: string | null }) {
  const clearCart = useCartStore((s) => s.clearCart);
  const [info, setInfo] = useState<SessionInfo | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    fetch(`/api/checkout/session/${encodeURIComponent(sessionId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        setInfo(data);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const orderNumber =
    info?.orderNumber ?? (sessionId ? sessionId.slice(-8).toUpperCase() : null);

  return (
    <section className="flex min-h-screen items-center justify-center bg-noir px-6 py-[120px]">
      <div className="container-content flex max-w-2xl flex-col items-center gap-8 text-center">
        {/* Ligne or qui se dessine — signature visuelle "accusé réception" */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
          className="block h-px w-24 origin-center bg-or/80"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: EASE_OUT_EXPO }}
          className="font-script text-[64px] leading-none text-or md:text-[80px]"
        >
          Merci
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE_OUT_EXPO }}
          className="font-serif font-light leading-tight text-ivoire text-[clamp(2rem,4vw,3rem)]"
        >
          Votre sélection est accueillie.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="max-w-prose font-serif italic text-ivoire/80 text-lg md:text-xl leading-[1.7]"
        >
          Un accusé de réception vient d&apos;être transmis à votre adresse.
          Nos artisans prennent le relais.
        </motion.p>

        {loaded && orderNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col items-center gap-2 border-t border-bronze/20 pt-8"
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-or/80">
              Référence
            </span>
            <span className="font-serif text-xl text-ivoire tracking-wide">
              N° {orderNumber}
            </span>
            {info?.email && (
              <p className="mt-2 font-serif italic text-sm text-ivoire/60">
                Un récapitulatif détaillé vous a été adressé à {info.email}.
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.8 }}
          className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
        >
          <Link href="/boutique" data-cursor="magnetic" className="btn-or">
            Poursuivre la sélection
          </Link>
          <Link href="/" data-cursor="hover" className="btn-ghost">
            Retour à l&apos;accueil
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
