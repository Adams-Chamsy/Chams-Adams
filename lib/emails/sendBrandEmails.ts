import { Resend } from 'resend';
import { render } from '@react-email/render';
import { Welcome } from './Welcome';
import { Restock } from './Restock';

function getSender() {
  return (
    process.env.CONTACT_EMAIL ?? 'Chams Adams <onboarding@resend.dev>'
  );
}

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY manquante — envoi ignoré.');
    return null;
  }
  return new Resend(apiKey);
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chams-adams.com';

export async function sendWelcomeEmail(to: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const html = await render(Welcome({ siteUrl: SITE }), { pretty: false });
  const text = `Bienvenue dans le cercle Chams Adams.

Vous serez les premiers à découvrir nos collections, nos défilés, et les
histoires d'artisans que nous racontons dans le journal.

Visiter la maison : ${SITE}

— Chams Adams, Maison de couture`;

  try {
    const { error } = await resend.emails.send({
      from: getSender(),
      to,
      subject: 'Bienvenue dans le cercle Chams Adams.',
      html,
      text,
      replyTo: process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com',
    });
    if (error) {
      console.error('[email] welcome:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] welcome failed:', err);
    return false;
  }
}

export type SendRestockParams = {
  to: string;
  productName: string;
  productSlug: string;
  size?: string | null;
};

export async function sendRestockEmail(
  params: SendRestockParams
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const html = await render(
    Restock({
      productName: params.productName,
      productSlug: params.productSlug,
      size: params.size ?? null,
      siteUrl: SITE,
    }),
    { pretty: false }
  );
  const text = `${params.productName}${params.size ? `, taille ${params.size},` : ''} est à nouveau disponible.

Vous étiez sur la liste, nous vous prévenons en premier.

Composer la pièce : ${SITE}/produit/${params.productSlug}

— Chams Adams`;

  try {
    const { error } = await resend.emails.send({
      from: getSender(),
      to: params.to,
      subject: `${params.productName} est à nouveau disponible.`,
      html,
      text,
      replyTo: process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com',
    });
    if (error) {
      console.error('[email] restock:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] restock failed:', err);
    return false;
  }
}
