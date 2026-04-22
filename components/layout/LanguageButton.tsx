'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale, useT } from '@/lib/i18n/client';
import { LOCALES, type Locale } from '@/lib/i18n/messages';

const COOKIE = 'chams-locale';

/**
 * Sélecteur de langue — écrit la préférence dans le cookie `chams-locale`
 * et rafraîchit la route pour que les Server Components re-rendent avec la
 * nouvelle langue. Aucune redirection / URL différente.
 */
export function LanguageButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useT();

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

  function selectLocale(locale: Locale) {
    if (locale === currentLocale) {
      setOpen(false);
      return;
    }
    // 1 an, path root, lax pour que le navigateur l'envoie sur les navigations
    document.cookie = `${COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label={t('common.language')}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        data-cursor="hover"
        disabled={isPending}
        className={cn(
          'group inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or',
          isPending && 'opacity-60'
        )}
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
            {LOCALES.map((loc) => (
              <MenuItem
                key={loc}
                label={t(`language.${loc}`)}
                code={loc.toUpperCase()}
                active={currentLocale === loc}
                onClick={() => selectLocale(loc)}
              />
            ))}
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
  onClick,
}: {
  label: string;
  code: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      aria-current={active}
      data-cursor="hover"
      className={cn(
        'flex w-full items-center justify-between gap-4 px-5 py-2.5 text-left font-sans text-sm transition-colors duration-200',
        active
          ? 'text-or'
          : 'text-ivoire hover:bg-ivoire/[0.03] hover:text-or'
      )}
    >
      <span className="flex items-center gap-3">
        <span className="font-sans text-xs uppercase tracking-[0.2em]">{code}</span>
        <span className="font-serif italic">{label}</span>
      </span>
      {active && (
        <span aria-hidden className="font-sans text-[10px] uppercase tracking-[0.15em] text-or">
          ✓
        </span>
      )}
    </button>
  );
}
