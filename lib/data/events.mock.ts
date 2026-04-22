export type EventType =
  | 'defile'
  | 'showroom'
  | 'ceremonie'
  | 'presse'
  | 'collection';

export type EventStatus = 'upcoming' | 'ongoing' | 'past';

export interface Event {
  id: string;
  type: EventType;
  title: string;
  date: string; // ISO YYYY-MM-DD
  endDate?: string; // pour événements multi-jours
  location: string;
  city: string;
  country: string;
  description: string;
  cta?: { label: string; href: string };
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  defile: 'Défilé',
  showroom: 'Showroom',
  ceremonie: 'Cérémonie',
  presse: 'Presse',
  collection: 'Collection',
};

/**
 * Données factices — à remplacer par une source réelle (Sanity / Notion /
 * Airtable) quand le CMS sera câblé. Les événements sont triés par date
 * croissante dans les pages qui consomment cette liste.
 */
export const EVENTS: Event[] = [
  {
    id: 'e-tabaski-2026',
    type: 'ceremonie',
    title: 'Tabaski 2026 — Collection capsule',
    date: '2026-05-20',
    endDate: '2026-06-06',
    location: 'Boutique éphémère',
    city: 'Dakar',
    country: 'Sénégal',
    description:
      "Notre capsule Tabaski ouvre ses portes trois semaines avant la fête. Pièces en édition limitée et essayage privé sur rendez-vous.",
    cta: { label: 'Réserver un créneau', href: '/contact' },
  },
  {
    id: 'e-dakar-fw-2026',
    type: 'defile',
    title: 'Dakar Fashion Week — Collection SS26',
    date: '2026-06-18',
    endDate: '2026-06-21',
    location: 'Monument de la Renaissance',
    city: 'Dakar',
    country: 'Sénégal',
    description:
      "Présentation officielle de la collection Printemps-Été 2026. Quinze silhouettes, un film court, une soirée.",
    cta: { label: "Demande d'accréditation presse", href: '/contact' },
  },
  {
    id: 'e-showroom-paris',
    type: 'showroom',
    title: 'Showroom privé — Paris',
    date: '2026-07-03',
    endDate: '2026-07-05',
    location: 'Triangle d\u2019Or',
    city: 'Paris',
    country: 'France',
    description:
      "Trois jours d'essayage privé sur rendez-vous. Découvrez la collection en conditions intimes, avec nos conseillers à vos côtés.",
    cta: { label: 'Prendre rendez-vous', href: '/contact' },
  },
  {
    id: 'e-magal-touba',
    type: 'ceremonie',
    title: 'Magal de Touba — Sélection dédiée',
    date: '2026-08-15',
    endDate: '2026-09-05',
    location: 'E-boutique',
    city: 'En ligne',
    country: 'Monde',
    description:
      "Pour le grand Magal : sélection de pièces sobres et nobles, expéditions prioritaires, ajustements offerts.",
    cta: { label: 'Voir la sélection', href: '/collections/tabaski-magal' },
  },
  {
    id: 'e-vogue-cover',
    type: 'presse',
    title: 'Vogue Afrique — Édition septembre',
    date: '2026-09-01',
    location: 'Parution internationale',
    city: '—',
    country: 'Monde',
    description:
      "Une pièce signature Chams Adams dans le dossier spécial Haute Couture africaine. Édition collector disponible en kiosque.",
  },
  {
    id: 'e-collection-ah26',
    type: 'collection',
    title: 'Collection Automne-Hiver 26',
    date: '2026-10-10',
    location: 'Sortie officielle',
    city: '—',
    country: 'Monde',
    description:
      "Lancement de la collection Automne-Hiver 2026 — matières denses, broderies profondes, palette nuit.",
    cta: { label: 'S\u2019inscrire à la pré-vente', href: '/contact' },
  },
  {
    id: 'e-abidjan-showroom',
    type: 'showroom',
    title: 'Showroom privé — Abidjan',
    date: '2026-11-14',
    endDate: '2026-11-16',
    location: 'Plateau',
    city: 'Abidjan',
    country: "Côte d'Ivoire",
    description:
      "Deuxième édition du showroom itinérant, rendez-vous pris à l'avance via notre équipe.",
    cta: { label: 'Prendre rendez-vous', href: '/contact' },
  },
];

export function sortEventsByDate(list: Event[] = EVENTS): Event[] {
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
}

/** Retourne le statut selon la date du jour (ISO). */
export function statusForEvent(e: Event, today: string): EventStatus {
  const end = e.endDate ?? e.date;
  if (today < e.date) return 'upcoming';
  if (today > end) return 'past';
  return 'ongoing';
}

export function groupByMonth(events: Event[]): Record<string, Event[]> {
  return events.reduce<Record<string, Event[]>>((acc, e) => {
    const key = e.date.slice(0, 7); // YYYY-MM
    (acc[key] ??= []).push(e);
    return acc;
  }, {});
}
