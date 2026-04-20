'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchModal } from '@/components/search/SearchModal';

/**
 * Bouton loupe du Header — ouvre la modal de recherche.
 * La modal est chargée par le même composant pour simplicité d'intégration
 * (l'overlay ne rend rien tant que open=false).
 */
export function SearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Rechercher"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        data-cursor="hover"
        className={cn(
          'group inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or',
          className
        )}
      >
        <Search className="h-[18px] w-[18px]" aria-hidden />
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
