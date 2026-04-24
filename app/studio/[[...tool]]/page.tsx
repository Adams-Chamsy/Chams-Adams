/**
 * Sanity Studio embarqué — accessible sur /studio/*.
 * Authentification gérée par Sanity (compte sanity.io requis).
 *
 * Note : on force le rendu dynamique pour éviter le bundling statique qui
 * casse les hooks du Studio (useEffect globaux, windows refs).
 */
import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export const dynamic = 'force-static';
export const revalidate = 0;

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
