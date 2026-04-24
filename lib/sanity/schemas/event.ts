import { defineField, defineType } from 'sanity';

export const EVENT_TYPES = [
  { title: 'Défilé', value: 'defile' },
  { title: 'Showroom', value: 'showroom' },
  { title: 'Cérémonie', value: 'ceremonie' },
  { title: 'Presse', value: 'presse' },
  { title: 'Collection', value: 'collection' },
];

export const eventSchema = defineType({
  name: 'event',
  title: 'Événement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: EVENT_TYPES },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Date de début',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'endDate', title: 'Date de fin', type: 'date' }),
    defineField({ name: 'location', title: 'Lieu', type: 'string' }),
    defineField({ name: 'city', title: 'Ville', type: 'string' }),
    defineField({ name: 'country', title: 'Pays', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Appel à l’action',
      type: 'object',
      fields: [
        { name: 'label', type: 'string', title: 'Libellé' },
        { name: 'href', type: 'string', title: 'Lien' },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'startDate', type: 'type' },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('fr-FR') : '',
      };
    },
  },
  orderings: [
    {
      title: 'Date croissante',
      name: 'dateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],
});
