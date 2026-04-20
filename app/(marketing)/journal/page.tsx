import type { Metadata } from 'next';
import { getAllArticleMetas, getAllCategories } from '@/lib/journal';
import { JournalClient } from './JournalClient';

export const metadata: Metadata = {
  title: 'Journal — Récits de la maison',
  description:
    "Le Journal de Chams Adams : portraits d'artisans, récits d'héritage, inspirations culturelles et coulisses de l'atelier.",
  openGraph: {
    title: 'Journal — Chams Adams',
    description: 'Récits de la maison.',
  },
};

export default async function JournalPage() {
  const articles = await getAllArticleMetas();
  const categories = getAllCategories(articles);
  return <JournalClient articles={articles} categories={categories} />;
}
