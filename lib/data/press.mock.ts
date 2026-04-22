export type PressEntry = {
  id: string;
  publication: string;
  /** Nom court ou sigle affiché en logo-typographie. */
  logoText: string;
  date: string; // ISO YYYY-MM-DD
  title: string;
  excerpt: string;
  articleUrl?: string;
  featured?: boolean;
};

/**
 * Données de presse factices — placeholder jusqu'à collecte réelle.
 * Les noms de publications sont conservés pour crédibilité éditoriale
 * mais les citations sont fictives, à remplacer dès que la presse
 * publie.
 */
export const PRESS: PressEntry[] = [
  {
    id: 'p-vogue-afrique',
    publication: 'Vogue Afrique',
    logoText: 'VOGUE',
    date: '2026-03-14',
    title: "« Chams Adams redonne au boubou sa majesté d'origine »",
    excerpt:
      "Une écriture contemporaine qui honore la lignée ouest-africaine sans en épuiser les codes. Une proposition rare, habitée.",
    articleUrl: '#',
    featured: true,
  },
  {
    id: 'p-nataal',
    publication: 'Nataal Magazine',
    logoText: 'Nataal',
    date: '2026-02-02',
    title: 'Portrait — La lignée Chams Adams',
    excerpt:
      "Six générations d'artisans au service d'une vision claire : faire du kaftan un objet de transmission, pas d'exposition.",
    articleUrl: '#',
    featured: true,
  },
  {
    id: 'p-jeuneafrique',
    publication: 'Jeune Afrique',
    logoText: 'Jeune Afrique',
    date: '2026-01-20',
    title: 'Mode et patrimoine : les nouveaux héritiers du grand boubou',
    excerpt:
      "Chams Adams, figure montante d'une couture ouest-africaine affirmée, expose sa démarche au Musée des Civilisations Noires.",
    articleUrl: '#',
  },
  {
    id: 'p-lemonde',
    publication: 'Le Monde — M Le Magazine',
    logoText: 'M',
    date: '2025-12-05',
    title: "Dakar — capitale silencieuse d'une nouvelle haute couture",
    excerpt:
      "Parmi les maisons cartographiées, Chams Adams se détache par une radicalité tranquille — une épure qui ose le grand geste.",
    articleUrl: '#',
  },
  {
    id: 'p-ellefrance',
    publication: 'ELLE France',
    logoText: 'ELLE',
    date: '2025-10-18',
    title: 'Les pièces qu\u2019on transmet : kaftans d\u2019héritage',
    excerpt:
      "Une série éditoriale sur les vêtements qui se transmettent de génération en génération — Chams Adams y tient la page d'ouverture.",
    articleUrl: '#',
  },
  {
    id: 'p-ft-howtospendit',
    publication: 'How To Spend It (Financial Times)',
    logoText: 'HTSI',
    date: '2025-09-22',
    title: 'The quiet rise of West-African haute couture',
    excerpt:
      "Chams Adams fait partie des trois maisons qui redessinent la carte du luxe — discrétion de l'exécution, éclat de l'héritage.",
    articleUrl: '#',
  },
  {
    id: 'p-amina',
    publication: 'Amina Magazine',
    logoText: 'Amina',
    date: '2025-08-10',
    title: 'Entretien — L\u2019atelier Chams Adams',
    excerpt:
      "\u00AB Nous ne cousons pas des vêtements, nous taillons des transmissions. \u00BB Un entretien long, intime, essentiel.",
    articleUrl: '#',
  },
];

export function sortPressByDate(list: PressEntry[] = PRESS): PressEntry[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}
