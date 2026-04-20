import Stripe from 'stripe';

/**
 * Instance Stripe lazy — évite de crasher le build si la clé n'est pas
 * encore configurée (on lance le build avant la mise en prod avec les vars).
 *
 * Utilisation :
 *   const stripe = getStripe();  // dans une route handler
 *
 * NE JAMAIS importer cette fonction dans un composant client — la clé
 * SECRET_KEY ne doit JAMAIS atteindre le bundle navigateur.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY manquante. Voir .env.example — à configurer avant tout appel checkout.'
    );
  }
  return new Stripe(key, {
    // Version API — à bumper consciemment quand Stripe release.
    // Cast `as any` : le type literal union `LatestApiVersion` bouge à
    // chaque release du SDK, on évite de se lier à une version précise.
    apiVersion: '2026-03-25.dahlia',
    typescript: true,
  });
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}
