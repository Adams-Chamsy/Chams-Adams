'use client';

import { usePathname } from 'next/navigation';

/**
 * Wrapper qui masque le chrome public (Header / Footer / drawers boutique
 * / banner cookies / WhatsApp / scroll-to-top) sur les routes admin.
 *
 * Le layout admin a son propre chrome (sidebar + déconnexion). Le chrome
 * public n'a aucune utilité pour la gestion back-office.
 *
 * À utiliser dans le root layout pour englober toutes les briques publiques.
 */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdmin) return null;
  return <>{children}</>;
}
