import type { Metadata } from 'next';
import { CheckoutClient } from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Finaliser votre sélection',
  description:
    "Passage au paiement sécurisé. Votre sélection Chams Adams est sur le point d'être accueillie.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
