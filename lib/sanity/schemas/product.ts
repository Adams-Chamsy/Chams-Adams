import { defineField, defineType } from 'sanity';

export const productSchema = defineType({
  name: 'product',
  title: 'Produit',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'subtitle', title: 'Sous-titre', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'longDescription',
      title: 'Description longue',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'object',
      fields: [
        { name: 'amount', type: 'number', title: 'Montant (unité : €)' },
        {
          name: 'currency',
          type: 'string',
          title: 'Devise',
          initialValue: 'EUR',
        },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'variants',
      title: 'Variantes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'color', type: 'string', title: 'Code couleur' },
            { name: 'colorName', type: 'string', title: 'Nom couleur' },
            {
              name: 'sizes',
              type: 'array',
              title: 'Tailles disponibles',
              of: [{ type: 'string' }],
              options: {
                list: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
              },
            },
            { name: 'stock', type: 'number', title: 'Stock' },
            {
              name: 'images',
              type: 'array',
              title: 'Images',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    { name: 'alt', type: 'string', title: 'Alt' },
                    {
                      name: 'type',
                      type: 'string',
                      title: 'Type',
                      options: {
                        list: ['flat', 'worn', 'detail', '360'],
                      },
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: { title: 'colorName', subtitle: 'color', media: 'images.0' },
          },
        },
      ],
    }),
    defineField({
      name: 'materials',
      title: 'Matières',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'details',
      title: 'Détails fabrication',
      type: 'object',
      fields: [
        { name: 'craftingTime', type: 'string' },
        { name: 'embroidery', type: 'string' },
        { name: 'origin', type: 'string' },
        {
          name: 'care',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Conseils entretien',
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'isSignature', title: 'Pièce signature', type: 'boolean' }),
    defineField({ name: 'isNew', title: 'Nouveauté', type: 'boolean' }),
    defineField({
      name: 'relatedProducts',
      title: 'Vous aimerez aussi',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'subtitle',
      media: 'variants.0.images.0',
    },
  },
});
