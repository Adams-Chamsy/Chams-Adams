import { z } from 'zod';

/**
 * Schéma de validation pour la demande sur-mesure.
 * Source unique utilisée côté client (react-hook-form) et côté serveur
 * (route API) — zéro divergence entre les deux validations.
 */

export const OCCASIONS = [
  'mariage',
  'bapteme',
  'tabaski',
  'magal',
  'autre-ceremonie',
  'sans-occasion',
] as const;

export const BUDGETS = ['a-discuter', '1500-3000', '3000-6000', '6000-plus'] as const;

export const CONTACT_MODES = ['email', 'telephone', 'les-deux'] as const;

export const CRENEAUX = ['matin', 'apres-midi', 'soir', 'peu-importe'] as const;

export const OCCASION_LABELS: Record<(typeof OCCASIONS)[number], string> = {
  mariage: 'Mariage',
  bapteme: 'Baptême',
  tabaski: 'Tabaski',
  magal: 'Magal',
  'autre-ceremonie': 'Autre cérémonie',
  'sans-occasion': 'Pas d’occasion particulière',
};

export const BUDGET_LABELS: Record<(typeof BUDGETS)[number], string> = {
  'a-discuter': 'À discuter',
  '1500-3000': '1 500 – 3 000 €',
  '3000-6000': '3 000 – 6 000 €',
  '6000-plus': '6 000 € et plus',
};

export const CONTACT_MODE_LABELS: Record<(typeof CONTACT_MODES)[number], string> = {
  email: 'Par courriel',
  telephone: 'Par téléphone',
  'les-deux': 'Les deux',
};

export const CRENEAU_LABELS: Record<(typeof CRENEAUX)[number], string> = {
  matin: 'Matin',
  'apres-midi': 'Après-midi',
  soir: 'Soir',
  'peu-importe': 'Peu importe',
};

/** Liste simplifiée de pays utilisés fréquemment + Afrique de l'Ouest. */
export const COUNTRIES = [
  'France',
  'Sénégal',
  "Côte d'Ivoire",
  'Mali',
  'Burkina Faso',
  'Guinée',
  'Bénin',
  'Togo',
  'Cameroun',
  'Belgique',
  'Suisse',
  'Luxembourg',
  'Royaume-Uni',
  'États-Unis',
  'Canada',
  'Autre',
] as const;

export const surMesureSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'Votre prénom est un peu court.')
    .max(80, 'Votre prénom est trop long.'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Votre nom est un peu court.')
    .max(80, 'Votre nom est trop long.'),
  email: z
    .string()
    .trim()
    .email('Cette adresse de courriel ne semble pas valide.'),
  phone: z
    .string()
    .trim()
    .max(30, 'Numéro de téléphone trop long.')
    .optional()
    .or(z.literal('')),
  country: z.enum(COUNTRIES, { message: 'Merci de choisir votre pays.' }),
  city: z
    .string()
    .trim()
    .min(2, 'Merci de renseigner votre ville.')
    .max(80, 'Nom de ville trop long.'),
  occasion: z.enum(OCCASIONS, { message: 'Merci de préciser l’occasion.' }),
  eventDate: z
    .string()
    .optional()
    .or(z.literal('')),
  vision: z
    .string()
    .trim()
    .min(20, 'Décrivez un peu plus votre vision (20 caractères minimum).')
    .max(2000, 'Votre vision est trop longue (2000 caractères max).'),
  budget: z.enum(BUDGETS, { message: 'Merci de choisir un budget indicatif.' }),
  contactMode: z.enum(CONTACT_MODES, { message: 'Mode de contact requis.' }),
  creneau: z.enum(CRENEAUX, { message: 'Créneau requis.' }),
  consent: z.literal(true, {
    message: 'Merci d’accepter pour que nous puissions traiter votre demande.',
  }),
});

export type SurMesureInput = z.infer<typeof surMesureSchema>;
