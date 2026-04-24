import { defineField, defineType } from 'sanity';

export const pressEntrySchema = defineType({
  name: 'pressEntry',
  title: 'Parution presse',
  type: 'document',
  fields: [
    defineField({
      name: 'publication',
      title: 'Publication',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logoText',
      title: 'Texte logo (pour affichage typographique)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de parution',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titre de l’article',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Citation',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({ name: 'articleUrl', title: 'Lien article', type: 'url' }),
    defineField({
      name: 'featured',
      title: 'Mise en avant',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'publication',
      subtitle: 'title',
      featured: 'featured',
    },
  },
  orderings: [
    {
      title: 'Plus récent',
      name: 'dateDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
