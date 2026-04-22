/**
 * Initialisation Sentry — navigateur.
 *
 * Ne s'active que si `NEXT_PUBLIC_SENTRY_DSN` est défini. En dev local,
 * le DSN est typiquement vide → aucun SDK ne se charge côté client.
 *
 * `tracesSampleRate` volontairement bas (10 %) pour ne pas polluer la
 * quota Sentry. Ajuster selon le trafic réel en prod.
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    // N'envoie pas les événements automatiquement en dev — limite le bruit.
    enabled: process.env.NODE_ENV === 'production',
  });
}
