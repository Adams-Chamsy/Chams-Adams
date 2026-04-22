/**
 * Messages i18n — dictionnaire minimaliste partagé entre serveur et client.
 *
 * Portée volontairement réduite (navigation, CTA principaux, colonnes Footer) :
 * la migration se fait de façon incrémentale. Les textes éditoriaux longs
 * restent en FR jusqu'à traduction humaine.
 */

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: unknown): value is Locale {
  return value === 'fr' || value === 'en';
}

type Messages = {
  nav: {
    collections: string;
    surMesure: string;
    savoirFaire: string;
    lookbook: string;
    journal: string;
    boutique: string;
    ariaPrimary: string;
    ariaMobile: string;
  };
  common: {
    search: string;
    openMenu: string;
    closeMenu: string;
    language: string;
  };
  hero: {
    cta: string;
  };
  footer: {
    colMaison: string;
    colCollections: string;
    colService: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
    foundedIn: string;
    rightsReserved: string;
  };
  language: {
    fr: string;
    en: string;
    soon: string;
    change: string;
  };
};

export const messages: Record<Locale, Messages> = {
  fr: {
    nav: {
      collections: 'Collections',
      surMesure: 'Sur-mesure',
      savoirFaire: 'Savoir-faire',
      lookbook: 'Lookbook',
      journal: 'Journal',
      boutique: 'Boutique',
      ariaPrimary: 'Navigation principale',
      ariaMobile: 'Navigation mobile',
    },
    common: {
      search: 'Rechercher',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      language: 'Changer de langue',
    },
    hero: {
      cta: "Entrer dans l'univers",
    },
    footer: {
      colMaison: 'Maison',
      colCollections: 'Collections',
      colService: 'Service',
      newsletterTitle: 'Recevoir nos correspondances',
      newsletterSubtitle: "L'élégance par l'écrit, tous les mois.",
      foundedIn: 'Maison fondée en',
      rightsReserved: 'Tous droits réservés',
    },
    language: {
      fr: 'Français',
      en: 'English',
      soon: 'bientôt',
      change: 'Changer de langue',
    },
  },
  en: {
    nav: {
      collections: 'Collections',
      surMesure: 'Made-to-measure',
      savoirFaire: 'Craftsmanship',
      lookbook: 'Lookbook',
      journal: 'Journal',
      boutique: 'Shop',
      ariaPrimary: 'Main navigation',
      ariaMobile: 'Mobile navigation',
    },
    common: {
      search: 'Search',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      language: 'Change language',
    },
    hero: {
      cta: 'Enter the world',
    },
    footer: {
      colMaison: 'The House',
      colCollections: 'Collections',
      colService: 'Service',
      newsletterTitle: 'Receive our correspondence',
      newsletterSubtitle: 'Elegance in writing, every month.',
      foundedIn: 'House founded in',
      rightsReserved: 'All rights reserved',
    },
    language: {
      fr: 'Français',
      en: 'English',
      soon: 'soon',
      change: 'Change language',
    },
  },
};

/** Accès générique aux messages, avec fallback vers la clé si introuvable. */
export function translate(locale: Locale, keyPath: string): string {
  const keys = keyPath.split('.');
  let ref: unknown = messages[locale];
  for (const k of keys) {
    if (ref && typeof ref === 'object' && k in ref) {
      ref = (ref as Record<string, unknown>)[k];
    } else {
      return keyPath;
    }
  }
  return typeof ref === 'string' ? ref : keyPath;
}
