import type { Collection } from '@/lib/types/product';

/**
 * Données mock des 4 collections. Source unique consommée par
 * `/collections`, `/collections/[slug]`, filtres boutique, breadcrumbs.
 *
 * À remplacer par un fetch Sanity (`sanityFetch(COLLECTIONS_QUERY)`)
 * sans changer aucune signature côté UI — la forme est identique.
 */
export const COLLECTIONS: Collection[] = [
  {
    id: 'col-ceremonies',
    slug: 'ceremonies',
    name: 'Cérémonies',
    tagline: 'Le kaftan des plus grands jours',
    description:
      'Broderies main, soies précieuses, coupes architecturales — chaque pièce est destinée à marquer le temps.',
    longDescription:
      "Les pièces de cette collection portent le poids et la lumière des grandes occasions. Mariages, rituels, cérémonies d'honneur : le kaftan de cérémonie n'est pas choisi, il est médité. Chaque motif brodé raconte un serment, chaque teinte évoque une mémoire. Trois semaines de travail en moyenne, trois générations de transmission.",
    heroImage: {
      url: '/images/collections/ceremonies.svg',
      alt: 'Collection Cérémonies — Chams Adams',
      width: 1200,
      height: 1500,
    },
    productIds: ['l-aicha', 'la-ndeye', 'le-serigne'],
  },
  {
    id: 'col-tabaski-magal',
    slug: 'tabaski-magal',
    name: 'Tabaski & Magal',
    tagline: "L'élégance qui traverse les générations",
    description:
      "Pour les fêtes qui rassemblent — de la prière au festin, une majesté qui honore les siens.",
    longDescription:
      "La Tabaski, le Magal, le Maouloud. Ces jours où la maison s'ouvre, où la parole circule, où l'habit devient un hommage. Cette collection pense au port collectif : pièces qui se remarquent dans la lumière, qui résistent à la longue journée debout, qui reviennent l'année suivante plus nobles encore, polies par le souvenir.",
    heroImage: {
      url: '/images/collections/tabaski-magal.svg',
      alt: 'Collection Tabaski & Magal — Chams Adams',
      width: 1200,
      height: 1500,
    },
    productIds: ['la-maryama', 'le-cheikh', 'la-khady'],
  },
  {
    id: 'col-pret-a-porter',
    slug: 'pret-a-porter',
    name: 'Prêt-à-porter',
    tagline: 'La majesté sans l’apparat',
    description:
      "Le kaftan au quotidien. Pièces plus légères, gestes fluides, la grâce qui se porte tous les jours.",
    longDescription:
      "On a voulu un kaftan pour la semaine. Pas pour la fête, pas pour la cérémonie — pour le déjeuner, le vernissage, le soir chez les siens. Plus léger, plus fluide, coupes épurées, broderies retenues. L'âme reste, le poids s'allège. L'élégance africaine devient une seconde peau.",
    heroImage: {
      url: '/images/collections/pret-a-porter.svg',
      alt: 'Collection Prêt-à-porter — Chams Adams',
      width: 1200,
      height: 1500,
    },
    productIds: ['le-modou', 'la-adja', 'le-mansour'],
  },
  {
    id: 'col-sur-mesure',
    slug: 'sur-mesure',
    name: 'Sur-mesure',
    tagline: 'Votre vision, notre savoir-faire',
    description:
      "Une pièce unique, composée avec vous, pour vous. Des semaines de conversation, de patron, de broderie.",
    longDescription:
      "Le sur-mesure est notre signature. Tout commence par un entretien : l'occasion, la saison, les souvenirs qui doivent se tisser dans le vêtement. Puis vient la prise de mesures — vingt-huit points, pas un de moins. Puis la sélection des tissus, la conception des motifs avec l'atelier, les essayages. Quatre à six semaines pour une pièce qui n'existera qu'une fois.",
    heroImage: {
      url: '/images/collections/sur-mesure.svg',
      alt: 'Sur-mesure — Chams Adams',
      width: 1200,
      height: 1500,
    },
    productIds: ['la-sokhna', 'le-babacar', 'la-yacine'],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
