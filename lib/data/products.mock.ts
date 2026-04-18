import type {
  Product,
  ProductImage,
  ProductSize,
  ProductVariant,
} from '@/lib/types/product';

const ALL_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SIZES_LARGER: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

const BRODERIE_DETAIL_URL = '/images/savoir-faire/broderie-macro.svg';
const TEINTURE_DETAIL_URL = '/images/savoir-faire/teinture-indigo.svg';

// Factory d'images — évite le bruit d'écriture.
function img(
  url: string,
  alt: string,
  opts: Partial<Omit<ProductImage, 'url' | 'alt'>> = {}
): ProductImage {
  return {
    url,
    alt,
    width: 900,
    height: 1125,
    ...opts,
  };
}

// Factory de variantes.
function variant(
  id: string,
  color: string,
  colorName: string,
  primaryUrl: string,
  primaryAlt: string,
  sizes: ProductSize[] = ALL_SIZES,
  stock: number | undefined = 3,
  detailUrl: string = BRODERIE_DETAIL_URL
): ProductVariant {
  return {
    id,
    color,
    colorName,
    sizes,
    stock,
    images: [
      img(primaryUrl, primaryAlt, { isPrimary: true, type: 'flat' }),
      img(detailUrl, `Détail broderie — ${colorName}`, {
        type: 'detail',
        width: 1200,
        height: 1500,
      }),
    ],
  };
}

/**
 * Mock de 12 pièces, 3 par collection — à brancher sur Sanity plus tard
 * (même forme que le type Product, aucun changement de contrat UI).
 */
