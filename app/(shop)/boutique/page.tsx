import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data/products';
import { BoutiqueClient } from './BoutiqueClient';

export const metadata: Metadata = {
  title: 'Boutique',
  description:
    "L'intégralité des pièces Chams Adams disponibles — cérémonies, fêtes, prêt-à-porter, sur-mesure.",
  openGraph: {
    title: 'Boutique — Chams Adams',
    description: "L'intégralité des pièces disponibles.",
  },
};

export default async function BoutiquePage() {
  const products = await getAllProducts();
  return <BoutiqueClient products={products} />;
}
