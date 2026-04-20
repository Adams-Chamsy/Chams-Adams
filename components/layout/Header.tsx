'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Heart, Menu, Search, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartButton } from './CartButton';
import { Logo } from './Logo';

type NavLink = { label: string; href: string };

// Routes réelles (étape 6) : Collections et Boutique. Les autres restent
// en placeholder `#` tant que les pages ne sont pas construites.
const navItems: NavLink[] = [
  { label: 'Collections', href: '/collections' },
  { label: 'Sur-mesure', href: '#' },
  { label: 'Savoir-faire', href: '#' },
  { label: 'Lookbook', href: '#' },
  { label: 'Journal', href: '#' },
];

const boutique: NavLink = { label: 'Boutique', href: '/boutique' };

const SCROLL_THRESHOLD = 80;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

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
          <nav aria-label="Navigation principale" className="hidden items-center gap-10 lg:flex">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
            <NavItem {...boutique} highlighted />
          </nav>
          {/* Spacer pour équilibrer la grille mobile */}
          <span aria-hidden className="lg:hidden" />

          {/* Actions (droite) */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <IconButton icon={Search} label="Rechercher" className="hidden sm:inline-flex" />
            <IconButton icon={Heart} label="Garder près de soi" className="hidden sm:inline-flex" />
            <CartButton />
            <IconButton icon={Globe} label="Langue (FR)" className="hidden md:inline-flex" />
            <button
              ref={burgerRef}
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-ivoire transition-colors duration-300 hover:text-or lg:hidden"
              aria-label="Ouvrir le menu"
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

function NavItem({ label, href, highlighted = false }: NavLink & { highlighted?: boolean }) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      className={cn(
        'group relative inline-flex items-center font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300',
        highlighted ? 'text-or hover:text-or/80' : 'text-ivoire/80 hover:text-ivoire'
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          'absolute left-0 right-0 -bottom-1.5 h-px origin-left scale-x-0 bg-or transition-transform duration-500 ease-out-expo group-hover:scale-x-100',
          highlighted && 'scale-x-100 bg-or/60'
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

type MobileMenuProps = { onClose: () => void };

function MobileMenu({ onClose }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const items = [...navItems, boutique];

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] lg:hidden"
    >
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Fermer le menu"
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
            aria-label="Fermer le menu"
            data-cursor="hover"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ivoire transition-colors duration-300 hover:text-or"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav
          aria-label="Navigation mobile"
          className="flex flex-1 flex-col justify-center gap-6 px-8"
        >
          {items.map((item, i) => (
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
                className="block font-serif text-4xl font-light text-ivoire transition-colors duration-300 hover:text-or"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
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
