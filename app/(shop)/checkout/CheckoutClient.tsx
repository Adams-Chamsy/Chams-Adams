'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCartStore,
  useCartCount,
  useCartIsEmpty,
  useCartSubtotal,
} from '@/lib/store/cart.store';
import { formatPrice } from '@/lib/utils/price';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutClient() {
  const items = useCartStore((s) => s.items);
  const isEmpty = useCartIsEmpty();
  const count = useCartCount();
  const subtotal = useCartSubtotal();
  const currency = items[0]?.currency ?? 'EUR';

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Si le panier est vide au mount → redirect UX-friendly (pas de useRouter
  // push dans useEffect pour éviter un re-render supplémentaire côté ssr).

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email)) {
      setError('Merci de renseigner une adresse de courriel valide.');
      return;
    }
    if (isEmpty) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email }),
      });
      if (!res.ok) {
        const { error: serverError } = await res
          .json()
          .catch(() => ({ error: 'Erreur inconnue.' }));
        throw new Error(serverError ?? 'Le paiement n\u2019a pas pu être ouvert.');
      }
      const { url } = (await res.json()) as { url: string };
      if (!url) throw new Error('Redirection Stripe manquante.');
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      setSubmitting(false);
    }
  }

  // État SSR : on attend la réhydratation Zustand pour éviter un flash
  // "panier vide" alors qu'il y a des items dans localStorage.
  if (!mounted) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-noir">
        <p className="font-serif italic text-ivoire/60">
          Un instant de grâce…
        </p>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-noir px-6 pt-[160px]">
        <div className="container-content flex flex-col items-center gap-6 text-center">
          <p className="font-script text-5xl text-or">Votre sélection est vide</p>
          <p className="max-w-prose font-serif italic text-ivoire/70">
            Rien à finaliser pour l&apos;instant.
          </p>
          <Link href="/boutique" data-cursor="magnetic" className="btn-or mt-2">
            Explorer la boutique
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-noir pt-[140px] pb-[120px] md:pt-[180px]">
      <div className="container-content">
        {/* Titre */}
        <header className="mb-12 flex flex-col gap-3 md:mb-16">
          <nav
            aria-label="Fil d'Ariane"
            className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60"
          >
            <Link href="/" className="hover:text-or">
              Accueil
            </Link>
            <span className="mx-2">·</span>
            <span className="text-ivoire">Finaliser</span>
          </nav>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Paiement
          </span>
          <h1 className="font-serif font-light leading-tight text-ivoire text-[clamp(2.25rem,4.5vw,3.5rem)]">
            Finaliser votre sélection
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Récap à gauche */}
          <div className="lg:col-span-7">
            <h2 className="mb-8 font-serif text-2xl font-light text-ivoire md:text-3xl">
              Votre sélection
            </h2>
            <ul className="flex flex-col divide-y divide-bronze/15 border-y border-bronze/15">
              {items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex gap-5 py-6"
                >
                  <div className="relative aspect-[4/5] w-24 flex-shrink-0 overflow-hidden bg-noir-800">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="font-serif text-lg text-ivoire">
                          {item.productName}
                        </span>
                        {item.productSubtitle && (
                          <span className="font-serif italic text-sm text-ivoire/60">
                            {item.productSubtitle}
                          </span>
                        )}
                        <span className="mt-1 font-sans text-[11px] uppercase tracking-[0.15em] text-ivoire/60">
                          {item.variantColorName} · Taille {item.size} · ×{item.quantity}
                        </span>
                      </div>
                      <p className="whitespace-nowrap font-sans text-base tracking-[0.1em] text-ivoire">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>

            <Link
              href="/boutique"
              data-cursor="hover"
              className="mt-6 inline-block font-serif italic text-or underline-offset-4 hover:underline"
            >
              ← Ajuster la sélection
            </Link>
          </div>

          {/* Action à droite */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="flex flex-col gap-6 border border-bronze/15 bg-[#0F0E0C] p-8">
                <h2 className="font-serif text-xl font-light text-ivoire md:text-2xl">
                  Finaliser
                </h2>

                <dl className="flex flex-col gap-3 border-y border-bronze/15 py-4 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-sans uppercase tracking-[0.2em] text-ivoire/60">
                      Pièces
                    </dt>
                    <dd className="font-serif text-ivoire">{count}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-sans uppercase tracking-[0.2em] text-ivoire/60">
                      Sous-total
                    </dt>
                    <dd className="font-sans tracking-[0.1em] text-ivoire">
                      {formatPrice(subtotal, currency)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-sans uppercase tracking-[0.2em] text-ivoire/60">
                      Livraison
                    </dt>
                    <dd className="font-serif italic text-ivoire/70">
                      Calculée à l&apos;étape suivante
                    </dd>
                  </div>
                </dl>

                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  <label className="flex flex-col gap-2">
                    <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
                      Adresse de courriel
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="votre adresse"
                      disabled={submitting}
                      data-cursor="hover"
                      aria-invalid={!!error}
                      aria-describedby={error ? 'checkout-error' : undefined}
                      className={cn(
                        'border-b bg-transparent py-2 font-sans text-base text-ivoire placeholder:text-ivoire/30 focus:outline-none',
                        error ? 'border-destructive' : 'border-bronze/40 focus:border-or'
                      )}
                    />
                  </label>
                  {error && (
                    <p
                      id="checkout-error"
                      role="alert"
                      className="font-sans text-xs italic text-destructive"
                    >
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting || isEmpty}
                    data-cursor="magnetic"
                    className={cn(
                      'inline-flex w-full items-center justify-center border border-or bg-or px-8 py-4',
                      'font-sans text-xs uppercase tracking-[0.2em] text-noir',
                      'transition-all duration-500 ease-out-expo hover:shadow-halo-or-strong',
                      submitting && 'pointer-events-none opacity-70'
                    )}
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-3">
                        <span
                          aria-hidden
                          className="inline-block h-3 w-3 animate-spin rounded-full border border-noir/40 border-t-noir"
                        />
                        Redirection vers le paiement…
                      </span>
                    ) : (
                      'Paiement sécurisé'
                    )}
                  </button>
                </form>

                <p className="inline-flex items-center justify-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/50">
                  <Lock className="h-3 w-3" aria-hidden />
                  Paiement sécurisé par Stripe
                </p>
                <p className="font-sans text-[11px] italic leading-relaxed text-ivoire/50">
                  Vos données bancaires ne transitent jamais par nos serveurs.
                  Stripe traite le paiement dans le respect des normes PCI-DSS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
