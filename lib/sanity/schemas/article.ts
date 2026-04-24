import { defineField, defineType } from 'sanity';

export const JOURNAL_CATEGORIES = [
  'Portrait',
  'Héritage',
  'Inspiration',
  'Coulisses',
  'Événements',
] as const;

export const articleSchema = defineType({
  name: 'article',
  title: 'Article Journal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: { list: [...JOURNAL_CATEGORIES] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Chapeau',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texte alternatif', type: 'string' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Temps de lecture (min)',
      type: 'number',
      initialValue: 5,
      validation: (r) => r.min(1).max(60),
    }),
    defineField({
      name: 'body',
      title: 'Corps de l’article',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Texte alternatif' },
            { name: 'caption', type: 'string', title: 'Légende' },
          ],
        },
        {
          type: 'object',
          name: 'pullQuote',
          title: 'Citation',
          fields: [
            { name: 'text', type: 'text', rows: 3 },
            { name: 'author', type: 'string' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
});
