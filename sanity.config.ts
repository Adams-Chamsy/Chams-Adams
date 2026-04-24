'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './lib/sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/**
 * Sanity Studio config — embarqué dans l'app Next.js à /studio.
 * Les schemas vivent dans lib/sanity/schemas/.
 */
export default defineConfig({
  name: 'chams-adams',
  title: 'Chams Adams — Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.documentTypeListItem('article').title('Journal'),
            S.documentTypeListItem('author').title('Auteurs'),
            S.divider(),
            S.documentTypeListItem('collection').title('Collections'),
            S.documentTypeListItem('product').title('Produits'),
            S.divider(),
            S.documentTypeListItem('event').title('Événements'),
            S.documentTypeListItem('pressEntry').title('Revue de presse'),
            S.documentTypeListItem('faqItem').title('FAQ'),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
