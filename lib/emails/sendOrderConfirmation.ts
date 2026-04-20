import { Resend } from 'resend';
import { render } from '@react-email/render';
import {
  OrderConfirmation,
  type OrderConfirmationItem,
} from './OrderConfirmation';

export type SendOrderConfirmationParams = {
  to: string;
  orderNumber: string;
  orderDate: string;
  customerName?: string | null;
  currency: string;
  items: OrderConfirmationItem[];
  subtotalCents: number;
  totalCents: number;
  shipping?: number | null;
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    postal_code?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
};

/**
 * Envoie le mail de confirmation de commande via Resend.
 *
 * Prod : nécessite que le domaine `chams-adams.com` soit vérifié dans
 * Resend (SPF/DKIM/DMARC). En staging / dev, on peut utiliser l'adresse
 * `onboarding@resend.dev` mais seulement vers soi-même (limitation Resend).
 *
 * Retourne true si l'envoi s'est bien passé, false sinon (et log l'erreur).
 */
export async function sendOrderConfirmation(
  params: SendOrderConfirmationParams
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY manquante — envoi ignoré.');
    return false;
  }

  const resend = new Resend(apiKey);
  const from =
    process.env.CONTACT_EMAIL ?? 'Chams Adams <onboarding@resend.dev>';

  const html = await render(
    OrderConfirmation({
      orderNumber: params.orderNumber,
      orderDate: params.orderDate,
      customerName: params.customerName ?? null,
      items: params.items,
      subtotalCents: params.subtotalCents,
      totalCents: params.totalCents,
      shippingCents: params.shipping ?? null,
      currency: params.currency,
      shippingAddress: params.shippingAddress ?? null,
    }),
    { pretty: false }
  );

  const text = `Votre sélection est accueillie.

Commande n° ${params.orderNumber.slice(-8).toUpperCase()}
Date : ${new Date(params.orderDate).toLocaleDateString('fr-FR')}

${params.items.map((i) => `• ${i.name} — quantité ${i.quantity}`).join('\n')}

Total : ${(params.totalCents / 100).toFixed(0)} ${params.currency}

Nos artisans prennent le relais avec soin.
— Chams Adams, Maison de couture`;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      subject: `Votre sélection est accueillie — commande n° ${params.orderNumber
        .slice(-8)
        .toUpperCase()}`,
      html,
      text,
      replyTo:
        process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com',
    });
    if (error) {
      console.error('[email] resend error:', error);
      return false;
    }
    console.info('[email] sent:', data?.id);
    return true;
  } catch (err) {
    console.error('[email] send failed:', err);
    return false;
  }
}
