'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n/client';
import { CartButton } from './CartButton';
import { WishlistButton } from './WishlistButton';
import { SearchButton } from './SearchButton';
import { LanguageButton } from './LanguageButton';
import { CurrencyButton } from './CurrencyButton';
import { Logo } from './Logo';

type NavLink = { label: string; href: string };

// Clés i18n → href ; le label est résolu depuis les messages au rendu.
const NAV_KEYS: { key: string; href: string }[] = [
  { key: 'nav.collections', href: '/collections' },
  { key: 'nav.surMesure', href: '/sur-mesure' },
  { key: 'nav.savoirFaire', href: '/savoir-faire' },
  { key: 'nav.lookbook', href: '/lookbook' },
  { key: 'nav.journal', href: '/journal' },
];

const BOUTIQUE_KEY = { key: 'nav.boutique', href: '/boutique' };

const SCROLL_THRESHOLD = 80;

/** Détermine si un href est l'actif courant (match exact ou sous-route). */
function isActiveHref(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const t = useT();
  const pathname = usePathname() ?? '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const navItems: NavLink[] = NAV_KEYS.map((n) => ({
    label: t(n.key),
    href: n.href,
  }));
  const boutique: NavLink = { label: t(BOUTIQUE_KEY.key), href: BOUTIQUE_KEY.href };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-luxe',
          scrolled
            ? 'border-or/10 bg-noir/70 backdrop-blur-lg'
            : 'border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto grid w-full max-w-wide grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-6 lg:px-12">
          {/* Logo (gauche desktop, centre mobile via grid) */}
          <div className="flex items-center justify-start">
            <Logo
              variant="wordmark"
              size={scrolled ? 28 : 36}
              className="transition-[width,height] duration-500 ease-luxe"
            />
          </div>

          {/* Nav desktop */}
          <nav aria-label={t('nav.ariaPrimary')} className="hidden items-center gap-10 lg:flex">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={isActiveHref(pathname, item.href)}
              />
            ))}
            <NavItem
              {...boutique}
              active={isActiveHref(pathname, boutique.href)}
            />
          </nav>
          {/* Spacer pour équilibrer la grille mobile */}
          <span aria-hidden className="lg:hidden" />

          {/* Actions (droite) */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <SearchButton className="hidden sm:inline-flex" />
            <WishlistButton className="hidden sm:inline-flex" />
            <CartButton />
            <CurrencyButton className="hidden md:inline-flex" />
            <LanguageButton className="hidden md:inline-flex" />
            <button
              ref={burgerRef}
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-ivoire transition-colors duration-300 hover:text-or lg:hidden"
              aria-label={t('common.openMenu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
              data-cursor="hover"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            items={[...navItems, boutique]}
            pathname={pathname}
            closeLabel={t('common.closeMenu')}
            navLabel={t('nav.ariaMobile')}
            onClose={() => {
              setMenuOpen(false);
              burgerRef.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  label,
  href,
  active = false,
}: NavLink & { active?: boolean }) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative inline-flex items-center font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300',
        active ? 'text-or' : 'text-ivoire/80 hover:text-ivoire'
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          'absolute left-0 right-0 -bottom-1.5 h-px origin-left scale-x-0 bg-or transition-transform duration-500 ease-out-expo group-hover:scale-x-100',
          active && 'scale-x-100 bg-or'
        )}
      />
    </Link>
  );
}

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  badge?: number;
  className?: string;
};

function IconButton({ icon: Icon, label, badge, className }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      data-cursor="hover"
      className={cn(
        'group relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or',
        className
      )}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden />
      {typeof badge === 'number' && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full border border-noir bg-or px-1 text-[10px] font-medium leading-4 text-noir"
        >
          {badge}
        </span>
      )}
    </button>
  );
}

type MobileMenuProps = {
  onClose: () => void;
  items: NavLink[];
  pathname: string;
  closeLabel: string;
  navLabel: string;
};

function MobileMenu({
  onClose,
  items,
  pathname,
  closeLabel,
  navLabel,
}: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={navLabel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] lg:hidden"
    >
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-noir/70 backdrop-blur-md"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-noir"
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Logo as="div" variant="wordmark" size={28} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            data-cursor="hover"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav
          aria-label={navLabel}
          className="flex flex-1 flex-col justify-center gap-6 px-8"
        >
          {items.map((item, i) => {
            const active = isActiveHref(pathname, item.href);
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.15 + i * 0.08,
                  duration: 0.6,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  data-cursor="hover"
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'block font-serif text-4xl font-light transition-colors duration-300 hover:text-or',
                    active ? 'text-or' : 'text-ivoire'
                  )}
                >
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="border-t border-bronze/15 px-8 py-6">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/50">
            FR · EN
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
