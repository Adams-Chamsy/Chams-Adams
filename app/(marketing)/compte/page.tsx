'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { useAccountStore } from '@/lib/store/account.store';
import { useWishlistStore } from '@/lib/store/wishlist.store';
import { useCartStore } from '@/lib/store/cart.store';
import { useConsentStore } from '@/lib/store/consent.store';
import { toast } from '@/lib/store/toast.store';
import { cn } from '@/lib/utils';

/**
 * /compte — page profil local. Aucune authentification serveur : toutes les
 * données sont dans localStorage. Sert de "home base" pour retrouver ses
 * envies, régler ses préférences, et supprimer ses données en un clic.
 *
 * Sera enrichie / remplacée dès que la décision d'auth sera prise.
 */
export default function ComptePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pseudonyme = useAccountStore((s) => s.pseudonyme);
  const setPseudonyme = useAccountStore((s) => s.setPseudonyme);
  const createdAt = useAccountStore((s) => s.createdAt);
  const newsletterSubscribed = useAccountStore((s) => s.newsletterSubscribed);
  const setNewsletter = useAccountStore((s) => s.setNewsletter);
  const resetAccount = useAccountStore((s) => s.reset);

  const wishlistItems = useWishlistStore((s) => s.items);
  const openWishlist = useWishlistStore((s) => s.openWishlist);
  const clearWishlist = useWishlistStore((s) => s.clear);

  const cartCount = useCartStore((s) => s.items.length);
  const reopenConsent = useConsentStore((s) => s.reopen);

  const [draftPseudo, setDraftPseudo] = useState(pseudonyme);
  useEffect(() => {
    if (mounted) setDraftPseudo(pseudonyme);
  }, [pseudonyme, mounted]);

  function savePseudo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPseudonyme(draftPseudo.trim());
    toast.success('Préférence enregistrée', 'Votre prénom est bien noté.');
  }

  function deleteEverything() {
    if (
      !confirm(
        'Supprimer toutes vos données locales (prénom, envies, préférences) ? Cette action est définitive.'
      )
    )
      return;
    resetAccount();
    clearWishlist();
    toast.success('Données effacées', 'Tout a été supprimé de cet appareil.');
  }

  const greeting = pseudonyme ? `Bienvenue, ${pseudonyme}` : 'Bienvenue';

  return (
    <>
      {/* Header */}
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Mon compte' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Votre espace
          </span>
          <h1 className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,5vw,4.5rem)]">
            {mounted ? greeting : 'Bienvenue'}
          </h1>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/70 text-lg md:text-xl">
            Cette page garde une trace discrète de vos envies et de vos
            préférences, uniquement sur cet appareil. Un vrai compte
            synchronisé arrive bientôt.
          </p>
        </div>
      </section>

      {/* Grille cartes */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Prénom */}
          <Card
            eyebrow="Identité"
            title="Votre prénom"
            description="Nous pourrons vous saluer personnellement dans nos correspondances."
          >
            <form onSubmit={savePseudo} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/60">
                  Prénom
                </span>
                <input
                  type="text"
                  value={mounted ? draftPseudo : ''}
                  onChange={(e) => setDraftPseudo(e.target.value)}
                  placeholder="Votre prénom"
                  maxLength={80}
                  data-cursor="hover"
                  className="border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire placeholder:italic placeholder:text-ivoire/40 transition-colors duration-300 focus:border-or focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={!mounted || draftPseudo.trim() === pseudonyme}
                data-cursor="magnetic"
                className={cn(
                  'btn-or self-start disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                Enregistrer
              </button>
              {mounted && createdAt && (
                <p className="font-sans text-[11px] italic text-ivoire/50">
                  Profil local créé le{' '}
                  {new Date(createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </form>
          </Card>

          {/* Envies (wishlist) */}
          <Card
            eyebrow="Sélection"
            title={
              mounted && wishlistItems.length > 0
                ? `${wishlistItems.length} pièce${wishlistItems.length > 1 ? 's' : ''} mise${wishlistItems.length > 1 ? 's' : ''} de côté`
                : 'Aucune envie pour l\u2019instant'
            }
            description="Les pièces ajoutées à votre wishlist restent là jusqu'à ce que vous les retiriez."
          >
            {mounted && wishlistItems.length > 0 ? (
              <div className="flex flex-col gap-4">
                <ul className="flex flex-wrap gap-3">
                  {wishlistItems.slice(0, 6).map((item) => (
                    <li
                      key={item.productId}
                      className="relative h-20 w-16 overflow-hidden bg-noir-800"
                    >
                      <Image
                        src={item.image.url}
                        alt={item.image.alt}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="button"
                    onClick={openWishlist}
                    data-cursor="magnetic"
                    className="btn-or"
                  >
                    Voir ma wishlist
                  </button>
                  <Link
                    href="/boutique"
                    data-cursor="hover"
                    className="btn-ghost"
                  >
                    Continuer à explorer
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <Link href="/boutique" data-cursor="magnetic" className="btn-or">
                Explorer la boutique
              </Link>
            )}
          </Card>

          {/* Panier */}
          <Card
            eyebrow="Panier"
            title={
              mounted && cartCount > 0
                ? `${cartCount} pièce${cartCount > 1 ? 's' : ''} en attente de finalisation`
                : 'Panier vide'
            }
            description="Retrouvez votre sélection à tout moment. Rien n'est validé tant que vous n'avez pas finalisé."
          >
            {mounted && cartCount > 0 ? (
              <Link href="/checkout" data-cursor="magnetic" className="btn-or">
                Finaliser la commande
              </Link>
            ) : (
              <Link href="/boutique" data-cursor="hover" className="btn-ghost">
                Découvrir les pièces
                <span aria-hidden>→</span>
              </Link>
            )}
          </Card>

          {/* Préférences */}
          <Card
            eyebrow="Préférences"
            title="Vos choix de communication"
            description="Vous pouvez modifier vos choix à tout moment."
          >
            <div className="flex flex-col gap-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={mounted ? newsletterSubscribed : false}
                  onChange={(e) => {
                    setNewsletter(e.target.checked);
                    toast.default('Préférence mise à jour');
                  }}
                  className="mt-1 h-4 w-4 accent-or"
                />
                <span className="font-sans text-sm leading-relaxed text-ivoire/75">
                  Recevoir la newsletter mensuelle «&nbsp;Correspondances&nbsp;»
                </span>
              </label>

              <button
                type="button"
                onClick={() => {
                  reopenConsent();
                  toast.default('Bandeau de consentement ré-ouvert');
                }}
                data-cursor="hover"
                className="self-start font-sans text-xs uppercase tracking-[0.2em] text-or underline-offset-4 hover:underline"
              >
                Rouvrir mes choix de cookies
              </button>
            </div>
          </Card>

          {/* Zone dangereuse */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4 border border-destructive/30 p-8 md:p-10">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-destructive">
                Zone sensible
              </span>
              <h3 className="font-serif text-xl font-light text-ivoire md:text-2xl">
                Supprimer toutes mes données locales
              </h3>
              <p className="font-serif italic text-ivoire/70 leading-relaxed">
                Efface définitivement votre prénom, votre wishlist et vos
                préférences de cet appareil. Vos commandes passées restent
                conservées chez nous conformément aux obligations comptables.
              </p>
              <button
                type="button"
                onClick={deleteEverything}
                data-cursor="hover"
                className="inline-flex items-center self-start border border-destructive/50 px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-destructive transition-colors duration-300 hover:bg-destructive/10"
              >
                Tout effacer
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Card({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex flex-col gap-5 border border-bronze/20 p-8 md:p-10">
      <header className="flex flex-col gap-2">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          {eyebrow}
        </span>
        <h2 className="font-serif text-xl font-light text-ivoire md:text-2xl">
          {title}
        </h2>
        <p className="font-serif italic leading-relaxed text-ivoire/70">
          {description}
        </p>
      </header>
      <div>{children}</div>
    </article>
  );
}
