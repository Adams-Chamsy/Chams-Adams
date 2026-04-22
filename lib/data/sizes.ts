/**
 * Tableau de tailles standard Chams Adams.
 *
 * Mesures en centimètres, correspondent aux pièces de prêt-à-porter.
 * Pour un ajustement parfait, passer par le sur-mesure (28 points pris en
 * atelier).
 */

export const SIZE_LABELS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export type SizeLabel = (typeof SIZE_LABELS)[number];

export type MeasurePoint =
  | 'shoulder'
  | 'chest'
  | 'waist'
  | 'hip'
  | 'sleeve'
  | 'length';

export type SizeRow = Record<MeasurePoint, number> & { size: SizeLabel };

export const SIZES: SizeRow[] = [
  { size: 'XS', shoulder: 36, chest: 82, waist: 64, hip: 88, sleeve: 58, length: 135 },
  { size: 'S', shoulder: 37, chest: 86, waist: 68, hip: 92, sleeve: 59, length: 137 },
  { size: 'M', shoulder: 38, chest: 92, waist: 74, hip: 98, sleeve: 60, length: 140 },
  { size: 'L', shoulder: 40, chest: 98, waist: 80, hip: 104, sleeve: 61, length: 143 },
  { size: 'XL', shoulder: 42, chest: 104, waist: 86, hip: 110, sleeve: 62, length: 146 },
  { size: 'XXL', shoulder: 44, chest: 110, waist: 92, hip: 116, sleeve: 63, length: 149 },
];

export const MEASURE_LABELS: Record<MeasurePoint, string> = {
  shoulder: 'Épaules',
  chest: 'Poitrine',
  waist: 'Taille',
  hip: 'Hanches',
  sleeve: 'Manche',
  length: 'Longueur',
};

export const MEASURE_INSTRUCTIONS: Record<MeasurePoint, string> = {
  shoulder:
    "Mesurez d'une pointe d'épaule à l'autre, le long du haut du dos, bras relâchés.",
  chest:
    "Autour de la partie la plus large de la poitrine, ruban parallèle au sol, sans serrer.",
  waist:
    "Autour de la partie la plus fine du torse, généralement juste au-dessus du nombril.",
  hip:
    "Autour de la partie la plus large des hanches, pieds joints, ruban parallèle au sol.",
  sleeve:
    "De la pointe d'épaule au poignet, bras légèrement fléchi, ruban suivant le mouvement.",
  length:
    "Du point le plus haut de l'épaule jusqu'à l'endroit où vous souhaitez que tombe la pièce.",
};

/** Ordre d'affichage canonique dans les tableaux / diagrammes. */
export const MEASURE_ORDER: MeasurePoint[] = [
  'shoulder',
  'chest',
  'waist',
  'hip',
  'sleeve',
  'length',
];

export function cmToInches(cm: number): number {
  return Math.round(cm * 0.3937 * 10) / 10;
}
