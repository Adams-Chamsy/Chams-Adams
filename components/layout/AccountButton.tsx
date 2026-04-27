'use client';

import Link from 'next/link';
import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Icône compte du Header — pointe vers /compte.
 * La page /compte gère elle-même l'affichage selon l'état d'authentification
 * (formulaire login si déconnecté, dashboard si connecté).
 */
export function AccountButton({ className }: { className?: string }) {
  return (
    <Link
      href="/compte"
      aria-label="Mon compte"
      data-cursor="hover"
      className={cn(
        'group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or',
        className
      )}
    >
      <UserRound className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.5} />
    </Link>
  );
}
