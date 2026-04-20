/**
 * Partie client-safe du domaine Journal — aucune dépendance Node (fs, path).
 * Sûr à importer depuis des composants `'use client'`.
 */

export type JournalCategory =
  | 'Portrait'
  | 'Héritage'
  | 'Inspiration'
  | 'Coulisses'
  | 'Événements';

export interface JournalArticleMeta {
  slug: string;
  title: string;
  category: JournalCategory | string;
  date: string; // ISO
  author: string;
  coverImage: string;
  excerpt: string;
  readingTime: number;
}

export function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
