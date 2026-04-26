import { Resend } from 'resend';
import { render } from '@react-email/render';
import { Welcome } from './Welcome';
import { Restock } from './Restock';
import { ReturnStatus, type ReturnStatusProps } from './ReturnStatus';
import { CarnetReservation } from './CarnetReservation';
import { PieceTransfer } from './PieceTransfer';

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

export type SendReturnStatusParams = {
  to: string;
  status: ReturnStatusProps['status'];
  reason: string;
};

export async function sendReturnStatusEmail(
  params: SendReturnStatusParams
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const html = await render(
    ReturnStatus({
      status: params.status,
      reason: params.reason,
      siteUrl: SITE,
    }),
    { pretty: false }
  );
  const subjects: Record<ReturnStatusProps['status'], string> = {
    approved: 'Votre demande de retour est approuvée.',
    received: 'Pièce bien reçue.',
    refunded: 'Remboursement émis.',
    rejected: 'Votre demande de retour n’a pas pu être approuvée.',
  };
  const text = `${subjects[params.status]}

Motif : ${params.reason}.

Suivre dans votre compte : ${SITE}/compte/retours

— Chams Adams`;

  try {
    const { error } = await resend.emails.send({
      from: getSender(),
      to: params.to,
      subject: subjects[params.status],
      html,
      text,
      replyTo: process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com',
    });
    if (error) {
      console.error('[email] return status:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] return status failed:', err);
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

export type SendCarnetReservationParams = {
  to: string;
  carnetName: string;
  carnetSlug: string;
  productName: string;
  reservedByEmail: string;
};

export async function sendCarnetReservationEmail(
  params: SendCarnetReservationParams
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const html = await render(
    CarnetReservation({
      carnetName: params.carnetName,
      carnetSlug: params.carnetSlug,
      productName: params.productName,
      reservedByEmail: params.reservedByEmail,
      siteUrl: SITE,
    }),
    { pretty: false }
  );
  const text = `Une attention vous est promise.

${params.productName} vient d'être réservée dans votre carnet « ${params.carnetName} ».

Réservation par : ${params.reservedByEmail}

Voir votre carnet : ${SITE}/compte/carnets/${params.carnetSlug}

— Chams Adams`;

  try {
    const { error } = await resend.emails.send({
      from: getSender(),
      to: params.to,
      subject: `${params.productName} vient d'être réservée pour vous.`,
      html,
      text,
      replyTo: process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com',
    });
    if (error) {
      console.error('[email] carnet reservation:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] carnet reservation failed:', err);
    return false;
  }
}

export type SendPieceTransferParams = {
  to: string;
  pieceNumber: string;
  productName: string;
  fromEmail: string;
  fromName?: string | null;
};

export async function sendPieceTransferEmail(
  params: SendPieceTransferParams
): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const html = await render(
    PieceTransfer({
      pieceNumber: params.pieceNumber,
      productName: params.productName,
      fromEmail: params.fromEmail,
      fromName: params.fromName ?? null,
      siteUrl: SITE,
    }),
    { pretty: false }
  );
  const text = `Une pièce vient à vous.

${params.fromName ?? params.fromEmail} vous transmet « ${params.productName} » (N° ${params.pieceNumber}).

Découvrez son registre : ${SITE}/compte/pieces

— Chams Adams`;

  try {
    const { error } = await resend.emails.send({
      from: getSender(),
      to: params.to,
      subject: `${params.productName} vous a été transmise.`,
      html,
      text,
      replyTo: process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com',
    });
    if (error) {
      console.error('[email] piece transfer:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] piece transfer failed:', err);
    return false;
  }
}
