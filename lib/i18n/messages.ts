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
    currency: string;
    skipToContent: string;
    back: string;
    loading: string;
  };
  hero: {
    cta: string;
  };
  product: {
    new: string;
    signature: string;
    compose: string;
    addToBag: string;
    askMadeToMeasure: string;
    sizeGuide: string;
    notifyMe: string;
    tryInAR: string;
    care: string;
    materials: string;
  };
  account: {
    title: string;
    login: string;
    signup: string;
    logout: string;
    orders: string;
    loyalty: string;
    returns: string;
    wishlist: string;
    welcome: string;
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
      currency: 'Devise',
      skipToContent: 'Aller au contenu',
      back: 'Retour',
      loading: 'Chargement…',
    },
    hero: {
      cta: "Entrer dans l'univers",
    },
    product: {
      new: 'Nouveau',
      signature: 'Signature',
      compose: 'Composer',
      addToBag: 'Ajouter au panier',
      askMadeToMeasure: 'Demander le sur-mesure',
      sizeGuide: 'Guide des tailles',
      notifyMe: 'Prévenez-moi quand c\u2019est disponible',
      tryInAR: 'Essayer en 3D · AR',
      care: 'Entretien',
      materials: 'Matières',
    },
    account: {
      title: 'Mon compte',
      login: 'Se connecter',
      signup: 'Créer un accès',
      logout: 'Déconnexion',
      orders: 'Commandes',
      loyalty: 'Fidélité',
      returns: 'Retours',
      wishlist: 'Mes envies',
      welcome: 'Bonjour',
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
      currency: 'Currency',
      skipToContent: 'Skip to content',
      back: 'Back',
      loading: 'Loading…',
    },
    hero: {
      cta: 'Enter the world',
    },
    product: {
      new: 'New',
      signature: 'Signature',
      compose: 'Compose',
      addToBag: 'Add to bag',
      askMadeToMeasure: 'Request made-to-measure',
      sizeGuide: 'Size guide',
      notifyMe: 'Notify me when available',
      tryInAR: 'Try in 3D · AR',
      care: 'Care',
      materials: 'Materials',
    },
    account: {
      title: 'My account',
      login: 'Sign in',
      signup: 'Create an account',
      logout: 'Sign out',
      orders: 'Orders',
      loyalty: 'Loyalty',
      returns: 'Returns',
      wishlist: 'My wishlist',
      welcome: 'Hello',
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
