import 'server-only';
import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/**
 * Client Sanity côté serveur. Utilise `useCdn: true` en prod (cache lecture
 * rapide), false en dev pour voir les changements immédiatement.
 *
 * Le token n'est chargé qu'en écriture (seed / mutations) — les lectures
 * front passent par le CDN public.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});

/** Client avec token Editor — pour scripts de migration / mutations serveur. */
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/** Indique si Sanity est configuré (sinon on retombe sur les mocks). */
export function isSanityEnabled(): boolean {
  return !!projectId;
}
