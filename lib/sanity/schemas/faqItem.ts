import { defineField, defineType } from 'sanity';

export const FAQ_CATEGORIES = [
  { title: 'Livraison', value: 'livraison' },
  { title: 'Sur-mesure', value: 'sur-mesure' },
  { title: 'Entretien', value: 'entretien' },
  { title: 'Paiement', value: 'paiement' },
  { title: 'Retours & échanges', value: 'retours' },
  { title: "L'atelier", value: 'atelier' },
];

export const faqItemSchema = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: { list: FAQ_CATEGORIES },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Réponse',
      type: 'text',
      rows: 5,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordre dans la catégorie',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'category' },
  },
});