export const PRODUCTS: Product[] = [
  // --------------------------------------------------------------
  // CÉRÉMONIES
  // --------------------------------------------------------------
  {
    id: 'l-aicha',
    slug: 'l-aicha',
    name: "L'Aïcha",
    subtitle: 'Kaftan de cérémonie',
    description:
      "Pièce signature en bazin riche teinté indigo — l'architecture portée de la maison.",
    longDescription:
      "Trois semaines de broderie au fil de soie dorée. Deux cent quatre-vingts heures de travail. Un bazin riche battu à la main, teinté en trois bains d'indigo puis lustré à la pierre jusqu'à l'éclat final. L'Aïcha n'est pas une robe — c'est une architecture portée, une cathédrale intime.",
    category: 'ceremonies',
    materials: ['bazin-riche', 'soie'],
    price: { amount: 3200, currency: 'EUR' },
    isSignature: true,
    isNew: false,
    tags: ['cérémonie', 'indigo', 'broderie main'],
    relatedProductIds: ['la-ndeye', 'le-serigne', 'le-cheikh'],
    variants: [
      variant(
        'l-aicha-indigo',
        '#1B2951',
        'Indigo profond',
        '/images/products/kaftan-indigo.svg',
        "L'Aïcha en indigo profond, vue de face",
        ALL_SIZES,
        2,
        TEINTURE_DETAIL_URL
      ),
      variant(
        'l-aicha-bordeaux',
        '#4A1520',
        'Bordeaux de nuit',
        '/images/products/kaftan-bordeaux.svg',
        "L'Aïcha en bordeaux de nuit, vue de face",
        SIZES_LARGER
      ),
    ],
    details: {
      craftingTime: '3 semaines',
      embroidery: 'Broderie main au fil de soie dorée, motif central 3 couronnes',
      origin: 'Atelier de Dakar',
      care: [
        'Nettoyage à sec uniquement',
        'Repasser à l\u2019envers, vapeur moyenne',
        'Suspendre sur cintre de bois, jamais plié',
      ],
    },
  },
  {
    id: 'la-ndeye',
    slug: 'la-ndeye',
    name: 'La Ndèye',
    subtitle: 'Kaftan de mariage',
    description:
      "Soie ivoire et dentelle main — la lumière d'un matin de noces.",
    longDescription:
      'Pour les mariées qui choisissent la retenue. La Ndèye joue la carte du clair : ivoire cassé, dentelle ajourée sur la poitrine, fil d\u2019or très discret au bas de la robe. Une pièce qui ne crie pas, mais qui marque à jamais.',
    category: 'ceremonies',
    materials: ['soie', 'dentelle'],
    price: { amount: 2800, currency: 'EUR' },
    tags: ['mariage', 'ivoire', 'dentelle'],
    variants: [
      variant(
        'la-ndeye-ivoire',
        '#F5F0E6',
        'Ivoire satiné',
        '/images/products/kaftan-ivoire.svg',
        'La Ndèye en ivoire satiné'
      ),
    ],
    details: {
      craftingTime: '2 semaines',
      embroidery: 'Dentelle française rapportée main, fil d\u2019or au bas',
      origin: 'Atelier de Dakar',
      care: ['Nettoyage à sec exclusif', 'Protéger de la lumière directe'],
    },
  },
  {
    id: 'le-serigne',
    slug: 'le-serigne',
    name: 'Le Serigne',
    subtitle: 'Grand boubou de cérémonie',
    description:
      "Bazin lustré or et satin brodé — la majesté des hommes d'honneur.",
    longDescription:
      'Un grand boubou pour les cérémonies de la vie : le mariage d\u2019un fils, un baptême, un jour de remerciement. Bazin riche lustré à la pierre, tombant ample, broderie en relief à l\u2019encolure et aux manches. Plus il est porté, plus il prend de la noblesse.',
    category: 'ceremonies',
    materials: ['bazin-riche', 'satin-brode'],
    price: { amount: 3600, currency: 'EUR' },
    isNew: true,
    tags: ['grand boubou', 'homme', 'or'],
    variants: [
      variant(
        'le-serigne-or',
        '#B48F43',
        'Or sahélien',
        '/images/products/kaftan-or.svg',
        'Le Serigne en or sahélien',
        SIZES_LARGER
      ),
      variant(
        'le-serigne-ivoire',
        '#F5F0E6',
        'Ivoire satiné',
        '/images/products/kaftan-ivoire.svg',
        'Le Serigne en ivoire satiné',
        SIZES_LARGER,
        1
      ),
    ],
    details: {
      craftingTime: '4 semaines',
      embroidery: 'Broderie satin relief, encolure et poignets',
      origin: 'Atelier de Dakar',
      care: ['Nettoyage à sec', 'Repasser à la vapeur uniquement'],
    },
  },

  // --------------------------------------------------------------
  // TABASKI & MAGAL
  // --------------------------------------------------------------
  {
    id: 'la-maryama',
    slug: 'la-maryama',
    name: 'La Maryama',
    subtitle: 'Kaftan de Tabaski',
    description:
      "Bazin bordeaux brodé or — la robe qui traverse la journée.",
    longDescription:
      'Pensée pour la Tabaski : assez noble pour la prière, assez solide pour le festin. Bazin riche teinté bordeaux, broderies or concentrées sur la poitrine et les poignets, coupe qui laisse respirer.',
    category: 'tabaski-magal',
    materials: ['bazin-riche'],
    price: { amount: 2400, currency: 'EUR' },
    tags: ['Tabaski', 'bordeaux'],
    variants: [
      variant(
        'la-maryama-bordeaux',
        '#4A1520',
        'Bordeaux fêté',
        '/images/products/kaftan-bordeaux.svg',
        'La Maryama en bordeaux'
      ),
      variant(
        'la-maryama-indigo',
        '#1B2951',
        'Indigo fêté',
        '/images/products/kaftan-indigo.svg',
        'La Maryama en indigo'
      ),
    ],
    details: {
      craftingTime: '2 semaines',
      embroidery: 'Fil d\u2019or au plastron et aux poignets',
      origin: 'Atelier de Dakar',
      care: ['Nettoyage à sec', 'Suspendre sur cintre large'],
    },
  },
  {
    id: 'le-cheikh',
    slug: 'le-cheikh',
    name: 'Le Cheikh',
    subtitle: 'Kaftan de Magal',
    description:
      "Bazin indigo trois bains — la pièce qui revient chaque année plus belle.",
    longDescription:
      "Pensée pour le Magal de Touba : l'indigo qui évoque la prière, le bazin qui résiste aux longs pèlerinages, la coupe ample du grand boubou. C'est la pièce que les fils emprunteront à leur père.",
    category: 'tabaski-magal',
    materials: ['bazin-riche', 'soie'],
    price: { amount: 2600, currency: 'EUR' },
    tags: ['Magal', 'indigo', 'homme'],
    variants: [
      variant(
        'le-cheikh-indigo',
        '#1B2951',
        'Indigo trois bains',
        '/images/products/kaftan-indigo.svg',
        'Le Cheikh en indigo trois bains',
        SIZES_LARGER,
        undefined,
        TEINTURE_DETAIL_URL
      ),
    ],
    details: {
      craftingTime: '3 semaines',
      embroidery: 'Calligraphie or subtile au col',
      origin: 'Atelier de Dakar',
    },
  },
  {
    id: 'la-khady',
    slug: 'la-khady',
    name: 'La Khady',
    subtitle: 'Kaftan de fête',
    description: "Bazin bronze et broderie dorée — l'éclat discret.",
    longDescription:
      "Le bronze pour celles qui préfèrent l'automne au printemps. Bazin teinté terre, broderies or en rayons verticaux, col montant qui élance la silhouette.",
    category: 'tabaski-magal',
    materials: ['bazin-riche'],
    price: { amount: 2200, currency: 'EUR' },
    tags: ['Tabaski', 'bronze'],
    variants: [
      variant(
        'la-khady-bronze',
        '#4A3728',
        'Bronze automnal',
        '/images/products/kaftan-bronze.svg',
        'La Khady en bronze automnal'
      ),
    ],
    details: {
      craftingTime: '2 semaines',
      embroidery: 'Fil d\u2019or en rayons verticaux',
      origin: 'Atelier de Dakar',
    },
  },

  // --------------------------------------------------------------
  // PRÊT-À-PORTER
  // --------------------------------------------------------------
  {
    id: 'le-modou',
    slug: 'le-modou',
    name: 'Le Modou',
    subtitle: 'Kaftan quotidien homme',
    description: "Soie légère et mousseline — la fluidité d'un après-midi.",
    longDescription:
      "Un kaftan pour les jours ordinaires qui comptent : un déjeuner au bord du fleuve, une conversation qui s'éternise. Soie légère, mousseline au col, zéro broderie. L'élégance pour elle-même.",
    category: 'pret-a-porter',
    materials: ['soie', 'mousseline'],
    price: { amount: 1200, currency: 'EUR' },
    isNew: true,
    tags: ['quotidien', 'homme'],
    variants: [
      variant(
        'le-modou-ivoire',
        '#F5F0E6',
        'Ivoire brume',
        '/images/products/kaftan-ivoire.svg',
        'Le Modou en ivoire brume',
        SIZES_LARGER,
        5
      ),
      variant(
        'le-modou-bronze',
        '#4A3728',
        'Bronze brume',
        '/images/products/kaftan-bronze.svg',
        'Le Modou en bronze brume',
        SIZES_LARGER
      ),
    ],
    details: {
      craftingTime: '10 jours',
      origin: 'Atelier de Dakar',
      care: ['Lavage à la main, eau froide', 'Séchage à plat'],
    },
  },
  {
    id: 'la-adja',
    slug: 'la-adja',
    name: "L'Adja",
    subtitle: 'Kaftan noir d\u2019après-midi',
    description: "Soie noire et broderie fil d'or — la simplicité qui parle.",
    longDescription:
      "Pour le soir en ville. Soie noire nette, broderies or retenues au col et aux poignets, ceinture soie incluse. Se porte avec tout — aussi bien au dîner qu'au vernissage.",
    category: 'pret-a-porter',
    materials: ['soie'],
    price: { amount: 1450, currency: 'EUR' },
    tags: ['soir', 'noir'],
    variants: [
      variant(
        'la-adja-noir',
        '#0A0A0A',
        'Noir velours',
        '/images/products/kaftan-noir.svg',
        "L'Adja en noir velours"
      ),
    ],
    details: {
      craftingTime: '10 jours',
      origin: 'Atelier de Dakar',
    },
  },
  {
    id: 'le-mansour',
    slug: 'le-mansour',
    name: 'Le Mansour',
    subtitle: 'Kaftan court, satin brodé',
    description: "Satin or et broderies pointillées — la modernité dans le geste.",
    longDescription:
      "Une coupe plus courte, tombée nette aux mollets. Satin or à fil brisé, broderies pointillées sur toute la surface. Plus contemporain, moins solennel — mais pas moins noble.",
    category: 'pret-a-porter',
    materials: ['satin-brode'],
    price: { amount: 1600, currency: 'EUR' },
    isNew: true,
    tags: ['court', 'homme', 'or'],
    variants: [
      variant(
        'le-mansour-or',
        '#B48F43',
        'Or brisé',
        '/images/products/kaftan-or.svg',
        'Le Mansour en or brisé',
        SIZES_LARGER
      ),
    ],
    details: {
      craftingTime: '2 semaines',
      embroidery: 'Broderie pointillée, 40 000 points',
      origin: 'Atelier de Dakar',
    },
  },

  // --------------------------------------------------------------
  // SUR-MESURE
  // --------------------------------------------------------------
  {
    id: 'la-sokhna',
    slug: 'la-sokhna',
    name: 'La Sokhna',
    subtitle: 'Pièce unique — bordeaux & dentelle',
    description:
      "Composition complète sur-mesure autour du bordeaux profond et d'une dentelle choisie avec vous.",
    longDescription:
      "La Sokhna est une intention plus qu'une pièce. Vous venez avec une lumière en tête, un jour, un souvenir. Nous composons avec vous : choix du bazin, choix de la dentelle française, choix du motif brodé. Prise de mesures en atelier, trois essayages, livraison en quatre à six semaines.",
    category: 'sur-mesure',
    materials: ['bazin-riche', 'dentelle'],
    price: { amount: 4200, currency: 'EUR' },
    tags: ['sur-mesure', 'bordeaux'],
    variants: [
      variant(
        'la-sokhna-bordeaux',
        '#4A1520',
        'Bordeaux composé',
        '/images/products/kaftan-bordeaux.svg',
        'La Sokhna en bordeaux composé',
        ['sur-mesure'],
        undefined
      ),
    ],
    details: {
      craftingTime: '4 à 6 semaines',
      embroidery: 'Motif composé sur-mesure',
      origin: 'Atelier de Dakar',
    },
  },
  {
    id: 'le-babacar',
    slug: 'le-babacar',
    name: 'Le Babacar',
    subtitle: 'Grand boubou sur-mesure',
    description:
      "Bazin bronze et soie — coupe architecturée à la silhouette de l'homme qui le porte.",
    longDescription:
      'Un grand boubou qui n\u2019existera qu\u2019une fois. Le Babacar est pensé pour les hommes d\u2019affaires de noblesse — patron, ambassadeur, aîné respecté. Tombée ample, épaules marquées par la broderie, revers satin. Mesures prises en atelier, sept essayages jusqu\u2019au drapé final.',
    category: 'sur-mesure',
    materials: ['bazin-riche', 'soie'],
    price: { amount: 3800, currency: 'EUR' },
    tags: ['sur-mesure', 'homme', 'bronze'],
    variants: [
      variant(
        'le-babacar-bronze',
        '#4A3728',
        'Bronze taillé',
        '/images/products/kaftan-bronze.svg',
        'Le Babacar en bronze taillé',
        ['sur-mesure'],
        undefined
      ),
    ],
    details: {
      craftingTime: '5 semaines',
      embroidery: 'Broderie épaules et ceinture',
      origin: 'Atelier de Dakar',
    },
  },
  {
    id: 'la-yacine',
    slug: 'la-yacine',
    name: 'La Yacine',
    subtitle: 'Pièce de gala sur-mesure',
    description:
      "Satin noir entièrement brodé main — la pièce qu'on compose pour une soirée qui compte.",
    longDescription:
      "La Yacine est la plus spectaculaire de nos pièces sur-mesure. Satin noir brodé main sur toute la surface : fils d'or, perles de verre, dentelle au col. Seize semaines de travail pour celles qui veulent marquer une date. Trois ateliers collaborent : la teinture, la broderie, la dentelle.",
    category: 'sur-mesure',
    materials: ['satin-brode', 'dentelle'],
    price: { amount: 4500, currency: 'EUR' },
    tags: ['gala', 'noir', 'sur-mesure'],
    variants: [
      variant(
        'la-yacine-noir',
        '#0A0A0A',
        'Noir gala',
        '/images/products/kaftan-noir.svg',
        'La Yacine en noir gala',
        ['sur-mesure'],
        undefined
      ),
    ],
    details: {
      craftingTime: '4 mois',
      embroidery: 'Broderie main intégrale, fils d\u2019or et perles de verre',
      origin: 'Ateliers de Dakar et de Saint-Louis',
    },
  },
];

// --------------------------------------------------------------------
// Helpers d'accès
// --------------------------------------------------------------------

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(
  category: Product['category']
): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export function getAllProductSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}
