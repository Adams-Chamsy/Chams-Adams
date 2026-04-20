'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Sélecteur de langue. Pour l'instant, FR seule est disponible ; EN est
 * affichée en "bientôt" (étape 9 d'i18n via next-intl).
 *
 * Dropdown compact avec deux entrées, fermé par clic extérieur ou ESC.
 */
export function LanguageButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Changer de langue"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        data-cursor="hover"
        className="group inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
      >
        <Globe className="h-[18px] w-[18px]" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 z-[60] min-w-[180px] border border-bronze/30 bg-noir py-2 shadow-editorial"
          >
            <MenuItem
              label="Français"
              code="FR"
              active
              onClick={() => setOpen(false)}
            />
            <MenuItem
              label="English"
              code="EN"
              disabled
              hint="bientôt"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  label,
  code,
  active,
  disabled,
  hint,
  onClick,
}: {
  label: string;
  code: string;
  active?: boolean;
  disabled?: boolean;
  hint?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      aria-current={active}
      data-cursor={disabled ? undefined : 'hover'}
      className={cn(
        'flex w-full items-center justify-between gap-4 px-5 py-2.5 text-left font-sans text-sm transition-colors duration-200',
        active && 'text-or',
        !active && !disabled && 'text-ivoire hover:bg-ivoire/[0.03] hover:text-or',
        disabled && 'cursor-not-allowed text-ivoire/40'
      )}
    >
      <span className="flex items-center gap-3">
        <span className="font-sans text-xs uppercase tracking-[0.2em]">{code}</span>
        <span className="font-serif italic">{label}</span>
      </span>
      {hint && (
        <span className="font-sans text-[10px] italic uppercase tracking-[0.15em] text-ivoire/40">
          {hint}
        </span>
      )}
    </button>
  );
}
