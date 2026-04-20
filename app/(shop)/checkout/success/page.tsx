import type { Metadata } from 'next';
import { SuccessClient } from './SuccessClient';

export const metadata: Metadata = {
  title: 'Votre sélection est accueillie',
  description:
    'Merci. Votre commande a bien été reçue. Nos artisans prennent le relais.',
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage(
  props: { searchParams: Promise<{ session_id?: string }> }
) {
  const searchParams = await props.searchParams;
  return <SuccessClient sessionId={searchParams.session_id ?? null} />;
}
