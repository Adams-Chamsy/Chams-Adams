import { z } from 'zod';

/**
 * Schéma de validation Contact — partagé client (react-hook-form) et serveur
 * (route API). Source unique, zéro divergence.
 */

export const CONTACT_TOPICS = [
  'information',
  'commande',
  'sur-mesure',
  'presse',
  'partenariat',
  'autre',
] as const;

export const CONTACT_TOPIC_LABELS: Record<(typeof CONTACT_TOPICS)[number], string> = {
  information: 'Renseignement général',
  commande: 'Suivi de commande',
  'sur-mesure': 'Demande sur-mesure',
  presse: 'Presse & rédaction',
  partenariat: 'Partenariat',
  autre: 'Autre',
};

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Votre nom est un peu court.')
    .max(120, 'Votre nom est trop long.'),
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
  topic: z.enum(CONTACT_TOPICS, { message: 'Merci de choisir un sujet.' }),
  message: z
    .string()
    .trim()
    .min(20, 'Votre message est un peu court (20 caractères minimum).')
    .max(3000, 'Votre message est trop long (3000 caractères max).'),
  consent: z.literal(true, {
    message: 'Merci d’accepter pour que nous puissions traiter votre message.',
  }),
});

export type ContactInput = z.infer<typeof contactSchema>;
