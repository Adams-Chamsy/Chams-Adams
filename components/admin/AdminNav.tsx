'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  RotateCcw,
  Ticket,
  Gift,
  Users,
  Sparkles,
  Coins,
  Bell,
  Mail,
  MessageCircle,
  Shirt,
  FolderOpen,
  BookOpen,
  CalendarRange,
  Newspaper,
  HelpCircle,
  Crown,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const SECTIONS: NavSection[] = [
  {
    title: 'Vue d\u2019ensemble',
    items: [{ href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard }],
  },
  {
    title: 'Commerce',
    items: [
      { href: '/admin/orders', label: 'Commandes', icon: Package },
      { href: '/admin/returns', label: 'Retours', icon: RotateCcw },
      { href: '/admin/promos', label: 'Codes promo', icon: Ticket },
      { href: '/admin/gift-cards', label: 'Cartes cadeaux', icon: Gift },
    ],
  },
  {
    title: 'Clientèle',
    items: [
      { href: '/admin/customers', label: 'Clients', icon: Users },
      { href: '/admin/vip', label: 'Cercle VIP', icon: Crown },
      { href: '/admin/loyalty', label: 'Fidélité', icon: Sparkles },
      { href: '/admin/waitlist', label: 'Liste d\u2019attente', icon: Bell },
      { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
      { href: '/admin/reviews', label: 'Témoignages', icon: MessageCircle },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { href: '/admin/products', label: 'Produits', icon: Shirt },
      { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
      { href: '/admin/articles', label: 'Articles', icon: BookOpen },
    ],
  },
  {
    title: 'Éditorial',
    items: [
      { href: '/admin/takeovers', label: 'Cérémonies', icon: Coins },
      { href: '/admin/events', label: 'Événements', icon: CalendarRange },
      { href: '/admin/press', label: 'Presse', icon: Newspaper },
      { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname() ?? '/admin';

  return (
    <nav
      aria-label="Navigation admin"
      className="flex flex-col gap-4"
    >
      {SECTIONS.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <span className="px-3 pt-1 font-sans text-[9px] uppercase tracking-[0.3em] text-or/70">
            {section.title}
          </span>
          <ul className="flex flex-col">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href} className="relative">
                  {/* Barre verticale or gauche, animée */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-y-1 left-0 w-[2px] origin-top scale-y-0 bg-or transition-transform duration-300 ease-out-expo',
                      active && 'scale-y-100'
                    )}
                  />
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-3 rounded-sm px-3 py-1.5 font-sans text-sm transition-colors duration-200',
                      active
                        ? 'bg-or/[0.06] text-or'
                        : 'text-ivoire/75 hover:bg-ivoire/[0.04] hover:text-or'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        active ? 'text-or' : 'text-ivoire/50'
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
